type UniNavEventMap = {
    "switchTab": (data: any) => void;
    "navigateTo": (data: any) => void;
    "redirectTo": (data: any) => void;
    "reLaunch": (data: any) => void;
    "navigateBack": (data: any) => void;
};
declare const UniNavMethods: readonly ["switchTab", "navigateTo", "redirectTo", "reLaunch", "navigateBack"];
declare const UniNavEventBus: {
    getNames: () => any[];
    clearAll: () => void;
    on: <K extends keyof UniNavEventMap>(eventName: K, listener: UniNavEventMap[K]) => void;
    off: <K_1 extends keyof UniNavEventMap>(eventName: K_1, listener: UniNavEventMap[K_1]) => void;
    emit: <K_2 extends keyof UniNavEventMap>(eventName: K_2, ...args: Parameters<UniNavEventMap[K_2]>) => void;
};
type UniAppEventMap = {
    "onAppHide": (data: any) => void;
};
declare const UniAppMethods: readonly ["onAppHide"];
declare const UniAppEventBus: {
    getNames: () => any[];
    clearAll: () => void;
    on: <K extends "onAppHide">(eventName: K, listener: UniAppEventMap[K]) => void;
    off: <K_1 extends "onAppHide">(eventName: K_1, listener: UniAppEventMap[K_1]) => void;
    emit: <K_2 extends "onAppHide">(eventName: K_2, ...args: Parameters<UniAppEventMap[K_2]>) => void;
};
export { UniNavEventBus, UniNavMethods, UniAppMethods, UniAppEventBus };
