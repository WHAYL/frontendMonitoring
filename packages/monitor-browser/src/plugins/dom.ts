import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';

export class DomPlugin implements MonitorPlugin {
  name = 'dom';
  private monitor: FrontendMonitor | null = null;

  init(monitor: FrontendMonitor): void {
    this.monitor = monitor;
    this.setupDomMonitoring();
  }

  destroy(): void {

  }

  private setupDomMonitoring(): void {
    // 监听未捕获的错误
    window.addEventListener('error', (event: ErrorEvent) => {
      this.monitor!.error(
        this.name,
        `JavaScript Error: ${event.message}`,
        event.error
      );
    });

    // 监听未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      this.monitor!.error(
        this.name,
        `Unhandled Promise Rejection: ${event.reason}`,
        typeof event.reason === 'string' ? new Error(event.reason) : event.reason
      );
    });

    // 监听点击事件，记录用户交互
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName;
      const id = target.id;
      const className = target.className;

      this.monitor!.debug(
        this.name,
        `User Click: ${tagName}${id ? '#' + id : ''}${className ? '.' + className : ''}`
      );
    }, true); // 使用捕获阶段
  }
}