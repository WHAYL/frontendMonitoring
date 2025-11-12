import type { UniAppMonitorPlugin, UniAppMonitorPluginInitArg } from '../type';
export declare class RouterPlugin implements UniAppMonitorPlugin {
    name: string;
    private monitor;
    private routerList;
    private onAppHideHandel;
    private navEventHandlers;
    constructor();
    init(monitor: UniAppMonitorPluginInitArg): void;
    private rewriteRouter;
    destroy(): void;
}
