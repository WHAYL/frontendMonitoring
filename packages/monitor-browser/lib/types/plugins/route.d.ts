import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
export declare class RoutePlugin implements MonitorPlugin {
    name: string;
    private monitor;
    private lastRoute;
    private routeEnterTime;
    init(monitor: FrontendMonitor): void;
    destroy(): void;
    private setupRouteMonitoring;
    private handleHashChange;
    private handleHistoryChange;
    private handleRouteChange;
    private getCurrentRoute;
    private wrapHistoryMethods;
    private recordRouteEnter;
    private recordRouteLeave;
}
