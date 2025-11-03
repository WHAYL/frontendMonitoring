
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
type MouseEventNames = 'click' | 'dblclick' | 'mousemove' | 'wheel' | 'mousedown' | 'mouseup' | 'mouseover' | 'mouseout' | 'mouseenter' | 'contextmenu';
export interface DomPluginConfig {
    error?: boolean;
    unhandledrejection?: boolean;
    mouseEvents?: {
        [K in MouseEventNames]?: string[] | boolean;
    }
    resize?: boolean;
    clickPath?: boolean;
}
export interface PerformancePluginConfig {
    longTaskEnabled?: boolean;
    memoryEnabled?: boolean;
    fpsEnabled?: boolean;
    resourceEnabled?: boolean;
    navigationEnabled?: boolean;
    webVitalsEnabled?: boolean;
}

export interface WhiteScreenPluginConfig {
    keySelectors?: string[]; // 关键渲染元素选择器
    checkInterval?: number; // 检测间隔ms
    timeout?: number; // 超时时间ms
}
// 定义浏览器监控插件配置接口
export interface BrowserMonitorConfig {
    monitorConfig: MonitorConfig;
    pluginsUse?: {
        xhrPluginEnabled?: boolean;
        fetchPluginEnabled?: boolean;
        domPluginEnabled?: boolean;
        routePluginEnabled?: boolean;
        performancePluginEnabled?: boolean;
        whiteScreenPluginEnabled?: boolean;
        consolePluginEnabled?: boolean;
        analyticsPluginEnabled?: boolean;
    };
    whiteScreenPluginConfig?: WhiteScreenPluginConfig;
    consolePluginConfig?: ConsolePluginConfig;
    domPluginConfig?: DomPluginConfig;
    performancePluginConfig?: PerformancePluginConfig;
    analyticsPluginConfig?: AnalyticsPluginConfig;
}

// 定义需要的 Navigator 字段子集
export interface PartialNavigator {
    userAgent: string;
    platform: string;
    language: string;
    onLine: boolean;
    cookieEnabled: boolean;
}
export interface BrowserLogData extends SetOptional<LogData, 'deviceInfo'> {
    navigator?: PartialNavigator;
}
export type ReportInfo = (level: ReportingLevel, data: BrowserLogData) => void;
export interface BrowserMonitorPluginInitArg {
    reportInfo: ReportInfo;
    getFingerprint: () => string;
}
// 插件接口
export interface BrowserMonitorPlugin {
    // 插件名称
    name: string;

    // 插件初始化方法
    init: (data: BrowserMonitorPluginInitArg) => void;

    // 插件销毁方法
    destroy?: () => void;
}
export interface BrowserMonitorBase {
    reportInfo: ReportInfo;
    setFingerprint: (value: string) => void;
    getFingerprint: () => string;
    use: (plugin: BrowserMonitorPlugin) => void
    destroy: () => void
}

/**
 * 定义每个插件上报数据中的 ExtraData 字段类型
 */

// XHR 插件的 ExtraData 类型
export interface XhrExtraData {
    type: 'xhr';
    url: string;
    method: string;
    error?: string;
    startTime: number;
    endTime: number;
    duration: number;
}

// Fetch 插件的 ExtraData 类型
export interface FetchExtraData {
    type: 'fetch';
    url: string;
    method: string;
    error: string;
    stack?: string;
    startTime: number;
    endTime: number;
    duration: number;
}

// Route 插件的 ExtraData 类型
export interface RouteExtraData {
    route?: string;
    previousRoute?: string;
    currentRoute?: string;
    changeType?: string;
    enterTime?: number;
    leaveTime?: number;
    duration?: number;
    target?: string;
}

// DOM 插件的 ExtraData 类型
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

export interface DomMouseEventExtraData {
    localName: string;
    classList: string;
    className: string;
    id: string;
    nodeName: string;
    tagName: string;
    dataSet: string;
    x: number;
    y: number;
    scrollX: number;
    scrollY: number;
}

export interface DomClickPathExtraData {
    timestamp: number;
    path: Array<Record<string, any>>;
    x: number;
    y: number;
    scrollX: number;
    scrollY: number;
    innerWidth: number;
    innerHeight: number;
    url: string;
}

export interface DomResizeExtraData {
    innerWidth: number;
    innerHeight: number;
    devicePixelRatio: number;
}

// Performance 插件的 ExtraData 类型
export interface PerformanceLongTaskExtraData {
    type: 'longtask';
    name: string;
    startTime: number;
    duration: number;
    attribution: any[];
}

export interface PerformanceMemoryExtraData {
    type: 'memory';
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
    trend: string;
}

export interface PerformanceFrameDropExtraData {
    type: 'frame_drop';
    frameTime: number;
    expectedFrameTime: number;
    timestamp: number;
    isDuringInteraction: boolean;
    timeSinceLastInteraction: number;
}

export interface PerformanceFPSExtraData {
    type: 'fps';
    fps: number;
    minFps: number;
    maxFps: number;
    avgFps: number;
    frameCount: number;
    timestamp: number;
    duration: number;
}

export interface PerformanceResourceExtraData {
    type: 'resource';
    name: string;
    cached: boolean;
    entryType: string;
    startTime: number;
    duration: number;
    initiatorType: string;
    nextHopProtocol: string;
    workerStart: number;
    redirectStart: number;
    redirectEnd: number;
    fetchStart: number;
    domainLookupStart: number;
    domainLookupEnd: number;
    connectStart: number;
    connectEnd: number;
    secureConnectionStart: number;
    requestStart: number;
    responseStart: number;
    responseEnd: number;
    transferSize: number;
    encodedBodySize: number;
    decodedBodySize: number;
    serverTiming: any[];
}

export interface PerformanceNavigationExtraData {
    name: string;
    entryType: string;
    startTime: number;
    duration: number;
    activationStart?: number;
    unloadEventStart: number;
    unloadEventEnd: number;
    redirectStart: number;
    redirectEnd: number;
    fetchStart: number;
    domainLookupStart: number;
    domainLookupEnd: number;
    connectStart: number;
    connectEnd: number;
    secureConnectionStart: number;
    requestStart: number;
    responseStart: number;
    responseEnd: number;
    domInteractive: number;
    domContentLoadedEventStart: number;
    domContentLoadedEventEnd: number;
    domComplete: number;
    loadEventStart: number;
    loadEventEnd: number;
    type: string;
    redirectCount: number;
}

export interface PerformanceWebVitalsExtraData {
    type: 'web_vitals';
    metric: string;
    value: number;
    attribution?: any;
    navigationType: string;
    rating: string;
}

// Console 插件的 ExtraData 类型
export interface ConsoleExtraData {
    args: any[];
    stack: string | undefined;
}

// WhiteScreen 插件的 ExtraData 类型
export interface WhiteScreenExtraData {
    status: 'success' | 'timeout';
    page: string;
    startTime: number;
    endTime: number;
    duration: number;
    selectors: string[] | undefined;
}

// Analytics 插件的 ExtraData 类型
export interface AnalyticsExtraData {
    pv: Record<string, number>;
    uv: Record<string, number>;
    vv: number;
    ip: string | null;
    timestamp: number;
}

export interface AnalyticsHistoryExtraData {
    timestamp: number;
    items: Record<string, any>;
}