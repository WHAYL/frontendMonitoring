import type { BrowserMonitorPlugin, BrowserMonitorPluginInitArg } from '../type';
export declare class RoutePlugin implements BrowserMonitorPlugin {
    name: string;
    private monitor;
    private lastRoute;
    private routeEnterTime;
    private originalPushState;
    private originalReplaceState;
    private originalWindowOpen;
    private abortController;
    init(monitor: BrowserMonitorPluginInitArg): void;
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
