import { MonitorPlugin } from '@whayl/monitor-core';
import type { BrowserMonitorPluginInitArg } from '../type';
export interface WhiteScreenPluginConfig {
    keySelectors?: string[];
    checkInterval?: number;
    timeout?: number;
}
export declare class WhiteScreenPlugin implements MonitorPlugin {
    name: string;
    private monitor;
    private config;
    private timer;
    private startTime;
    private endTime;
    private resolved;
    private boundHandleRouteChange;
    constructor(config?: WhiteScreenPluginConfig);
    init(monitor: BrowserMonitorPluginInitArg): void;
    run(): void;
    clearEffects(): void;
    destroy(): void;
    private handleRouteChange;
    private startCheck;
    private checkKeyElements;
    private isColorTransparent;
    private isElementVisible;
    private report;
}
