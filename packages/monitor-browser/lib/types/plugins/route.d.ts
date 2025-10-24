import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
export declare class RoutePlugin implements MonitorPlugin {
    name: string;
    private monitor;
    private lastRoute;
    private routeEnterTime;
    private originalPushState;
    private originalReplaceState;
    private originalWindowOpen;
    private abortController;
    init(monitor: FrontendMonitor): void;
    destroy(): void;
    private setupRouteMonitoring;
    private handleRouteChange;
    private getCurrentRoute;
    private wrapHistoryMethods;
    private wrapWindowOpen;
    private handleDocumentClick;
    private handleBeforeUnload;
    private recordRouteEnter;
    private recordRouteLeave;
}
