import type { PageRouterData, WxAppMonitorPlugin, WxAppMonitorPluginInitArg } from '../type';
export declare class RouterPlugin implements WxAppMonitorPlugin {
    name: string;
    private monitor;
    private routerList;
    private showIndex;
    private eventHandlers;
    constructor();
    init(monitor: WxAppMonitorPluginInitArg): void;
    getRouterList(): PageRouterData[];
    private uniWxCreatePage;
    private wxPage;
    private rewriteWXRouter;
    private rewriteWxApp;
    destroy(): void;
}
