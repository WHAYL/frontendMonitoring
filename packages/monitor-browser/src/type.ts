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
    pv: number;
    uv: number;
    vv: number;
    ip: string | null;
    timestamp: number;
}

export interface AnalyticsHistoryExtraData {
    timestamp: number;
    items: Record<string, any>;
}