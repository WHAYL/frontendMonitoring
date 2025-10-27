import type { AnalyticsPluginConfig, BrowserMonitorPlugin, BrowserMonitorPluginInitArg } from '../type';
export declare class AnalyticsPlugin implements BrowserMonitorPlugin {
    name: string;
    private monitor;
    private abortController;
    private config;
    private ipCached;
    constructor(config?: AnalyticsPluginConfig);
    init(monitor: BrowserMonitorPluginInitArg): void;
    private getTodayDate;
    private getTodayKey;
    private clearOldRecords;
    private increasePV;
    private ensureUV;
    private ensureVV;
    private ensureIP;
    private getClientId;
    private reportNow;
    destroy(): void;
}
export default AnalyticsPlugin;
