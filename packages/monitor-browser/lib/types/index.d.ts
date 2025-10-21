import { MonitorConfig } from '@whayl/monitor-core';
interface BrowserMonitorConfig {
    pluginsUse?: {
        xhrPluginEnabled?: boolean;
        fetchPluginEnabled?: boolean;
        domPluginEnabled?: boolean;
        routePluginEnabled?: boolean;
    };
    monitorConfig?: Partial<MonitorConfig>;
}
declare function initBrowserMonitor(config?: BrowserMonitorConfig): Promise<import("@whayl/monitor-core").FrontendMonitor>;
export default initBrowserMonitor;
