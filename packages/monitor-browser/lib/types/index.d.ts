import { LogData, MonitorConfig, MonitorInstance, MonitorPlugin, ReportingLevel } from '@whayl/monitor-core';
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
declare class BrowserMonitor implements MonitorInstance {
    private plugins;
    private monitor;
    private abortController;
    private isOnline;
    private cacheLog;
    constructor(config: BrowserMonitorConfig);
    private init;
    private setupNetworkListener;
    setFingerprint(value: string): void;
    getFingerprint(): string;
    reportInfo(type: ReportingLevel, data: LogData): void;
    use(plugin: MonitorPlugin): void;
    destroy(): void;
}
export default BrowserMonitor;
