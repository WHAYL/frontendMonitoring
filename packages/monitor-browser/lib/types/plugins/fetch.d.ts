import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
export declare class FetchPlugin implements MonitorPlugin {
    name: string;
    private monitor;
    private originalFetch;
    init(monitor: FrontendMonitor): void;
    destroy(): void;
    private setupFetchMonitoring;
}
