import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
import { getTimestamp, formatTimestamp } from '../utils';

interface XhrInfo {
  method: string;
  url: string;
  startTime: number;
}

export class XhrPlugin implements MonitorPlugin {
  name = 'xhr';
  private monitor: FrontendMonitor | null = null;
  private xhrMap: Map<XMLHttpRequest, XhrInfo> = new Map();
  private abortController: AbortController | null = null;

  init(monitor: FrontendMonitor): void {
    this.monitor = monitor;
    // 创建AbortController来管理所有事件监听器
    this.abortController = new AbortController();
    this.setupXhrMonitoring();
  }

  private setupXhrMonitoring(): void {
    const self = this;
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method: string, url: string | URL) {
      // @ts-ignore
      this._xhrInfo = {
        method: method,
        url: url.toString(),
        startTime: getTimestamp()
      };
      // @ts-ignore
      self.xhrMap.set(this, this._xhrInfo);
      // @ts-ignore
      originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
      // @ts-ignore
      const xhrInfo = self.xhrMap.get(this);

      if (xhrInfo) {
        // this.addEventListener('load', function () {
        //   const endTime = self.monitor!.getTimestamp();
        //   const duration = endTime - xhrInfo.startTime;

        //   self.monitor!.info(
        //     self.name,
        //     `XHR Success: ${xhrInfo.method} ${xhrInfo.url}`,
        //     {
        //       type: 'xhr',
        //       url: xhrInfo.url,
        //       method: xhrInfo.method,
        //       status: this.status,
        //       statusText: this.statusText,
        //       startTime: xhrInfo.startTime,
        //       endTime,
        //       duration
        //     }
        //   );

        //   // 清理
        //   self.xhrMap.delete(this);
        // });

        this.addEventListener('error', function () {
          const endTime = getTimestamp();
          const duration = endTime - xhrInfo.startTime;

          self.monitor!.error({
            pluginName: self.name,
            message: `XHR Error: ${xhrInfo.method} ${xhrInfo.url}`,
            url: window.location.href,
            timestamp: getTimestamp(),
            date: formatTimestamp(),
            extraData: {
              type: 'xhr',
              url: xhrInfo.url,
              method: xhrInfo.method,
              error: 'Network Error',
              startTime: xhrInfo.startTime,
              endTime,
              duration
            }
          });

          // 清理
          self.xhrMap.delete(this);
        }, {
          signal: self.abortController?.signal
        });

        this.addEventListener('timeout', function () {
          const endTime = getTimestamp();
          const duration = endTime - xhrInfo.startTime;

          self.monitor!.error({
            pluginName: self.name,
            message: `XHR Timeout: ${xhrInfo.method} ${xhrInfo.url}`,
            url: window.location.href,
            timestamp: getTimestamp(),
            date: formatTimestamp(),
            extraData: {
              type: 'xhr',
              url: xhrInfo.url,
              method: xhrInfo.method,
              error: 'Timeout',
              startTime: xhrInfo.startTime,
              endTime,
              duration
            }
          });

          // 清理
          self.xhrMap.delete(this);
        }, {
          signal: self.abortController?.signal
        });
      }

      // @ts-ignore
      originalSend.apply(this, arguments);
    };
  }

  destroy(): void {
    // 使用abort controller一次性取消所有事件监听器
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.xhrMap.clear();
    this.monitor = null;
  }
}