import { monitor, MonitorConfig, MonitorPlugin } from '@whayl/monitor-core';
import { XhrPlugin } from './plugins/xhr';
import { FetchPlugin } from './plugins/fetch';
import { DomPlugin, DomPluginConfig } from './plugins/dom';
import { RoutePlugin } from './plugins/route';
import { PerformancePlugin } from './plugins/performance';
import { WhiteScreenPluginConfig, WhiteScreenPlugin } from './plugins/whiteScreen';
import { ConsolePluginConfig, ConsolePlugin } from './plugins/console';

// 定义浏览器监控插件配置接口
export interface BrowserMonitorConfig {
    pluginsUse?: {
        xhrPluginEnabled?: boolean;
        fetchPluginEnabled?: boolean;
        domPluginEnabled?: boolean;
        routePluginEnabled?: boolean;
        performancePluginEnabled?: boolean;
        whiteScreenPluginEnabled?: boolean;
        consolePluginEnabled?: boolean;
    };
    monitorConfig?: MonitorConfig;
    whiteScreenConfig?: WhiteScreenPluginConfig;
    consoleConfig?: ConsolePluginConfig;
    domConfig?: DomPluginConfig;
}

/**
 * 浏览器监控类
 */
class BrowserMonitor {
    private plugins: MonitorPlugin[] = [];
    // 存储事件监听回调函数的引用，以便在销毁时移除监听
    private handleVisibilityChange: () => void;
    private handlePageHide: () => void;

    constructor(config: BrowserMonitorConfig = {}) {
        // 默认配置都为 true
        const {
            xhrPluginEnabled = true,
            fetchPluginEnabled = true,
            domPluginEnabled = true,
            routePluginEnabled = true,
            performancePluginEnabled = true,
            whiteScreenPluginEnabled = true,
            consolePluginEnabled = true
        } = config.pluginsUse || {};

        // 初始化核心监控
        monitor.init(config?.monitorConfig || {});

        // 根据配置动态注册插件
        const pluginsToRegister = [
            xhrPluginEnabled && { name: 'XhrPlugin', creator: () => new XhrPlugin() },
            fetchPluginEnabled && { name: 'FetchPlugin', creator: () => new FetchPlugin() },
            domPluginEnabled && { name: 'DomPlugin', creator: () => new DomPlugin(config?.domConfig || {}) },
            routePluginEnabled && { name: 'RoutePlugin', creator: () => new RoutePlugin() },
            performancePluginEnabled && { name: 'PerformancePlugin', creator: () => new PerformancePlugin() },
            whiteScreenPluginEnabled && { name: 'WhiteScreenPlugin', creator: () => new WhiteScreenPlugin(config?.whiteScreenConfig || {}) },
            consolePluginEnabled && { name: 'ConsolePlugin', creator: () => new ConsolePlugin(config?.consoleConfig || {}) }
        ].filter(Boolean) as { name: string; creator: () => any }[];

        // 注册插件
        pluginsToRegister.forEach(plugin => {
            this.use(plugin.creator());
        });

        this.init();
    }

    private init(): void {
        // 定义visibilitychange事件处理函数
        this.handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                monitor.reportRestInfo();
            }
        };

        // 定义pagehide事件处理函数
        this.handlePageHide = () => {
            monitor.reportRestInfo();
        };

        // 添加事件监听器，优先使用visibilitychange事件，如果不支持则使用pagehide事件
        if (typeof document !== 'undefined' && 'hidden' in document) {
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
        } else if (typeof window !== 'undefined' && 'pagehide' in window) {
            // pagehide事件在现代浏览器中得到良好支持
            window.addEventListener('pagehide', this.handlePageHide);
        }
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
        plugin.init(monitor);
    }

    /**
     * 销毁监控实例
     */
    destroy(): void {
        // 移除事件监听器
        if (typeof document !== 'undefined' && 'hidden' in document) {
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        } else if (typeof window !== 'undefined' && 'pagehide' in window) {
            window.removeEventListener('pagehide', this.handlePageHide);
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