import type { UniAppMonitorPlugin, UniAppMonitorPluginInitArg, ConsolePluginConfig } from '../type';
export declare class ConsolePlugin implements UniAppMonitorPlugin {
    name: string;
    private monitor;
    private originalError;
    private originalWarn;
    private config;
    constructor(config?: ConsolePluginConfig);
    init(monitor: UniAppMonitorPluginInitArg): void;
    private setupConsoleCapture;
    destroy(): void;
}
