import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
import { monitorRouteChange } from '../eventBus';
export interface WhiteScreenConfig {
  keySelectors?: string[]; // 关键渲染元素选择器
  checkInterval?: number; // 检测间隔ms
  timeout?: number; // 超时时间ms
}

export class WhiteScreenPlugin implements MonitorPlugin {
  name = 'whiteScreen';
  private monitor: FrontendMonitor | null = null;
  private config: WhiteScreenConfig;
  private timer: number | null = null;
  private startTime: number = 0;
  private endTime: number = 0;
  private resolved = false;
  private boundHandleRouteChange: (data: any) => void = () => { };

  constructor(config: WhiteScreenConfig = {}) {
    this.config = {
      keySelectors: ['img'],
      checkInterval: 100,
      timeout: 8000,
      ...config
    };
  }

  init(monitor: FrontendMonitor): void {
    this.monitor = monitor;
    this.run();
    this.boundHandleRouteChange = this.handleRouteChange.bind(this);
    monitorRouteChange.on("monitorRouteChange", this.boundHandleRouteChange);
  }
  run(): void {
    if (!this.monitor) {return;}
    this.startTime = this.monitor.getTimestamp();
    this.resolved = false;
    this.startCheck();
  }
  clearEffects(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.resolved = true;
  }
  destroy(): void {
    this.clearEffects();
    if (this.boundHandleRouteChange) {
      monitorRouteChange.off("monitorRouteChange", this.boundHandleRouteChange);
    }
    this.monitor = null;
  }
  /**
    * 处理路由变化事件
    */
  private handleRouteChange(data: any): void {
    this.run();
  }
  private startCheck() {
    const { checkInterval, timeout } = this.config;
    if (!this.monitor) {return;}
    const start = this.monitor.getTimestamp();
    this.timer = window.setInterval(() => {
      if (this.resolved || !this.monitor) {return;}
      const visible = this.checkKeyElements();
      if (visible) {
        this.endTime = this.monitor.getTimestamp();
        this.report('success');
        this.clearEffects();
      } else if (this.monitor.getTimestamp() - start > (timeout || 8000)) {
        this.endTime = this.monitor.getTimestamp();
        this.report('timeout');
        this.clearEffects();
      }
    }, checkInterval);
  }

  // 检查关键元素是否可见/有内容/有图片
  private checkKeyElements(): boolean {
    const selectors = this.config.keySelectors || [];
    for (const sel of selectors) {
      const els = Array.from(document.querySelectorAll(sel));
      for (const el of els) {
        // 图片元素：判断是否已加载且有尺寸
        if (el instanceof HTMLImageElement) {
          if (el.complete && el.naturalWidth > 0 && this.isElementVisible(el)) {return true;}
        } else if (el instanceof HTMLElement) {
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity || '1') === 0) {continue;}

          // 必须有宽高
          if (el.offsetWidth > 0 && el.offsetHeight > 0) {
            // 检查是否在视口中
            const rect = el.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > (window.innerHeight || document.documentElement.clientHeight) || rect.right < 0 || rect.left > (window.innerWidth || document.documentElement.clientWidth)) {
              continue;
            }

            // 文本节点判断
            if (el.textContent && el.textContent.trim().length > 0) {
              if (this.isElementVisible(el)) {return true;}
            }

            // 有可见图片
            const imgs = Array.from(el.querySelectorAll('img')) as HTMLImageElement[];
            if (imgs.some(img => img.complete && img.naturalWidth > 0 && this.isElementVisible(img))) {return true;}

            // 背景或前景色判断（确保不是完全透明）
            const bgColor = style.backgroundColor;
            const color = style.color;
            if ((bgColor && !this.isColorTransparent(bgColor)) || (color && !this.isColorTransparent(color))) {
              if (this.isElementVisible(el)) {return true;}
            }
          }
        }
      }
    }
    return false;
  }

  // 判断颜色是否完全透明 (rgba(0,0,0,0) 或 transparent)
  private isColorTransparent(color: string): boolean {
    if (!color) {return true;}
    if (color === 'transparent') {return true;}
    const rgbaMatch = color.match(/rgba?\(([^)]+)\)/);
    if (!rgbaMatch) {return false;}
    const parts = rgbaMatch[1].split(',').map(p => p.trim());
    if (parts.length === 4) {
      const alpha = parseFloat(parts[3]);
      return alpha === 0;
    }
    return false;
  }

  // 通过 elementFromPoint 检测元素是否被遮挡
  private isElementVisible(el: Element): boolean {
    try {
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      if (x < 0 || y < 0 || x > (window.innerWidth || document.documentElement.clientWidth) || y > (window.innerHeight || document.documentElement.clientHeight)) {
        return false;
      }
      const topEl = document.elementFromPoint(x, y);
      if (!topEl) {return false;}
      return el === topEl || el.contains(topEl) || topEl.contains(el);
    } catch (e) {
      // 任何异常都认为不可见为保守策略
      return false;
    }
  }

  private report(status: 'success' | 'timeout') {
    if (!this.monitor) {return;}
    this.monitor.info(
      this.name,
      `WhiteScreen check ${status}`,
      {
        status,
        page: window.location.href,
        startTime: this.startTime,
        endTime: this.endTime,
        duration: this.endTime - this.startTime,
        selectors: this.config.keySelectors
      }
    );
  }
}
