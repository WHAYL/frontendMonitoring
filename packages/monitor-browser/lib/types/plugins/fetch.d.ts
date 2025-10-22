import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
export declare class FetchPlugin implements MonitorPlugin {
    name: string;
    private monitor;
    init(monitor: FrontendMonitor): void;
    private setupFetchMonitoring;
    destroy(): void;
}
