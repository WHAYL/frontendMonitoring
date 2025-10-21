import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
export declare class XhrPlugin implements MonitorPlugin {
    name: string;
    private monitor;
    private xhrOpen;
    private xhrSend;
    private requests;
    init(monitor: FrontendMonitor): void;
    destroy(): void;
    private setupXhrMonitoring;
}
