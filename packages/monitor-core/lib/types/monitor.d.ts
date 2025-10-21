import { ReportLevelEnum, type MonitorConfig, type ErrorInfo, type MonitorPlugin } from './type';
export declare class FrontendMonitor {
    private config;
    private storageQueue;
    private plugins;
    private fingerprint;
    init(config: Partial<MonitorConfig>): Promise<void>;
    getFingerprint(): string;
    use(plugin: MonitorPlugin): void;
    log(pluginName: string, level: keyof typeof ReportLevelEnum, message: string, error?: Error, data?: any): void;
    error(pluginName: string, message: string, error?: Error, data?: any): void;
    warn(pluginName: string, message: string, error?: Error, data?: any): void;
    info(pluginName: string, message: string, data?: any): void;
    debug(pluginName: string, message: string, data?: any): void;
    private storeLocally;
    checkAndReportStored(): void;
    updateReportLevel(level: keyof typeof ReportLevelEnum): void;
    private report;
    destroy(): void;
}
declare const monitor: FrontendMonitor;
export { ReportLevelEnum, monitor };
export type { MonitorConfig, ErrorInfo, MonitorPlugin };
