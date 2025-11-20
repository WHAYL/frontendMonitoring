import { ReportingLevel } from '@whayl/monitor-core';
import { BrowserLogData, BrowserMonitorBase, BrowserMonitorConfig, BrowserMonitorPlugin } from './type';
export { monitorEventBus } from './eventBus';
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
    private getNavigatorData;
    private getDeviceInfoData;
    diyReportInfo(type: ReportingLevel, data: Omit<BrowserLogData, 'url' | 'date' | 'timestamp' | 'pluginName'>): void;
    reportInfo(type: ReportingLevel, data: BrowserLogData): void;
    use(plugin: BrowserMonitorPlugin): void;
    destroy(): void;
}
export default BrowserMonitor;
