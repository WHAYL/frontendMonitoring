import { MonitorConfig, MonitorPlugin } from '@whayl/monitor-core';
import { DomPluginConfig } from './plugins/dom';
import { PerformancePluginConfig } from './plugins/performance';
import { WhiteScreenPluginConfig } from './plugins/whiteScreen';
import { ConsolePluginConfig } from './plugins/console';
import { AnalyticsPluginConfig } from './plugins/analytics';
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
declare class BrowserMonitor {
    private plugins;
    private monitor;
    private abortController;
    constructor(config: BrowserMonitorConfig);
    private init;
    setFingerprint(value: string): void;
    use(plugin: MonitorPlugin): void;
    destroy(): void;
}
export default BrowserMonitor;
