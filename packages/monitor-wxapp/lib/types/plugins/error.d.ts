import type { WxAppMonitorPlugin, WxAppMonitorPluginInitArg } from '../type';
export declare class ErrorPlugin implements WxAppMonitorPlugin {
    name: string;
    private monitor;
    private errorEventHandlers;
    private errMethods;
    constructor();
    init(monitor: WxAppMonitorPluginInitArg): void;
    private wxMethods;
    private rewriteUniApp;
    private rewriteWxApp;
    destroy(): void;
}
