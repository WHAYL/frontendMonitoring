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

export { UniNavEventBus, UniNavMethods, UniAppMethods, UniAppEventBus };

