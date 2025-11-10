import type { WxAppMonitorPlugin, WxAppMonitorPluginInitArg } from '../type';
export declare class RouterPlugin implements WxAppMonitorPlugin {
    name: string;
    private monitor;
    private routerList;
    private showIndex;
    constructor();
    init(monitor: WxAppMonitorPluginInitArg): void;
    getRouterList(): {
        page: string;
        timestamp: string;
        routeEventId: string;
    }[];
    private uniWxCreatePage;
    private wxPage;
    private rewriteWXRouter;
    private rewriteWxApp;
    destroy(): void;
}
