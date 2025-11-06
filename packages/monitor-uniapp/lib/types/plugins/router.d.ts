import type { UniAppMonitorPlugin, UniAppMonitorPluginInitArg } from '../type';
export declare class RouterPlugin implements UniAppMonitorPlugin {
    name: string;
    private monitor;
    constructor();
    init(monitor: UniAppMonitorPluginInitArg): void;
    private rewriteRouter;
    private rewriteWXRouter;
    private rewritePage;
    private rewriteApp;
    destroy(): void;
}
