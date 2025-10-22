import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
import { debounce } from 'aiy-utils';
export class DomPlugin implements MonitorPlugin {
  name = 'dom';
  private monitor: FrontendMonitor | null = null;
  private abortController: AbortController | null = null;

  init(monitor: FrontendMonitor): void {
    this.monitor = monitor;
    this.setupDomMonitoring();
  }

  destroy(): void {
    // 使用abort controller一次性取消所有事件监听器
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }


    // 清空引用
    this.monitor = null;
  }

  private setupDomMonitoring(): void {
    // 创建AbortController来管理所有事件监听器
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    // 监听未捕获的错误
    window.addEventListener('error', (event: ErrorEvent) => {
      this.monitor!.error(
        this.name,
        `JavaScript Error: ${event.message}`,
        event.error
      );
    }, { signal });

    // 监听未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      this.monitor!.error(
        this.name,
        `Unhandled Promise Rejection: ${event.reason}`,
        typeof event.reason === 'string' ? new Error(event.reason) : event.reason
      );
    }, { signal });

    // 监听点击事件，记录用户交互
    const mouseEventHandler = (eventType: string) => (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName;
      const id = target.id;
      const className = target.className;

      this.monitor!.debug(
        this.name,
        `User Mouse Event (${eventType}): ${tagName}${id ? '#' + id : ''}${className ? '.' + className : ''}`,
        {

          // target: target,
          localName: target.localName,
          textContent: target.textContent,
          // outerHTML: target.outerHTML,
          classList: Array.from(target.classList).join(','),
          className: target.className,
          id: target.id,
          nodeName: target.nodeName,
          tagName: target.tagName,
          dataSet: Object.entries(target.dataset).map(([key, value]) => `${key}:${value}`).join(','),
        }
      );
    };

    // 定义需要监听的鼠标事件类型数组
    const mouseEvents = ['click', 'dblclick', 'mousemove'] as const;

    // 批量添加鼠标事件监听器
    mouseEvents.forEach(eventType => {
      document.addEventListener(eventType, debounce(mouseEventHandler(eventType), 1000, true, true), {
        capture: true,
        signal
      });
    });

    // 监听窗口大小变化
    window.addEventListener('resize', debounce(() => {
      const { innerWidth, innerHeight } = window;
      this.monitor!.debug(
        this.name,
        `Window Resize: ${innerWidth}x${innerHeight}`
      );
    }, 500, true, true), { signal });
  }
}