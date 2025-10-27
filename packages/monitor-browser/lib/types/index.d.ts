import { MonitorConfig, ReportingLevel } from '@whayl/monitor-core';
import { DomPluginConfig } from './plugins/dom';
import { PerformancePluginConfig } from './plugins/performance';
import { WhiteScreenPluginConfig } from './plugins/whiteScreen';
import { ConsolePluginConfig } from './plugins/console';
import { AnalyticsPluginConfig } from './plugins/analytics';
import { BrowserLogData, BrowserMonitorBase, BrowserMonitorPlugin } from './type';
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
declare class BrowserMonitor implements BrowserMonitorBase {
    private plugins;
    private monitor;
    private abortController;
    private isOnline;
    private cacheLog;
    constructor(config: BrowserMonitorConfig);
    private init;
    reportAllLog(): void;
    private reportCacheLog;
    private setupNetworkListener;
    setFingerprint(value: string): void;
    getFingerprint(): string;
    reportInfo(type: ReportingLevel, data: BrowserLogData): void;
    use(plugin: BrowserMonitorPlugin): void;
    destroy(): void;
}
export default BrowserMonitor;
