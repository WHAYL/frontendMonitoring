import { MonitorPlugin } from '@whayl/monitor-core';
import type { BrowserMonitorPluginInitArg } from '../type';
export declare class FetchPlugin implements MonitorPlugin {
    name: string;
    private monitor;
    init(monitor: BrowserMonitorPluginInitArg): void;
    private setupFetchMonitoring;
    destroy(): void;
}
