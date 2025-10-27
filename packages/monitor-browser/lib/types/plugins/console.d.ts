import type { BrowserMonitorPlugin, BrowserMonitorPluginInitArg } from '../type';
export interface ConsolePluginConfig {
    error?: boolean;
    warn?: boolean;
}
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
