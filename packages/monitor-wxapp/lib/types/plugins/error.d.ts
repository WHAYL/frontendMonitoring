import type { WxAppMonitorPlugin, WxAppMonitorPluginInitArg } from '../type';
export declare class ErrorPlugin implements WxAppMonitorPlugin {
    name: string;
    private monitor;
    constructor();
    init(monitor: WxAppMonitorPluginInitArg): void;
    destroy(): void;
}
