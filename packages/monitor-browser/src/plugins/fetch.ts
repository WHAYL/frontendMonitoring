import { MonitorPlugin } from '@whayl/monitor-core';
import { getTimestamp, formatTimestamp } from '../utils';
import type { BrowserMonitorPluginInitArg, FetchExtraData } from '../type';

export class FetchPlugin implements MonitorPlugin {
  name = 'fetch';
  private monitor: BrowserMonitorPluginInitArg | null = null;

  init(monitor: BrowserMonitorPluginInitArg): void {
    this.monitor = monitor;
    this.setupFetchMonitoring();
  }

  private setupFetchMonitoring(): void {
    const originalFetch = window.fetch;
    const self = this;

    window.fetch = function (...args) {
      const startTime = getTimestamp();
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
      let method = 'GET';

      if (args[1] && args[1].method) {
        method = args[1].method;
      }

      return originalFetch.apply(this, args).then(response => {
        const endTime = getTimestamp();
        const duration = endTime - startTime;

        // self.monitor!.info(
        //   self.name,
        //   `Fetch Success: ${method} ${url}`,
        //   {
        //     type: 'fetch',
        //     url,
        //     method,
        //     status: response.status,
        //     statusText: response.statusText,
        //     startTime,
        //     endTime,
        //     duration
        //   }
        // );

        return response;
      }).catch(error => {
        const endTime = getTimestamp();
        const duration = endTime - startTime;

        const extraData: FetchExtraData = {
          type: 'fetch',
          url,
          method,
          error: error.message,
          stack: error.stack,
          startTime,
          endTime,
          duration
        };

        self.monitor!.reportInfo('ERROR', {
          pluginName: self.name,
          message: `Fetch Error: ${method} ${url} - ${error.message}`,
          url: window.location.href,
          extraData,
          timestamp: getTimestamp(),
          date: formatTimestamp()
        });

        throw error;
      });
    };
  }

  destroy(): void {
    this.monitor = null;
  }
}