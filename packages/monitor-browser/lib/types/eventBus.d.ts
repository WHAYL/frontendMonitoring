type EventMap = {
    "monitorRouteChange": (data: any) => void;
};
declare const monitorRouteChange: {
    getNames: () => any[];
    clearAll: () => void;
    on: <K extends "monitorRouteChange">(eventName: K, listener: EventMap[K]) => void;
    off: <K_1 extends "monitorRouteChange">(eventName: K_1, listener: EventMap[K_1]) => void;
    emit: <K_2 extends "monitorRouteChange">(eventName: K_2, ...args: Parameters<EventMap[K_2]>) => void;
};
export { monitorRouteChange };
