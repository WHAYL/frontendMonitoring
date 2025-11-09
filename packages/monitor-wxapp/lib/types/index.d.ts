import { ReportingLevel } from '@whayl/monitor-core';
import { WxAppLogData, WxAppMonitorBase, WxAppMonitorConfig, WxAppMonitorPlugin } from './type';
export { monitorEventBus } from './eventBus';
declare class WxAppMonitor implements WxAppMonitorBase {
    private plugins;
    private monitor;
    private config;
    private isOnline;
    private cacheLog;
    constructor(config: WxAppMonitorConfig);
    private init;
    reportAllLog(): void;
    private reportCacheLog;
    private setupNetworkListener;
    setFingerprint(value: string): void;
    getFingerprint(): string;
    private getNavigatorData;
    private getDeviceInfoData;
    reportInfo(type: ReportingLevel, data: WxAppLogData): Promise<void>;
    use(plugin: WxAppMonitorPlugin): void;
    destroy(): void;
}
export default WxAppMonitor;
