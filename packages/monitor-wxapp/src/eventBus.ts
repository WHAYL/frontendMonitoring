import { EventEmitter } from "aiy-utils";
// 定义事件类型映射
type WxAppEventMap = {
    "onLaunch": (data: any) => void;
    "onHide": (data: any) => void;
    "onShow": (data: any) => void;
    "onError": (data: any) => void;
    "onUnhandledRejection": (data: any) => void;
    "onPageNotFound": (data: any) => void;
    // 可以添加更多的事件类型
};
const wxAppMethods = ['onLaunch', 'onHide', 'onShow', 'onError', 'onUnhandledRejection', 'onPageNotFound'] as const;
const WxAppEventBus = EventEmitter<WxAppEventMap>(wxAppMethods);

// 定义事件类型映射
type WxPageEventMap = {
    "onLoad": (data: any) => void;
    "onHide": (data: any) => void;
    "onShow": (data: any) => void;
    "onReady": (data: any) => void;
    "onUnload": (data: any) => void;
    // 可以添加更多的事件类型
};
const wxPageMethods = ['onLoad', 'onShow', 'onReady', 'onHide', 'onUnload'] as const;
const WxPageEventBus = EventEmitter<WxPageEventMap>(wxPageMethods);

// 定义事件类型映射
type UniCreatePageEventMap = {
    "onLoad": (data: any) => void;
    "onHide": (data: any) => void;
    "onShow": (data: any) => void;
    "onReady": (data: any) => void;
    "onUnload": (data: any) => void;
    // 可以添加更多的事件类型
};
const UniCreatePageMethods = ['onLoad', 'onShow', 'onReady', 'onHide', 'onUnload'] as const;
const UniCreatePageEventBus = EventEmitter<UniCreatePageEventMap>(UniCreatePageMethods);
export { WxAppEventBus, WxPageEventBus, UniCreatePageEventBus, UniCreatePageMethods, wxPageMethods, wxAppMethods };
