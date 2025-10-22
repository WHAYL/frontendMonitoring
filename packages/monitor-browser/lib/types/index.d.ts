import { MonitorConfig, MonitorPlugin } from '@whayl/monitor-core';
import { WhiteScreenConfig } from './plugins/whiteScreen';
import { ConsoleConfig } from './plugins/console';
interface BrowserMonitorConfig {
    pluginsUse?: {
        xhrPluginEnabled?: boolean;
        fetchPluginEnabled?: boolean;
        domPluginEnabled?: boolean;
        routePluginEnabled?: boolean;
        performancePluginEnabled?: boolean;
        whiteScreenPluginEnabled?: boolean;
        consolePluginEnabled?: boolean;
    };
    monitorConfig?: Partial<MonitorConfig>;
    whiteScreenConfig?: Partial<WhiteScreenConfig>;
    consoleConfig?: Partial<ConsoleConfig>;
}
declare class BrowserMonitor {
    private plugins;
    constructor(config?: BrowserMonitorConfig);
    use(plugin: MonitorPlugin): void;
    destroy(): void;
}
export default BrowserMonitor;
