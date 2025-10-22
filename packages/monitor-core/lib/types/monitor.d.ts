import { ReportLevelEnum, type MonitorConfig, type ErrorInfo, type MonitorPlugin } from './type';
export declare class FrontendMonitor {
    private config;
    private storageQueue;
    private fingerprint;
    getTimestamp(): number;
    init(config: Partial<MonitorConfig>): void;
    getFingerprint(): string;
    private log;
    error(pluginName: string, message: string, extraData?: Record<string, any>): void;
    warn(pluginName: string, message: string, extraData?: Record<string, any>): void;
    info(pluginName: string, message: string, extraData?: Record<string, any>): void;
    debug(pluginName: string, message: string, extraData?: Record<string, any>): void;
    private checkAndReportStored;
    updateReportLevel(level: keyof typeof ReportLevelEnum): void;
    private report;
    destroy(): void;
}
declare const monitor: FrontendMonitor;
export { ReportLevelEnum, monitor };
export type { MonitorConfig, ErrorInfo, MonitorPlugin };
