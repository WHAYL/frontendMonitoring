import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
export declare class XhrPlugin implements MonitorPlugin {
    name: string;
    private monitor;
    private xhrMap;
    init(monitor: FrontendMonitor): void;
    private setupXhrMonitoring;
    destroy(): void;
}
