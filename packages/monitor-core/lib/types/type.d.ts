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
export interface DeviceInfo {
    width: number;
    height: number;
    pixelRatio: number;
}
export interface LogData {
    pluginName: string;
    message: string;
    url: string;
    extraData: Record<string, any>;
    timestamp: number;
    date: string;
    deviceInfo: DeviceInfo;
}
export interface ErrorInfo extends LogData {
    level: ReportingLevel;
    message: string;
    stack?: string;
    fingerprint: string;
    oldFingerprint: string;
    platform: string;
    [key: string]: any;
}
