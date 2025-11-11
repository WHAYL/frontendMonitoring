import type { UniAppMonitorPlugin, UniAppMonitorPluginInitArg } from '../type';
export declare class ErrorPlugin implements UniAppMonitorPlugin {
    name: string;
    abortController: any;
    private monitor;
    constructor();
    init(monitor: UniAppMonitorPluginInitArg): void;
    private h5ErrorHandler;
    destroy(): void;
}
