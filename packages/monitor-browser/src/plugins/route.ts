import { MonitorPlugin } from '@whayl/monitor-core';
import type { MonitorPluginInitArg } from '@whayl/monitor-core';
import { monitorRouteChange } from '../eventBus';
import { getTimestamp, formatTimestamp } from '../utils';
import type { RouteExtraData } from '../type';

export class RoutePlugin implements MonitorPlugin {
  name = 'route';
  private monitor: MonitorPluginInitArg;
  private lastRoute: string;
  private routeEnterTime: number = 0;
  private originalPushState: typeof history.pushState;
  private originalReplaceState: typeof history.replaceState;
  private originalWindowOpen: typeof window.open;
  private abortController: AbortController | null = null;

  init(monitor: MonitorPluginInitArg): void {
    this.monitor = monitor;
    // 创建AbortController来管理所有事件监听器
    this.abortController = new AbortController();
    this.setupRouteMonitoring();
  }

  destroy(): void {
    // 记录最后路由的离开时间
    this.recordRouteLeave();

    // 使用abort controller一次性取消所有事件监听器
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    // 恢复覆盖的方法
    if (this.originalWindowOpen) {
      try { window.open = this.originalWindowOpen; } catch (e) { /* ignore */ }
    }
    if (this.originalPushState) {
      try { history.pushState = this.originalPushState; } catch (e) { /* ignore */ }
    }
    if (this.originalReplaceState) {
      try { history.replaceState = this.originalReplaceState; } catch (e) { /* ignore */ }
    }
  }

  private setupRouteMonitoring(): void {
    // 记录初始路由
    this.lastRoute = this.getCurrentRoute();

    // 监听 hash 路由变化
    window.addEventListener('hashchange', () => {
      this.handleRouteChange('hash');
    }, { signal: this.abortController?.signal });

    // 监听 history 路由变化
    window.addEventListener('popstate', () => {
      this.handleRouteChange('history');
    }, { signal: this.abortController?.signal });

    // 监听 history.pushState 和 history.replaceState
    this.wrapHistoryMethods();

    // 监听 document 的 a 标签点击（用于捕获普通链接或新标签打开）
    document.addEventListener('click', this.handleDocumentClick, { capture: true, signal: this.abortController?.signal });

    // 包装 window.open
    this.wrapWindowOpen();

    // 页面卸载时记录离开（普通导航/刷新）
    window.addEventListener('beforeunload', this.handleBeforeUnload, { signal: this.abortController?.signal });

    // 记录初始路由进入时间
    this.recordRouteEnter();

    const extraData: RouteExtraData = {
      route: this.lastRoute,
      enterTime: this.routeEnterTime
    };

    // 记录初始路由
    this.monitor!.reportInfo('INFO', {
      pluginName: this.name,
      message: `Initial Route: ${this.lastRoute}`,
      extraData,
      url: window.location.href,
      timestamp: getTimestamp(),
      date: formatTimestamp()
    });
  }

  private handleRouteChange(changeType: string): void {
    const currentRoute = this.getCurrentRoute();

    // 避免重复记录相同的路由
    if (this.lastRoute !== currentRoute) {
      // 保存旧路由
      const previous = this.lastRoute;

      // 记录上一个路由的离开时间
      this.recordRouteLeave();

      // 更新路由
      this.lastRoute = currentRoute;

      // 记录新路由的进入时间
      this.recordRouteEnter();

      const extraData: RouteExtraData = {
        previousRoute: previous,
        currentRoute: currentRoute,
        changeType: changeType,
        enterTime: this.routeEnterTime
      };

      // 记录路由变更
      this.monitor!.reportInfo('INFO', {
        pluginName: this.name,
        message: `Route Changed (${changeType}): ${currentRoute}`,
        extraData,
        url: window.location.href,
        timestamp: getTimestamp(),
        date: formatTimestamp()
      });
      monitorRouteChange.emit("monitorRouteChange", extraData);
    }
  }

  private getCurrentRoute(): string {
    return window.location.href;
  }

  private wrapHistoryMethods(): void {
    const self = this;

    // 保存原始方法，便于恢复
    this.originalPushState = history.pushState;
    this.originalReplaceState = history.replaceState;

    // 重写 pushState 方法
    history.pushState = function (...args) {
      const result = self.originalPushState!.apply(this, args as any);
      self.handleRouteChange('pushState');
      return result;
    } as any;

    // 重写 replaceState 方法
    history.replaceState = function (...args) {
      const result = self.originalReplaceState!.apply(this, args as any);
      self.handleRouteChange('replaceState');
      return result;
    } as any;
  }

  /**
   * 包装 window.open，捕获打开新窗口/标签的行为（作为外链/出站事件上报）
   */
  private wrapWindowOpen(): void {
    const self = this;
    try {
      this.originalWindowOpen = window.open;
      window.open = function (...args) {
        try {
          const url = args[0];
          const extraData: RouteExtraData = {
            previousRoute: self.lastRoute,
            currentRoute: url,
            changeType: 'window.open',
            enterTime: getTimestamp()
          };
          self.monitor!.reportInfo('INFO', {
            pluginName: self.name,
            message: `window.open -> ${url}`,
            url: window.location.href,
            extraData,
            timestamp: getTimestamp(),
            date: formatTimestamp()
          });
          monitorRouteChange.emit('monitorRouteChange', extraData);
        } catch (e) {
          // ignore
        }
        return self.originalWindowOpen!.apply(this, args as any);
      } as any;
    } catch (e) {
      // 某些环境可能不能覆盖 window.open，忽略错误
    }
  }

  /**
   * 捕获 document 上的 a 标签点击，用于在导航前主动上报（包括 target=_blank）
   */
  private handleDocumentClick = (ev: MouseEvent) => {
    try {
      const target = ev.target as Element | null;
      if (!target || !(target instanceof Element)) { return; }
      const a = target.closest('a') as HTMLAnchorElement | null;
      if (!a) { return; }
      const href = a.href;
      if (!href) { return; }

      const extraData: RouteExtraData = {
        previousRoute: this.lastRoute,
        currentRoute: href,
        changeType: 'a.click',
        enterTime: getTimestamp(),
        target: a.target
      };

      this.monitor!.reportInfo('INFO', {
        pluginName: this.name,
        message: `A tag clicked -> ${href}`,
        url: window.location.href,
        extraData,
        timestamp: getTimestamp(),
        date: formatTimestamp()
      });
      monitorRouteChange.emit('monitorRouteChange', extraData);
    } catch (e) {
      // ignore
    }
  };

  private handleBeforeUnload = () => {
    try {
      this.recordRouteLeave();
    } catch (e) {
      // ignore
    }
  };

  /**
   * 记录路由进入时间
   */
  private recordRouteEnter(): void {
    this.routeEnterTime = getTimestamp();
  }

  /**
   * 记录路由离开时间
   */
  private recordRouteLeave(): void {
    if (this.lastRoute && this.routeEnterTime) {
      const leaveTime = getTimestamp();
      const duration = leaveTime - this.routeEnterTime;

      const extraData: RouteExtraData = {
        route: this.lastRoute,
        enterTime: this.routeEnterTime,
        leaveTime: leaveTime,
        duration: duration
      };

      this.monitor!.reportInfo('INFO', {
        pluginName: this.name,
        message: `Route Left: ${this.lastRoute}`,
        extraData,
        url: window.location.href,
        timestamp: getTimestamp(),
        date: formatTimestamp()
      });
    }
  }
}