import type { PageRouterData, WxAppMonitorPlugin, WxAppMonitorPluginInitArg } from '../type';
export { WxAppEventBus, WxPageEventBus, UniCreatePageEventBus } from '../eventBus';
export declare class RouterPlugin implements WxAppMonitorPlugin {
    name: string;
    private monitor;
    private routerList;
    private showIndex;
    constructor();
    init(monitor: WxAppMonitorPluginInitArg): void;
    getRouterList(): PageRouterData[];
    private uniWxCreatePage;
    private wxPage;
    private rewriteWXRouter;
    private rewriteWxApp;
    destroy(): void;
}
