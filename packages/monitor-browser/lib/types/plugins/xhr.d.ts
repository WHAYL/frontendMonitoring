import type { BrowserMonitorPlugin, BrowserMonitorPluginInitArg } from '../type';
export declare class XhrPlugin implements BrowserMonitorPlugin {
    name: string;
    private monitor;
    private xhrMap;
    private abortController;
    init(monitor: BrowserMonitorPluginInitArg): void;
    private setupXhrMonitoring;
    destroy(): void;
}
