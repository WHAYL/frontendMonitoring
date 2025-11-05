import type { UniAppMonitorPlugin, UniAppMonitorPluginInitArg } from '../type';
export declare class ErrorPlugin implements UniAppMonitorPlugin {
    name: string;
    private monitor;
    constructor();
    init(monitor: UniAppMonitorPluginInitArg): void;
    destroy(): void;
}
