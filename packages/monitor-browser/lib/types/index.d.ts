import { MonitorConfig, MonitorPlugin } from '@whayl/monitor-core';
import { DomPluginConfig } from './plugins/dom';
import { PerformancePluginConfig } from './plugins/performance';
import { WhiteScreenPluginConfig } from './plugins/whiteScreen';
import { ConsolePluginConfig } from './plugins/console';
export interface BrowserMonitorConfig {
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
    monitorConfig?: MonitorConfig;
    whiteScreenConfig?: WhiteScreenPluginConfig;
    consoleConfig?: ConsolePluginConfig;
    domConfig?: DomPluginConfig;
    performancePluginConfig?: PerformancePluginConfig;
}
declare class BrowserMonitor {
    private plugins;
    private handleVisibilityChange;
    private handlePageHide;
    constructor(config?: BrowserMonitorConfig);
    private init;
    use(plugin: MonitorPlugin): void;
    destroy(): void;
}
export default BrowserMonitor;
