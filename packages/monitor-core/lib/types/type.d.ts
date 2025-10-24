import type { FrontendMonitor } from "./monitor";
export declare enum ReportLevelEnum {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
    OFF = 4
}
export type ReportingLevel = keyof typeof ReportLevelEnum;
export interface MonitorConfig {
    platform: string;
    reportLevel: ReportingLevel;
    enabled: boolean;
    uploadHandler: null | ((data: ErrorInfo | ErrorInfo[]) => void);
    maxStorageCount?: number;
    fingerprint?: string;
}
export interface ErrorInfo {
    level: ReportingLevel;
    message: string;
    stack?: string;
    timestamp: number;
    url: string;
    pluginName?: string;
    fingerprint?: string;
    userAgent?: string;
    [key: string]: any;
}
export interface MonitorPlugin {
    name: string;
    init: (monitor: FrontendMonitor) => void;
    destroy?: () => void;
}
export interface LogData {
    pluginName: string;
    message: string;
    url: string;
    extraData: Record<string, any>;
    timestamp: number;
    date: string;
}
