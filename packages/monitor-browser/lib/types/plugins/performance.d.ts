import { MonitorPlugin } from '@whayl/monitor-core';
import type { MonitorPluginInitArg } from '@whayl/monitor-core';
export interface PerformancePluginConfig {
    longTaskEnabled?: boolean;
    memoryEnabled?: boolean;
    fpsEnabled?: boolean;
    resourceEnabled?: boolean;
    navigationEnabled?: boolean;
    webVitalsEnabled?: boolean;
}
export declare class PerformancePlugin implements MonitorPlugin {
    name: string;
    private monitor;
    private resourceObserver;
    private navigationObserver;
    private paintObserver;
    private longTaskObserver;
    private fpsIntervalId;
    private memoryIntervalId;
    private config;
    private abortController;
    private boundHandleRouteChange;
    constructor(config?: PerformancePluginConfig);
    init(monitor: MonitorPluginInitArg): void;
    run(): void;
    clearEffects(): void;
    private setupLongTaskMonitoring;
    private setupMemoryMonitoring;
    private estimateMemoryUsage;
    private detectMemoryLeak;
    private setupFPSMonitoring;
    destroy(): void;
    private handleRouteChange;
    private setupResourceMonitoring;
    private setupNavigationMonitoring;
    private setupWebVitals;
    private getRating;
}
