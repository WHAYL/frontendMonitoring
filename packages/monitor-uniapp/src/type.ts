
import { type DeviceInfo, ReportingLevel, type LogData, MonitorConfig } from '@whayl/monitor-core';
import { type SetOptional } from 'aiy-utils';

export interface AnalyticsPluginConfig {
    // 可选获取公网 IP 的异步函数（例如调用第三方服务），返回 IP 字符串
    ipProvider?: () => Promise<string | null>;
}
export interface ConsolePluginConfig {
    error?: boolean;
    warn?: boolean;
}
// 定义浏览器监控插件配置接口
export interface UniAppMonitorConfig {
    monitorConfig: MonitorConfig;
    pluginsUse?: {
        consolePluginEnabled?: boolean;
        errorPluginEnabled?: boolean;
        routerPluginEnabled?: boolean;
    };
    consolePluginConfig?: ConsolePluginConfig;

}

// 定义需要的 Navigator 字段子集
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
// 插件接口
export interface UniAppMonitorPlugin {
    // 插件名称
    name: string;

    // 插件初始化方法
    init: (data: UniAppMonitorPluginInitArg) => void;

    // 插件销毁方法
    destroy?: () => void;
}
export interface UniAppMonitorBase {
    reportInfo: ReportInfo;
    setFingerprint: (value: string) => void;
    getFingerprint: () => string;
    use: (plugin: UniAppMonitorPlugin) => void
    destroy: () => void
}

/**
 * 定义每个插件上报数据中的 ExtraData 字段类型
 */

// Console 插件的 ExtraData 类型
export interface ConsoleExtraData {
    args: any[];
    stack: string | undefined;
}

export interface UniSystemInfo {
    // device 设备信息
    /** 设备 id */
    deviceId: string;
    /** 设备类型 */
    deviceType: 'phone' | 'pad' | 'pc' | 'unknow';
    /** 设备品牌 */
    deviceBrand: string;
    /** 设备型号 */
    deviceModel: string;
    /** 设备方向 */
    deviceOrientation: 'portrait' | 'landscape';
    /** 设备像素比 */
    devicePixelRatio: number;

    // os 操作系统信息
    /** 系统名称 */
    osName: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'harmonyos';
    /** 操作系统版本 */
    osVersion: string;
    /** 操作系统语言 */
    osLanguage: string;
    /** 操作系统主题 */
    osTheme: 'light' | 'dark';
    /** Android 系统API库的版本 */
    osAndroidAPILevel: string;

    // rom 信息
    /** rom 名称 */
    romName: string;
    /** rom 版本 */
    romVersion: string;

    // browser 浏览器信息
    /** 浏览器名称或App的webview名称 */
    browserName: string;
    /** 浏览器版本、webview 版本 */
    browserVersion: string;

    // host 宿主信息
    /** 小程序宿主或uniMPSDK的集成宿主名称 */
    hostName: string;
    /** 宿主版本 */
    hostVersion: string;
    /** 宿主语言 */
    hostLanguage: string;
    /** 宿主主题 */
    hostTheme: 'light' | 'dark';
    /** 用户字体大小设置 */
    hostFontSizeSetting: number;
    /** 小程序宿主包名 */
    hostPackageName: string;
    /** uni小程序SDK版本、小程序客户端基础库版本 */
    hostSDKVersion: string;

    // uni-app框架信息
    /** uni-app 运行平台 */
    uniPlatform: string;
    /** uni 编译器版本号 */
    uniCompileVersion: string;
    /** uni 编译器版本号 */
    uniCompilerVersion: string;
    /** uni 运行时版本 */
    uniRuntimeVersion: string;

    // app 应用信息
    /** manifest 中应用appid */
    appId: string;
    /** manifest 中应用名称 */
    appName: string;
    /** manifest 中应用版本名称 */
    appVersion: string;
    /** manifest 中应用版本号 */
    appVersionCode: string;
    /** 应用资源（wgt）的版本名称 */
    appWgtVersion: string;
    /** 应用设置的语言 */
    appLanguage: string;

    // 其他信息
    /** userAgent标识 */
    ua: string;
    /** 屏幕宽度 */
    screenWidth: number;
    /** 屏幕高度 */
    screenHeight: number;
    /** 可使用窗口宽度 */
    windowWidth: number;
    /** 可使用窗口高度 */
    windowHeight: number;
    /** 可使用窗口的顶部位置 */
    windowTop: number;
    /** 可使用窗口的底部位置 */
    windowBottom: number;
    /** 手机状态栏的高度 */
    statusBarHeight: number;
    /** 在竖屏正方向下的安全区域 */
    safeArea: UniSafeArea;
    /** 在竖屏正方向下的安全区域插入位置 */
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