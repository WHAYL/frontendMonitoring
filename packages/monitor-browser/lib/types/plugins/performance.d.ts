import type { BrowserMonitorPluginInitArg, BrowserMonitorPlugin, PerformancePluginConfig } from '../type';
export declare class PerformancePlugin implements BrowserMonitorPlugin {
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
    init(monitor: BrowserMonitorPluginInitArg): void;
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
