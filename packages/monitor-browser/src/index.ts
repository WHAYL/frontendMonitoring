import { monitor, MonitorConfig, MonitorPlugin } from '@whayl/monitor-core';
import { XhrPlugin } from './plugins/xhr';
import { FetchPlugin } from './plugins/fetch';
import { DomPlugin } from './plugins/dom';
import { RoutePlugin } from './plugins/route';
import { PerformancePlugin } from './plugins/performance';
import { WhiteScreenConfig, WhiteScreenPlugin } from './plugins/whiteScreen';

// 定义浏览器监控插件配置接口
interface BrowserMonitorConfig {
    pluginsUse?: {
        xhrPluginEnabled?: boolean;
        fetchPluginEnabled?: boolean;
        domPluginEnabled?: boolean;
        routePluginEnabled?: boolean;
        performancePluginEnabled?: boolean;
        whiteScreenPluginEnabled?: boolean
    },
    monitorConfig?: Partial<MonitorConfig>;
    whiteScreenConfig?: Partial<WhiteScreenConfig>;
}

/**
 * 浏览器监控类
 */
class BrowserMonitor {
    private plugins: MonitorPlugin[] = [];
    constructor(config: BrowserMonitorConfig = {}) {
        // 默认配置都为 true
        const {
            xhrPluginEnabled = true,
            fetchPluginEnabled = true,
            domPluginEnabled = true,
            routePluginEnabled = true,
            performancePluginEnabled = true,
            whiteScreenPluginEnabled = true
        } = config.pluginsUse || {};

        // 初始化核心监控
        monitor.init(config?.monitorConfig || {});

        // 根据配置动态注册插件
        const pluginsToRegister = [
            xhrPluginEnabled && { name: 'XhrPlugin', creator: () => new XhrPlugin() },
            fetchPluginEnabled && { name: 'FetchPlugin', creator: () => new FetchPlugin() },
            domPluginEnabled && { name: 'DomPlugin', creator: () => new DomPlugin() },
            routePluginEnabled && { name: 'RoutePlugin', creator: () => new RoutePlugin() },
            performancePluginEnabled && { name: 'PerformancePlugin', creator: () => new PerformancePlugin() },
            whiteScreenPluginEnabled && { name: 'WhiteScreenPlugin', creator: () => new WhiteScreenPlugin(config?.whiteScreenConfig || {}) }
        ].filter(Boolean) as { name: string; creator: () => any }[];

        // 注册插件
        pluginsToRegister.forEach(plugin => {
            this.use(plugin.creator());
        });
    }

    /**
     * 添加插件
     * @param plugin 监控插件
     */
    use(plugin: MonitorPlugin): void {
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