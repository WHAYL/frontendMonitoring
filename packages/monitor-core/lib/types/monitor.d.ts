import { ReportLevelEnum, type MonitorConfig, type ErrorInfo, type LogData, ReportingLevel } from './type';
export declare class FrontendMonitor {
    private config;
    private storageQueue;
    private removedItems;
    private fingerprint;
    private oldFingerprint;
    init(config: MonitorConfig): void;
    updateConfig(newConfig: Partial<MonitorConfig>): void;
    getFingerprint(): string;
    setFingerprint(fingerprint: string): void;
    private log;
    reportInfo(level: ReportingLevel, info: LogData): void;
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
