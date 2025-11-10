import { ReportingLevel, type LogData, MonitorConfig } from '@whayl/monitor-core';
import { type SetOptional } from 'aiy-utils';
export interface AnalyticsPluginConfig {
    ipProvider?: () => Promise<string | null>;
}
export interface ConsolePluginConfig {
    error?: boolean;
    warn?: boolean;
}
export interface WxAppMonitorConfig {
    monitorConfig: MonitorConfig;
    pluginsUse?: {
        consolePluginEnabled?: boolean;
        errorPluginEnabled?: boolean;
        routerPluginEnabled?: boolean;
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
export interface WxAppLogData extends SetOptional<LogData, 'deviceInfo'> {
    navigator?: PartialNavigator;
}
export type ReportInfo = (level: ReportingLevel, data: WxAppLogData) => void;
export interface WxAppMonitorPluginInitArg {
    reportInfo: ReportInfo;
    getFingerprint: () => string;
}
export interface WxAppMonitorPlugin {
    name: string;
    init: (data: WxAppMonitorPluginInitArg) => void;
    destroy?: () => void;
}
export interface WxAppMonitorBase {
    reportInfo: ReportInfo;
    setFingerprint: (value: string) => void;
    getFingerprint: () => string;
    use: (plugin: WxAppMonitorPlugin) => void;
    destroy: () => void;
}
export interface ConsoleExtraData {
    args: any[];
    stack: string | undefined;
}
export interface WxSystemInfo {
    brand: string;
    model: string;
    pixelRatio: number;
    screenWidth: number;
    screenHeight: number;
    windowWidth: number;
    windowHeight: number;
    statusBarHeight?: number;
    language: string;
    version: string;
    system: string;
    platform: string;
    fontSizeSetting: number;
    SDKVersion: string;
    benchmarkLevel?: number;
    albumAuthorized?: boolean;
    cameraAuthorized?: boolean;
    locationAuthorized?: boolean;
    microphoneAuthorized?: boolean;
    notificationAuthorized?: boolean;
    notificationAlertAuthorized?: boolean;
    notificationBadgeAuthorized?: boolean;
    notificationSoundAuthorized?: boolean;
    phoneCalendarAuthorized?: boolean;
    bluetoothEnabled?: boolean;
    locationEnabled?: boolean;
    wifiEnabled?: boolean;
    safeArea?: {
        left: number;
        right: number;
        top: number;
        bottom: number;
        width: number;
        height: number;
    };
    locationReducedAccuracy?: boolean;
    theme?: 'light' | 'dark';
    host?: {
        appId: string;
        enableDebug?: boolean;
    };
    deviceOrientation: 'portrait' | 'landscape';
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
