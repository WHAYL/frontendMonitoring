import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
export declare class PerformancePlugin implements MonitorPlugin {
    name: string;
    private monitor;
    private resourceObserver;
    private navigationObserver;
    private paintObserver;
    private boundHandleRouteChange;
    init(monitor: FrontendMonitor): void;
    run(): void;
    clearEffects(): void;
    destroy(): void;
    private handleRouteChange;
    private setupResourceMonitoring;
    private setupNavigationMonitoring;
    private setupWebVitals;
    private getRating;
}
