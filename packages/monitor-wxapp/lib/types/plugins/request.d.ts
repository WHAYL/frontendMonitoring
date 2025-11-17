import type { WxAppMonitorPlugin, WxAppMonitorPluginInitArg } from '../type';
export declare class RequestPlugin implements WxAppMonitorPlugin {
    name: string;
    private monitor;
    constructor();
    init(monitor: WxAppMonitorPluginInitArg): void;
    rewriteHttpRequest(): void;
    destroy(): void;
}
