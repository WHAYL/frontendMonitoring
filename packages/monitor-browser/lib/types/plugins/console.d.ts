import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
export interface ConsolePluginConfig {
    error?: boolean;
    warn?: boolean;
}
export declare class ConsolePlugin implements MonitorPlugin {
    name: string;
    private monitor;
    private originalError;
    private originalWarn;
    private config;
    constructor(config?: ConsolePluginConfig);
    init(monitor: FrontendMonitor): void;
    private setupConsoleCapture;
    destroy(): void;
}
