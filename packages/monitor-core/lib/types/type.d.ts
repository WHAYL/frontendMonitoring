import { type EnumValuesForKey } from 'aiy-utils';
export declare const LogCategory: readonly [{
    readonly label: "其他";
    readonly key: "oth";
    readonly value: "oth";
}, {
    readonly label: "页面生命周期";
    readonly key: "pageLifecycle";
    readonly value: "pageLifecycle";
}, {
    readonly label: "js错误，未处理的Promise，console.error";
    readonly key: "error";
    readonly value: "error";
}, {
    readonly label: "xhr,fetch请求信息";
    readonly key: "xhrFetch";
    readonly value: "xhrFetch";
}, {
    readonly label: "页面性能相关数据";
    readonly key: "pagePerformance";
    readonly value: "pagePerformance";
}, {
    readonly label: "系统相关访问数据";
    readonly key: "osView";
    readonly value: "osView";
}, {
    readonly label: "资源加载信息";
    readonly key: "resource";
    readonly value: "resource";
}, {
    readonly label: "用户行为";
    readonly key: "userBehavior";
    readonly value: "userBehavior";
}];
export type LogCategoryValue = EnumValuesForKey<typeof LogCategory, 'value'>;
export declare const LogCategoryKeyValue: {
    readonly oth: "oth";
    readonly pageLifecycle: "pageLifecycle";
    readonly error: "error";
    readonly xhrFetch: "xhrFetch";
    readonly pagePerformance: "pagePerformance";
    readonly osView: "osView";
    readonly resource: "resource";
    readonly userBehavior: "userBehavior";
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
