type WxAppEventMap = {
    "onLaunch": (data: any) => void;
    "onHide": (data: any) => void;
    "onShow": (data: any) => void;
    "onError": (data: any) => void;
    "onUnhandledRejection": (data: any) => void;
    "onPageNotFound": (data: any) => void;
};
declare const wxAppMethods: readonly ["onLaunch", "onHide", "onShow", "onError", "onUnhandledRejection", "onPageNotFound"];
declare const WxAppEventBus: {
    getNames: () => any[];
    clearAll: () => void;
    on: <K extends keyof WxAppEventMap>(eventName: K, listener: WxAppEventMap[K]) => void;
    off: <K_1 extends keyof WxAppEventMap>(eventName: K_1, listener: WxAppEventMap[K_1]) => void;
    emit: <K_2 extends keyof WxAppEventMap>(eventName: K_2, ...args: Parameters<WxAppEventMap[K_2]>) => void;
};
type WxPageEventMap = {
    "onLoad": (data: any) => void;
    "onHide": (data: any) => void;
    "onShow": (data: any) => void;
    "onReady": (data: any) => void;
    "onUnload": (data: any) => void;
};
declare const wxPageMethods: readonly ["onLoad", "onShow", "onReady", "onHide", "onUnload"];
declare const WxPageEventBus: {
    getNames: () => any[];
    clearAll: () => void;
    on: <K extends keyof WxPageEventMap>(eventName: K, listener: WxPageEventMap[K]) => void;
    off: <K_1 extends keyof WxPageEventMap>(eventName: K_1, listener: WxPageEventMap[K_1]) => void;
    emit: <K_2 extends keyof WxPageEventMap>(eventName: K_2, ...args: Parameters<WxPageEventMap[K_2]>) => void;
};
type UniCreatePageEventMap = {
    "onLoad": (data: any) => void;
    "onHide": (data: any) => void;
    "onShow": (data: any) => void;
    "onReady": (data: any) => void;
    "onUnload": (data: any) => void;
};
declare const UniCreatePageMethods: readonly ["onLoad", "onShow", "onReady", "onHide", "onUnload"];
declare const UniCreatePageEventBus: {
    getNames: () => any[];
    clearAll: () => void;
    on: <K extends keyof UniCreatePageEventMap>(eventName: K, listener: UniCreatePageEventMap[K]) => void;
    off: <K_1 extends keyof UniCreatePageEventMap>(eventName: K_1, listener: UniCreatePageEventMap[K_1]) => void;
    emit: <K_2 extends keyof UniCreatePageEventMap>(eventName: K_2, ...args: Parameters<UniCreatePageEventMap[K_2]>) => void;
};
export { WxAppEventBus, WxPageEventBus, UniCreatePageEventBus, UniCreatePageMethods, wxPageMethods, wxAppMethods };
