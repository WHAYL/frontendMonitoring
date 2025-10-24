import type { MonitorPluginInitArg, MonitorPlugin } from '@whayl/monitor-core';
export interface AnalyticsPluginConfig {
    ipProvider?: () => Promise<string | null>;
}
export declare class AnalyticsPlugin implements MonitorPlugin {
    name: string;
    private monitor;
    private abortController;
    private config;
    private ipCached;
    constructor(config?: AnalyticsPluginConfig);
    init(monitor: MonitorPluginInitArg): void;
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
