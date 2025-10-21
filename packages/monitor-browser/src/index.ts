import { monitor, MonitorConfig } from '@whayl/monitor-core';
import { XhrPlugin } from './plugins/xhr.js';
import { FetchPlugin } from './plugins/fetch.js';
import { DomPlugin } from './plugins/dom.js';
import { RoutePlugin } from './plugins/route.js';

// 定义浏览器监控插件配置接口
interface BrowserMonitorConfig {
    pluginsUse?: {
        xhrPluginEnabled?: boolean;
        fetchPluginEnabled?: boolean;
        domPluginEnabled?: boolean;
        routePluginEnabled?: boolean;
    },
    monitorConfig?: Partial<MonitorConfig>;
}

/**
 * 初始化浏览器监控
 * @param config 浏览器监控配置
 */
async function initBrowserMonitor(config: BrowserMonitorConfig = {}) {
    // 默认配置都为 true
    const {
        xhrPluginEnabled = true,
        fetchPluginEnabled = true,
        domPluginEnabled = true,
        routePluginEnabled = true
    } = config.pluginsUse || {};

    // 初始化核心监控
    await monitor.init(config?.monitorConfig || {});

    // 根据配置动态注册插件
    const pluginsToRegister = [
        xhrPluginEnabled && { name: 'XhrPlugin', creator: () => new XhrPlugin() },
        fetchPluginEnabled && { name: 'FetchPlugin', creator: () => new FetchPlugin() },
        domPluginEnabled && { name: 'DomPlugin', creator: () => new DomPlugin() },
        routePluginEnabled && { name: 'RoutePlugin', creator: () => new RoutePlugin() }
    ].filter(Boolean) as { name: string; creator: () => any }[];

    // 注册插件
    pluginsToRegister.forEach(plugin => {
        monitor.use(plugin.creator());
    });

    return monitor;
}

// 默认导出初始化函数
export default initBrowserMonitor