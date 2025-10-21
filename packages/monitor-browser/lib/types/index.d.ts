import { MonitorConfig, MonitorPlugin } from '@whayl/monitor-core';
interface BrowserMonitorConfig {
    pluginsUse?: {
        xhrPluginEnabled?: boolean;
        fetchPluginEnabled?: boolean;
        domPluginEnabled?: boolean;
        routePluginEnabled?: boolean;
    };
    monitorConfig?: Partial<MonitorConfig>;
}
declare class BrowserMonitor {
    private plugins;
    constructor(config?: BrowserMonitorConfig);
    use(plugin: MonitorPlugin): void;
    destroy(): void;
}
export default BrowserMonitor;
