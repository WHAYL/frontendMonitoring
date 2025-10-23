import { EventEmitter } from "aiy-utils";
// 定义事件类型映射
type EventMap = {
    "monitorRouteChange": (data: any) => void;
    // 可以添加更多的事件类型
};
const arr = ['monitorRouteChange'] as const;
const monitorRouteChange = EventEmitter<EventMap>(arr);
export { monitorRouteChange };
