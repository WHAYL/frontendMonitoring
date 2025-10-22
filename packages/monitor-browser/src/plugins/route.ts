import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
import { monitorRouteChange } from '../eventBus';

export class RoutePlugin implements MonitorPlugin {
  name = 'route';
  private monitor: FrontendMonitor | null = null;
  private lastRoute: string | null = null;
  private routeEnterTime: number = 0;

  init(monitor: FrontendMonitor): void {
    this.monitor = monitor;
    this.setupRouteMonitoring();
  }

  destroy(): void {
    // 记录最后路由的离开时间
    this.recordRouteLeave();

    // 移除事件监听器
    window.removeEventListener('hashchange', this.handleHashChange);
    window.removeEventListener('popstate', this.handleHistoryChange);
  }

  private setupRouteMonitoring(): void {
    // 记录初始路由
    this.lastRoute = this.getCurrentRoute();

    // 监听 hash 路由变化
    window.addEventListener('hashchange', this.handleHashChange.bind(this));

    // 监听 history 路由变化
    window.addEventListener('popstate', this.handleHistoryChange.bind(this));

    // 监听 history.pushState 和 history.replaceState
    this.wrapHistoryMethods();

    // 记录初始路由进入时间
    this.recordRouteEnter();

    // 记录初始路由
    this.monitor!.info(
      this.name,
      `Initial Route: ${this.lastRoute}`,
      {
        route: this.lastRoute,
        enterTime: this.routeEnterTime
      }
    );
  }

  private handleHashChange(): void {
    this.handleRouteChange('hash');
  }

  private handleHistoryChange(): void {
    this.handleRouteChange('history');
  }

  private handleRouteChange(changeType: string): void {
    const currentRoute = this.getCurrentRoute();

    // 避免重复记录相同的路由
    if (this.lastRoute !== currentRoute) {
      // 记录上一个路由的离开时间
      this.recordRouteLeave();

      // 更新路由
      this.lastRoute = currentRoute;

      // 记录新路由的进入时间
      this.recordRouteEnter();
      const data = {
        previousRoute: this.lastRoute,
        currentRoute: currentRoute,
        changeType: changeType,
        enterTime: this.routeEnterTime
      }
      // 记录路由变更
      this.monitor!.info(
        this.name,
        `Route Changed (${changeType}): ${this.lastRoute}`,
        data
      );
      monitorRouteChange.emit("monitorRouteChange", data)
    }
  }

  private getCurrentRoute(): string {
    return window.location.href;
  }

  private wrapHistoryMethods(): void {
    const self = this;

    // 保存原始方法
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    // 重写 pushState 方法
    history.pushState = function (...args) {
      const result = originalPushState.apply(this, args);
      self.handleRouteChange('pushState');
      return result;
    };

    // 重写 replaceState 方法
    history.replaceState = function (...args) {
      const result = originalReplaceState.apply(this, args);
      self.handleRouteChange('replaceState');
      return result;
    };
  }

  /**
   * 记录路由进入时间
   */
  private recordRouteEnter(): void {
    this.routeEnterTime = Date.now();
  }

  /**
   * 记录路由离开时间
   */
  private recordRouteLeave(): void {
    if (this.lastRoute && this.routeEnterTime) {
      const leaveTime = Date.now();
      const duration = leaveTime - this.routeEnterTime;

      this.monitor!.info(
        this.name,
        `Route Left: ${this.lastRoute}`,
        {
          route: this.lastRoute,
          enterTime: this.routeEnterTime,
          leaveTime: leaveTime,
          duration: duration
        }
      );
    }
  }
}