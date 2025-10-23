import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
type MouseEventNames = 'click' | 'dblclick' | 'mousemove' | 'wheel' | 'mousedown' | 'mouseup' | 'mouseover' | 'mouseout' | 'mouseenter' | 'contextmenu';
export interface DomPluginConfig {
    error?: boolean;
    unhandledrejection?: boolean;
    mouseEvents?: {
        [K in MouseEventNames]?: string[] | boolean;
    };
    resize?: boolean;
}
export declare class DomPlugin implements MonitorPlugin {
    name: string;
    private monitor;
    private abortController;
    private config;
    constructor(config?: DomPluginConfig);
    init(monitor: FrontendMonitor): void;
    destroy(): void;
    private setupDomMonitoring;
}
export {};
