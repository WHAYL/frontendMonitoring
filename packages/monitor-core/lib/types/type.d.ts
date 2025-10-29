import { type EnumValuesForKey } from 'aiy-utils';
export declare const LogCategory: readonly [{
    readonly label: "其他";
    readonly key: "oth";
    readonly value: 0;
}, {
    readonly label: "页面生命周期";
    readonly key: "pageLifecycle";
    readonly value: 1;
}, {
    readonly label: "js错误，未处理的Promise，console.error";
    readonly key: "error";
    readonly value: 2;
}, {
    readonly label: "xhr,fetch请求信息";
    readonly key: "xhrFetch";
    readonly value: 3;
}, {
    readonly label: "页面性能相关数据";
    readonly key: "pagePerformance";
    readonly value: 4;
}, {
    readonly label: "系统相关访问数据";
    readonly key: "osView";
    readonly value: 5;
}, {
    readonly label: "资源加载信息";
    readonly key: "resource";
    readonly value: 6;
}, {
    readonly label: "用户行为";
    readonly key: "userBehavior";
    readonly value: 7;
}];
export type LogCategoryValue = EnumValuesForKey<typeof LogCategory, 'value'>;
export declare const LogCategoryKeyValue: {
    readonly oth: 0;
    readonly pageLifecycle: 1;
    readonly error: 2;
    readonly xhrFetch: 3;
    readonly pagePerformance: 4;
    readonly osView: 5;
    readonly resource: 6;
    readonly userBehavior: 7;
};
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
    logCategory: LogCategoryValue;
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
