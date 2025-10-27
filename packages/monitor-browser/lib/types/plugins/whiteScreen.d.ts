import type { BrowserMonitorPlugin, BrowserMonitorPluginInitArg, WhiteScreenPluginConfig } from '../type';
export declare class WhiteScreenPlugin implements BrowserMonitorPlugin {
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
