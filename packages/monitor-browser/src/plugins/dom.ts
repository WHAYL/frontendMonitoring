import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
import { debounce } from 'aiy-utils';
type MouseEventNames = 'click' | 'dblclick' | 'mousemove' | 'wheel' | 'mousedown' | 'mouseup' | 'mouseover' | 'mouseout' | 'mouseenter' | 'contextmenu';
export interface DomPluginConfig {
  error?: boolean;
  unhandledrejection?: boolean;
  mouseEvents?: {
    [K in MouseEventNames]?: string[] | boolean;
  }
  resize?: boolean;
}
export class DomPlugin implements MonitorPlugin {
  name = 'dom';
  private monitor: FrontendMonitor | null = null;
  private abortController: AbortController | null = null;
  private config: DomPluginConfig;
  constructor(config: DomPluginConfig = {}) {
    this.config = {
      error: true,
      unhandledrejection: true,
      resize: true,
      ...config,
      // mouseEvents: {
      //   click: true,
      //   dblclick: true,
      //   mousemove: false,
      //   ...config?.mouseEvents
      // },
    };
  }

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
    this.config.error && window.addEventListener('error', (event: ErrorEvent) => {
      this.monitor!.error(
        this.name,
        `JavaScript Error: ${event.message}`,
        event.error
      );
    }, { signal });

    // 监听未处理的Promise拒绝
    this.config.unhandledrejection && window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      this.monitor!.error(
        this.name,
        `Unhandled Promise Rejection: ${event.reason}`,
        typeof event.reason === 'string' ? new Error(event.reason) : event.reason
      );
    }, { signal });

    // 监听点击事件，记录用户交互
    // 使用事件委托：优先通过 event.composedPath() 查找匹配的元素，回退到 target.closest(selector)
    // 配置支持两种形式：
    //  - true: 上报实际 event.target
    //  - string[]: 数组中的每项为 class 名（例如 'btn'）或选择器（以 '.' '#' '[' 或包含空格/> 的视为 selector）
    const mouseEventHandler = (eventType: string) => (event: MouseEvent) => {
      if (!this.config.mouseEvents || !this.config.mouseEvents[eventType]) { return; }

      const cfg = this.config.mouseEvents[eventType];
      const rawTarget = event.target as HTMLElement | null;
      if (!rawTarget) { return; }

      let reportEl: HTMLElement | null = null;

      if (cfg === true) {
        reportEl = rawTarget;
      } else {
        const candidates = cfg as string[];

        // 尝试使用 composedPath 优先查找（支持 shadow DOM）
        const path = typeof (event as any).composedPath === 'function' ? (event as any).composedPath() as EventTarget[] : null;
        if (path && path.length) {
          outer: for (const node of path) {
            if (!(node instanceof HTMLElement)) { continue; }
            for (const cand of candidates) {
              const isSelector = /^(\.|#|\[|[^a-zA-Z0-9_\-])/.test(cand) || /\s|>|\[/.test(cand);
              try {
                if (isSelector) {
                  if ((node as HTMLElement).matches && (node as HTMLElement).matches(cand)) {
                    reportEl = node as HTMLElement;
                    break outer;
                  }
                } else {
                  if ((node as HTMLElement).classList && (node as HTMLElement).classList.contains(cand)) {
                    reportEl = node as HTMLElement;
                    break outer;
                  }
                }
              } catch (e) {
                // ignore invalid selector or other errors
              }
            }
          }
        }

        // 回退：使用 closest 在 target 上查找
        if (!reportEl) {
          for (const cand of candidates) {
            const isSelector = /^(\.|#|\[|[^a-zA-Z0-9_\-])/.test(cand) || /\s|>|\[/.test(cand);
            try {
              const selector = isSelector ? cand : `.${cand}`;
              const found = rawTarget.closest(selector);
              if (found) { reportEl = found as HTMLElement; break; }
            } catch (e) {
              // ignore
            }
          }
        }
      }

      if (!reportEl) { return; }

      this.monitor!.debug(
        this.name,
        `User Mouse Event (${eventType}): ${reportEl.tagName}${reportEl.id ? '#' + reportEl.id : ''}${reportEl.className ? '.' + reportEl.className : ''}`,
        {
          localName: reportEl.localName,
          textContent: reportEl.textContent,
          classList: Array.from(reportEl.classList).join(','),
          className: reportEl.className,
          id: reportEl.id,
          nodeName: reportEl.nodeName,
          tagName: reportEl.tagName,
          dataSet: Object.entries(reportEl.dataset).map(([key, value]) => `${key}:${value}`).join(','),
        }
      );
    };

    // 批量添加鼠标事件监听器
    if (this.config.mouseEvents && Object.keys(this.config.mouseEvents).length > 0) {
      Object.keys(this.config.mouseEvents).forEach(eventType => {
        document.addEventListener(eventType, debounce(mouseEventHandler(eventType), 1000, true, true), {
          capture: true,
          signal
        });
      });
    }

    // 监听窗口大小变化
    this.config.resize && window.addEventListener('resize', debounce(() => {
      const { innerWidth, innerHeight } = window;
      this.monitor!.debug(
        this.name,
        `Window Resize: ${innerWidth}x${innerHeight}`
      );
    }, 500, true, true), { signal });
  }
}