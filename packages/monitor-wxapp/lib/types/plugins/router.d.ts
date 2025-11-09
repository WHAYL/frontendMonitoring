import type { WxAppMonitorPlugin, WxAppMonitorPluginInitArg } from '../type';
export declare class RouterPlugin implements WxAppMonitorPlugin {
    name: string;
    private monitor;
    private routerList;
    constructor();
    init(monitor: WxAppMonitorPluginInitArg): void;
    private inTabbarPage;
    private setTabbarPageProxy;
    private rewriteWXRouter;
    private rewriteWxApp;
    destroy(): void;
}
