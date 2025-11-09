import type { WxAppMonitorPlugin, WxAppMonitorPluginInitArg, ConsolePluginConfig } from '../type';
export declare class ConsolePlugin implements WxAppMonitorPlugin {
    name: string;
    private monitor;
    private originalError;
    private originalWarn;
    private config;
    constructor(config?: ConsolePluginConfig);
    init(monitor: WxAppMonitorPluginInitArg): void;
    private setupConsoleCapture;
    destroy(): void;
}
