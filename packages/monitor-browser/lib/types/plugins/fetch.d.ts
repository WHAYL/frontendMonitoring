import { MonitorPlugin } from '@whayl/monitor-core';
import type { MonitorPluginInitArg } from '@whayl/monitor-core';
export declare class FetchPlugin implements MonitorPlugin {
    name: string;
    private monitor;
    init(monitor: MonitorPluginInitArg): void;
    private setupFetchMonitoring;
    destroy(): void;
}
