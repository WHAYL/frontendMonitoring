import { MonitorPlugin } from '@whayl/monitor-core';
import type { BrowserMonitorPluginInitArg } from '../type';
export declare class XhrPlugin implements MonitorPlugin {
    name: string;
    private monitor;
    private xhrMap;
    private abortController;
    init(monitor: BrowserMonitorPluginInitArg): void;
    private setupXhrMonitoring;
    destroy(): void;
}
