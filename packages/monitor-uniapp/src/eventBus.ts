import { EventEmitter } from "aiy-utils";
// 定义事件类型映射
type UniNavEventMap = {
    "switchTab": (data: any) => void;
    "navigateTo": (data: any) => void;
    "redirectTo": (data: any) => void;
    "reLaunch": (data: any) => void;
    "navigateBack": (data: any) => void;
    // 可以添加更多的事件类型
};
const UniNavMethods = ["switchTab", "navigateTo", "redirectTo", "reLaunch", "navigateBack"] as const;
const UniNavEventBus = EventEmitter<UniNavEventMap>(UniNavMethods);

type UniAppEventMap = {
    "onAppHide": (data: any) => void;
    // 可以添加更多的事件类型
};
const UniAppMethods = ['onAppHide'] as const;
const UniAppEventBus = EventEmitter<UniAppEventMap>(UniAppMethods);

// 定义事件类型映射
type UniPageBindEventMap = {
    "tap": (data: any) => void;
    "touchend": (data: any) => void;
    "longtap": (data: any) => void;
    "click": (data: any) => void;
    "dbclick": (data: any) => void;
    "longclick": (data: any) => void;
    "onClick": (data: any) => void;
    "onTap": (data: any) => void;
    "onDbclick": (data: any) => void;
    "onLongclick": (data: any) => void;
    "onLongtap": (data: any) => void;
    "onTouchend": (data: any) => void;

    // 可以添加更多的事件类型
};

const uniPageBindMethods = ['tap', 'touchend', 'longtap', 'click', 'dbclick', 'longclick', 'onClick', 'onTap', 'onDbclick', 'onLongclick', 'onLongtap', 'onTouchend'] as const;
const UniPageBindEventBus = EventEmitter<UniPageBindEventMap>(uniPageBindMethods);

export { UniNavEventBus, UniNavMethods, UniAppMethods, UniAppEventBus, UniPageBindEventBus, uniPageBindMethods };

