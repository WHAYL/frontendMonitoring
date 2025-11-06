import { ReportingLevel } from '@whayl/monitor-core';
import { UniAppLogData, UniAppMonitorBase, UniAppMonitorConfig, UniAppMonitorPlugin } from './type';
export { monitorEventBus } from './eventBus';
declare class UniAppMonitor implements UniAppMonitorBase {
    private plugins;
    private monitor;
    private abortController;
    private isOnline;
    private cacheLog;
    constructor(config: UniAppMonitorConfig);
    private init;
    reportAllLog(): void;
    private reportCacheLog;
    private setupNetworkListener;
    setFingerprint(value: string): void;
    getFingerprint(): string;
    private getNavigatorData;
    private getDeviceInfoData;
    reportInfo(type: ReportingLevel, data: UniAppLogData): Promise<void>;
    use(plugin: UniAppMonitorPlugin): void;
    destroy(): void;
}
export default UniAppMonitor;
