import { MonitorPlugin } from '@whayl/monitor-core';
import type { MonitorPluginInitArg } from '@whayl/monitor-core';
export declare class XhrPlugin implements MonitorPlugin {
    name: string;
    private monitor;
    private xhrMap;
    private abortController;
    init(monitor: MonitorPluginInitArg): void;
    private setupXhrMonitoring;
    destroy(): void;
}
