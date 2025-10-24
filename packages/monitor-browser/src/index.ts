import { FrontendMonitor, MonitorConfig, MonitorPlugin } from '@whayl/monitor-core';
import { XhrPlugin } from './plugins/xhr';
import { FetchPlugin } from './plugins/fetch';
import { DomPlugin, DomPluginConfig } from './plugins/dom';
import { RoutePlugin } from './plugins/route';
import { PerformancePlugin, PerformancePluginConfig } from './plugins/performance';
import { WhiteScreenPluginConfig, WhiteScreenPlugin } from './plugins/whiteScreen';
import { ConsolePluginConfig, ConsolePlugin } from './plugins/console';
import { AnalyticsPlugin, AnalyticsPluginConfig } from './plugins/analytics';

// 定义浏览器监控插件配置接口
export interface BrowserMonitorConfig {
    monitorConfig: MonitorConfig;
    pluginsUse?: {
        xhrPluginEnabled?: boolean;
        fetchPluginEnabled?: boolean;
        domPluginEnabled?: boolean;
        routePluginEnabled?: boolean;
        performancePluginEnabled?: boolean;
        whiteScreenPluginEnabled?: boolean;
        consolePluginEnabled?: boolean;
        analyticsPluginEnabled?: boolean;
    };
    whiteScreenPluginConfig?: WhiteScreenPluginConfig;
    consolePluginConfig?: ConsolePluginConfig;
    domPluginConfig?: DomPluginConfig;
    performancePluginConfig?: PerformancePluginConfig;
    analyticsPluginConfig?: AnalyticsPluginConfig;
}

/**
 * 浏览器监控类
 */
class BrowserMonitor {
    private plugins: MonitorPlugin[] = [];
    private monitor: FrontendMonitor = new FrontendMonitor();
    private abortController: AbortController | null = null;

    constructor(config: BrowserMonitorConfig) {
        // 默认配置都为 true
        const {
            xhrPluginEnabled = true,
            fetchPluginEnabled = true,
            domPluginEnabled = true,
            routePluginEnabled = true,
            performancePluginEnabled = true,
            whiteScreenPluginEnabled = true,
            consolePluginEnabled = true,
            analyticsPluginEnabled = true
        } = config.pluginsUse || {};

        // 初始化核心监控
        this.monitor.init(config?.monitorConfig);

        // 根据配置动态注册插件
        const pluginsToRegister = [
            xhrPluginEnabled && { name: 'XhrPlugin', creator: () => new XhrPlugin() },
            fetchPluginEnabled && { name: 'FetchPlugin', creator: () => new FetchPlugin() },
            domPluginEnabled && { name: 'DomPlugin', creator: () => new DomPlugin(config?.domPluginConfig || {}) },
            routePluginEnabled && { name: 'RoutePlugin', creator: () => new RoutePlugin() },
            performancePluginEnabled && { name: 'PerformancePlugin', creator: () => new PerformancePlugin(config?.performancePluginConfig || {}) },
            whiteScreenPluginEnabled && { name: 'WhiteScreenPlugin', creator: () => new WhiteScreenPlugin(config?.whiteScreenPluginConfig || {}) },
            consolePluginEnabled && { name: 'ConsolePlugin', creator: () => new ConsolePlugin(config?.consolePluginConfig || {}) },
            analyticsPluginEnabled && { name: 'AnalyticsPlugin', creator: () => new AnalyticsPlugin(config?.analyticsPluginConfig || {}) }
        ].filter(Boolean) as { name: string; creator: () => any }[];

        // 注册插件
        pluginsToRegister.forEach(plugin => {
            this.use(plugin.creator());
        });

        this.init();
    }

    private init(): void {
        // 创建AbortController来管理所有事件监听器
        this.abortController = new AbortController();

        // 添加事件监听器，优先使用visibilitychange事件，如果不支持则使用pagehide事件
        if (typeof document !== 'undefined' && 'hidden' in document) {
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    this.monitor.reportRestInfo();
                }
            }, {
                signal: this.abortController.signal
            });
        } else if (typeof window !== 'undefined' && 'pagehide' in window) {
            // pagehide事件在现代浏览器中得到良好支持
            window.addEventListener('pagehide', () => {
                this.monitor.reportRestInfo();
            }, {
                signal: this.abortController.signal
            });
        }
    }
    setFingerprint(value: string) {
        this.monitor.setFingerprint(value);
    }

    /**
     * 添加插件
     * @param plugin 监控插件
     */
    use(plugin: MonitorPlugin): void {
        // 检查插件是否包含必需的name属性
        if (!plugin.name) {
            console.error('Plugin must have a name property');
            return;
        }

        // 检查插件是否包含必需的init方法
        if (typeof plugin.init !== 'function') {
            console.error(`Plugin ${plugin.name} must have an init method`);
            return;
        }

        // 检查插件是否已存在
        const existingPlugin = this.plugins.find(p => p.name === plugin.name);
        if (existingPlugin) {
            console.warn(`Plugin ${plugin.name} already exists, skipping addition.`);
            return;
        }

        this.plugins.push(plugin);
        // 初始化插件
        plugin.init(this.monitor);
    }

    /**
     * 销毁监控实例
     */
    destroy(): void {
        // 使用abort controller一次性取消所有事件监听器
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }

        // 销毁所有插件
        this.plugins.forEach(plugin => {
            if (plugin.destroy) {
                plugin.destroy();
            }
        });

        // 清空插件列表
        this.plugins = [];
    }
}

// 默认导出浏览器监控类
export default BrowserMonitor;