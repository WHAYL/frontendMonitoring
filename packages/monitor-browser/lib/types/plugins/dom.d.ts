import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
export declare class DomPlugin implements MonitorPlugin {
    name: string;
    private monitor;
    init(monitor: FrontendMonitor): void;
    destroy(): void;
    private setupDomMonitoring;
}
