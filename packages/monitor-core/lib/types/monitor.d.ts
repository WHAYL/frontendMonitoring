import { ReportLevelEnum, type MonitorConfig, type ErrorInfo, type MonitorPlugin, type LogData } from './type';
export declare class FrontendMonitor {
    private config;
    private storageQueue;
    private removedItems;
    private fingerprint;
    private oldFingerprint;
    init(config: MonitorConfig): void;
    getFingerprint(): string;
    setFingerprint(fingerprint: string): void;
    private log;
    error(info: LogData): void;
    warn(info: LogData): void;
    info(info: LogData): void;
    debug(info: LogData): void;
    private checkAndReportStored;
    updateReportLevel(level: keyof typeof ReportLevelEnum): void;
    getStorageQueue(): ErrorInfo[];
    clearStorageQueue(): void;
    reportStorageQueue(): void;
    reportRemovedItems(): void;
    reportRestInfo(): void;
    private report;
    destroy(): void;
}
declare const monitor: FrontendMonitor;
export { ReportLevelEnum, monitor };
export type { MonitorConfig, ErrorInfo, MonitorPlugin };
