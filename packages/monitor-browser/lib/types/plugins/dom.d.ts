import type { BrowserMonitorPluginInitArg, BrowserMonitorPlugin } from '../type';
type MouseEventNames = 'click' | 'dblclick' | 'mousemove' | 'wheel' | 'mousedown' | 'mouseup' | 'mouseover' | 'mouseout' | 'mouseenter' | 'contextmenu';
export interface DomPluginConfig {
    error?: boolean;
    unhandledrejection?: boolean;
    mouseEvents?: {
        [K in MouseEventNames]?: string[] | boolean;
    };
    resize?: boolean;
    clickPath?: boolean;
}
export declare class DomPlugin implements BrowserMonitorPlugin {
    name: string;
    private monitor;
    private abortController;
    private config;
    constructor(config?: DomPluginConfig);
    init(monitor: BrowserMonitorPluginInitArg): void;
    destroy(): void;
    private setupDomMonitoring;
    private describeElement;
    private buildPathFromEvent;
    private handleClickPath;
}
export {};
