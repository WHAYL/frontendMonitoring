import type { UniAppMonitorPlugin, UniAppMonitorPluginInitArg } from '../type';
export declare class RequestPlugin implements UniAppMonitorPlugin {
    name: string;
    private monitor;
    constructor();
    init(monitor: UniAppMonitorPluginInitArg): void;
    rewriteHttpRequest(): void;
    destroy(): void;
}
