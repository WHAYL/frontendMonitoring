import type { BrowserMonitorPlugin, BrowserMonitorPluginInitArg, ConsolePluginConfig } from '../type';
export declare class ConsolePlugin implements BrowserMonitorPlugin {
    name: string;
    private monitor;
    private originalError;
    private originalWarn;
    private config;
    constructor(config?: ConsolePluginConfig);
    init(monitor: BrowserMonitorPluginInitArg): void;
    private setupConsoleCapture;
    destroy(): void;
}
