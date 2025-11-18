import { ReportingLevel, type LogData, MonitorConfig } from '@whayl/monitor-core';
import { type SetOptional } from 'aiy-utils';
export interface AnalyticsPluginConfig {
    ipProvider?: () => Promise<string | null>;
}
export interface ConsolePluginConfig {
    error?: boolean;
    warn?: boolean;
}
export interface UniAppMonitorConfig {
    monitorConfig: MonitorConfig;
    pluginsUse?: {
        consolePluginEnabled?: boolean;
        errorPluginEnabled?: boolean;
        routerPluginEnabled?: boolean;
        requestPluginEnabled?: boolean;
        behaviorPluginEnabled?: boolean;
    };
    consolePluginConfig?: ConsolePluginConfig;
}
export interface PartialNavigator {
    userAgent: string;
    platform: string;
    language: string;
    onLine: boolean;
    cookieEnabled: boolean;
    [key: string]: any;
}
export interface UniAppLogData extends SetOptional<LogData, 'deviceInfo'> {
    navigator?: PartialNavigator;
}
export type ReportInfo = (level: ReportingLevel, data: UniAppLogData) => void;
export interface UniAppMonitorPluginInitArg {
    reportInfo: ReportInfo;
    getFingerprint: () => string;
}
export interface UniAppMonitorPlugin {
    name: string;
    init: (data: UniAppMonitorPluginInitArg) => void;
    destroy?: () => void;
}
export interface UniAppMonitorBase {
    reportInfo: ReportInfo;
    setFingerprint: (value: string) => void;
    getFingerprint: () => string;
    use: (plugin: UniAppMonitorPlugin) => void;
    destroy: () => void;
}
export interface ConsoleExtraData {
    args: any[];
    stack: string | undefined;
}
export interface DomErrorExtraData {
    message: string;
    filename: string;
    lineno: number;
    colno: number;
    error: any;
}
export interface DomUnhandledRejectionExtraData {
    type: string;
    promise: Promise<any>;
    reason: any;
    reasonType: string;
    isError: boolean;
    errorMessage?: string;
    errorStack?: string;
    errorName?: string;
}
export interface UniSystemInfo {
    deviceId: string;
    deviceType: 'phone' | 'pad' | 'pc' | 'unknow';
    deviceBrand: string;
    deviceModel: string;
    deviceOrientation: 'portrait' | 'landscape';
    devicePixelRatio: number;
    osName: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'harmonyos';
    osVersion: string;
    osLanguage: string;
    osTheme: 'light' | 'dark';
    osAndroidAPILevel: string;
    romName: string;
    romVersion: string;
    browserName: string;
    browserVersion: string;
    hostName: string;
    hostVersion: string;
    hostLanguage: string;
    hostTheme: 'light' | 'dark';
    hostFontSizeSetting: number;
    hostPackageName: string;
    hostSDKVersion: string;
    uniPlatform: string;
    uniCompileVersion: string;
    uniCompilerVersion: string;
    uniRuntimeVersion: string;
    appId: string;
    appName: string;
    appVersion: string;
    appVersionCode: string;
    appWgtVersion: string;
    appLanguage: string;
    ua: string;
    screenWidth: number;
    screenHeight: number;
    windowWidth: number;
    windowHeight: number;
    windowTop: number;
    windowBottom: number;
    statusBarHeight: number;
    safeArea: UniSafeArea;
    safeAreaInsets: UniSafeAreaInsets;
}
export interface UniSafeArea {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
}
export interface UniSafeAreaInsets {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
