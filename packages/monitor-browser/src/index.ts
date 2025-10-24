import { FrontendMonitor, LogData, MonitorConfig, MonitorInstance, MonitorPlugin, ReportingLevel } from '@whayl/monitor-core';
import { XhrPlugin } from './plugins/xhr';
import { FetchPlugin } from './plugins/fetch';
import { DomPlugin, DomPluginConfig } from './plugins/dom';
import { RoutePlugin } from './plugins/route';
import { PerformancePlugin, PerformancePluginConfig } from './plugins/performance';
import { WhiteScreenPluginConfig, WhiteScreenPlugin } from './plugins/whiteScreen';
import { ConsolePluginConfig, ConsolePlugin } from './plugins/console';
import { AnalyticsPlugin, AnalyticsPluginConfig } from './plugins/analytics';
import { getTimestamp, formatTimestamp } from './utils';

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
class BrowserMonitor implements MonitorInstance {
    private plugins: MonitorPlugin[] = [];
    private monitor: FrontendMonitor = new FrontendMonitor();
    private abortController: AbortController | null = null;
    // 添加网络状态监听，离线时缓存日志，上线时自动上报
    private isOnline: boolean = navigator.onLine;
    private cacheLog: { type: ReportingLevel, data: LogData }[] = [];

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
        this.setupNetworkListener();
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

        // 添加beforeunload事件监听器，确保在页面刷新前上报缓存日志
        window.addEventListener('beforeunload', () => {
            this.reportCacheLog();
            this.monitor.reportRestInfo();
        }, {
            signal: this.abortController.signal
        });
    }
    private reportCacheLog(): void {
        if (this.cacheLog.length) {
            this.cacheLog.forEach(item => {
                this.monitor.reportInfo(item.type, item.data);
            });
            this.cacheLog = [];
        }
    }
    private setupNetworkListener(): void {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.reportCacheLog();
            this.monitor.reportInfo('INFO', {
                pluginName: 'monitor-browser',
                url: window.location.href,
                extraData: {},
                timestamp: getTimestamp(),
                date: formatTimestamp(),
                message: '设备恢复在线'
            });
        }, { signal: this.abortController?.signal });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.cacheLog.push({
                type: 'OFF',
                data: {
                    pluginName: 'monitor-browser',
                    url: window.location.href,
                    extraData: {},
                    timestamp: getTimestamp(),
                    date: formatTimestamp(),
                    message: '设备离线'
                }
            });
        }, {
            signal: this.abortController?.signal
        });
    }
    setFingerprint(value: string) {
        this.monitor.setFingerprint(value);
    }
    getFingerprint(): string {
        return this.monitor.getFingerprint();
    }
    reportInfo(type: ReportingLevel, data: LogData) {
        if (!this.isOnline) {
            // 如果当前处于离线状态，则缓存日志
            this.cacheLog.push({ type, data });
            return;
        }
        this.monitor.reportInfo(type, data);
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
        plugin.init({ reportInfo: this.reportInfo.bind(this), getFingerprint: this.getFingerprint.bind(this) });
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