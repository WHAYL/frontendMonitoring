import type { BrowserMonitorPlugin, BrowserMonitorPluginInitArg } from '../type';
export declare class FetchPlugin implements BrowserMonitorPlugin {
    name: string;
    private monitor;
    init(monitor: BrowserMonitorPluginInitArg): void;
    private setupFetchMonitoring;
    destroy(): void;
}
