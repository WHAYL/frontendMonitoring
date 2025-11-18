
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
export interface WxAppMonitorConfig {
    monitorConfig: MonitorConfig;
    pluginsUse?: {
        consolePluginEnabled?: boolean;
        errorPluginEnabled?: boolean;
        routerPluginEnabled?: boolean;
        requestPluginEnabled?: boolean;
        behaviorPluginEnabled?: boolean
    };
    consolePluginConfig?: ConsolePluginConfig;

}
export interface PageRouterData {
    page: string;
    timestamp: string;
    routeEventId: string;
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
export interface WxAppLogData extends SetOptional<LogData, 'deviceInfo'> {
    navigator?: PartialNavigator;
}
export type ReportInfo = (level: ReportingLevel, data: WxAppLogData) => void;
export interface WxAppMonitorPluginInitArg {
    reportInfo: ReportInfo;
    getFingerprint: () => string;
}
// 插件接口
export interface WxAppMonitorPlugin {
    // 插件名称
    name: string;

    // 插件初始化方法
    init: (data: WxAppMonitorPluginInitArg) => void;

    // 插件销毁方法
    destroy?: () => void;
}
export interface WxAppMonitorBase {
    reportInfo: ReportInfo;
    setFingerprint: (value: string) => void;
    getFingerprint: () => string;
    use: (plugin: WxAppMonitorPlugin) => void
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
// Router 插件的 ExtraData 类型
export interface RouterExtraData {
    pages: PageRouterData[];
}

export interface WxSystemInfo {
    /**
     * 设备品牌
     */
    brand: string;

    /**
     * 设备型号。新机型刚推出一段时间会显示unknown，微信会尽快进行适配。
     */
    model: string;

    /**
     * 设备像素比
     */
    pixelRatio: number;

    /**
     * 屏幕宽度，单位px
     */
    screenWidth: number;

    /**
     * 屏幕高度，单位px
     */
    screenHeight: number;

    /**
     * 可使用窗口宽度，单位px
     */
    windowWidth: number;

    /**
     * 可使用窗口高度，单位px
     */
    windowHeight: number;

    /**
     * 状态栏的高度，单位px
     */
    statusBarHeight?: number;

    /**
     * 微信设置的语言
     */
    language: string;

    /**
     * 微信版本号
     */
    version: string;

    /**
     * 操作系统及版本
     */
    system: string;

    /**
     * 客户端平台
     * 可能值: 'ios' | 'android' | 'ohos' | 'windows' | 'mac' | 'devtools'
     */
    platform: string;

    /**
     * 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准
     */
    fontSizeSetting: number;

    /**
     * 客户端基础库版本
     */
    SDKVersion: string;

    /**
     * 设备性能等级（仅 Android）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好）
     * 注意：性能等级当前仅反馈真机机型，暂不支持 IDE 模拟器机型
     */
    benchmarkLevel?: number;

    /**
     * 允许微信使用相册的开关（仅 iOS 有效）
     */
    albumAuthorized?: boolean;

    /**
     * 允许微信使用摄像头的开关
     */
    cameraAuthorized?: boolean;

    /**
     * 允许微信使用定位的开关
     */
    locationAuthorized?: boolean;

    /**
     * 允许微信使用麦克风的开关
     */
    microphoneAuthorized?: boolean;

    /**
     * 允许微信通知的开关
     */
    notificationAuthorized?: boolean;

    /**
     * 允许微信通知带有提醒的开关（仅 iOS 有效）
     */
    notificationAlertAuthorized?: boolean;

    /**
     * 允许微信通知带有标记的开关（仅 iOS 有效）
     */
    notificationBadgeAuthorized?: boolean;

    /**
     * 允许微信通知带有声音的开关（仅 iOS 有效）
     */
    notificationSoundAuthorized?: boolean;

    /**
     * 允许微信使用日历的开关
     */
    phoneCalendarAuthorized?: boolean;

    /**
     * 蓝牙的系统开关
     */
    bluetoothEnabled?: boolean;

    /**
     * 地理位置的系统开关
     */
    locationEnabled?: boolean;

    /**
     * Wi-Fi 的系统开关
     */
    wifiEnabled?: boolean;

    /**
     * 在竖屏正方向下的安全区域。部分机型没有安全区域概念，也不会返回 safeArea 字段，开发者需自行兼容。
     */
    safeArea?: {
        /**
         * 安全区域左上角横坐标
         */
        left: number;

        /**
         * 安全区域右下角横坐标
         */
        right: number;

        /**
         * 安全区域左上角纵坐标
         */
        top: number;

        /**
         * 安全区域右下角纵坐标
         */
        bottom: number;

        /**
         * 安全区域的宽度，单位逻辑像素
         */
        width: number;

        /**
         * 安全区域的高度，单位逻辑像素
         */
        height: number;
    };

    /**
     * true 表示模糊定位，false 表示精确定位，仅 iOS 支持
     */
    locationReducedAccuracy?: boolean;

    /**
     * 系统当前主题，取值为'light'或'dark'，全局配置"darkmode":true时才能获取，否则为 undefined （不支持小游戏）
     */
    theme?: 'light' | 'dark';

    /**
     * 当前小程序运行的宿主环境
     */
    host?: {
        /**
         * 宿主 app 对应的 appId
         */
        appId: string;

        /**
         * 是否已打开调试。可通过右上角菜单或 wx.setEnableDebug 打开调试。
         */
        enableDebug?: boolean;
    };

    /**
     * 设备方向（注意：IOS客户端横屏游戏获取deviceOrientation可能不准，建议以屏幕宽高为准）
     * 可能值: 'portrait' | 'landscape'
     */
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