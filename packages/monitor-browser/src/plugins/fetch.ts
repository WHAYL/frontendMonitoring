import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';

export class FetchPlugin implements MonitorPlugin {
  name = 'fetch';
  private monitor: FrontendMonitor | null = null;

  init(monitor: FrontendMonitor): void {
    this.monitor = monitor;
    this.setupFetchMonitoring();
  }

  private setupFetchMonitoring(): void {
    const originalFetch = window.fetch;
    const self = this;

    window.fetch = function (...args) {
      const startTime = self.monitor!.getTimestamp();
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
      let method = 'GET';

      if (args[1] && args[1].method) {
        method = args[1].method;
      }

      return originalFetch.apply(this, args).then(response => {
        const endTime = self.monitor!.getTimestamp();
        const duration = endTime - startTime;

        self.monitor!.info(
          self.name,
          `Fetch Success: ${method} ${url}`,
          {
            type: 'fetch',
            url,
            method,
            status: response.status,
            statusText: response.statusText,
            startTime,
            endTime,
            duration
          }
        );

        return response;
      }).catch(error => {
        const endTime = self.monitor!.getTimestamp();
        const duration = endTime - startTime;

        self.monitor!.error(
          self.name,
          `Fetch Error: ${method} ${url} - ${error.message}`,
          {
            type: 'fetch',
            url,
            method,
            error: error.message,
            stack: error.stack,
            startTime,
            endTime,
            duration
          }
        );

        throw error;
      });
    };
  }

  destroy(): void {
    this.monitor = null;
  }
}