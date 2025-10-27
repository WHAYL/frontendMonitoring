import type { BrowserMonitorPluginInitArg, BrowserMonitorPlugin, DomPluginConfig } from '../type';
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
