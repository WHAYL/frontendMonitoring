import { MonitorConfig, MonitorPlugin } from '@whayl/monitor-core';
import { WhiteScreenConfig } from './plugins/whiteScreen';
interface BrowserMonitorConfig {
    pluginsUse?: {
        xhrPluginEnabled?: boolean;
        fetchPluginEnabled?: boolean;
        domPluginEnabled?: boolean;
        routePluginEnabled?: boolean;
        performancePluginEnabled?: boolean;
        whiteScreenPluginEnabled?: boolean;
    };
    monitorConfig?: Partial<MonitorConfig>;
    whiteScreenConfig?: Partial<WhiteScreenConfig>;
}
declare class BrowserMonitor {
    private plugins;
    constructor(config?: BrowserMonitorConfig);
    use(plugin: MonitorPlugin): void;
    destroy(): void;
}
export default BrowserMonitor;
