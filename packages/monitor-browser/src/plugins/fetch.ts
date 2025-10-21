import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';

interface FetchInfo {
  url: string;
  method: string;
  status?: number;
  duration: number;
  requestData?: string;
  responseData?: string;
}

export class FetchPlugin implements MonitorPlugin {
  name = 'fetch';
  private monitor: FrontendMonitor | null = null;
  private originalFetch: typeof fetch | null = null;

  init(monitor: FrontendMonitor): void {
    this.monitor = monitor;
    this.setupFetchMonitoring();
  }

  destroy(): void {
    if (this.originalFetch) {
      window.fetch = this.originalFetch;
    }
  }

  private setupFetchMonitoring(): void {
    const self = this;

    // 保存原始fetch方法
    this.originalFetch = window.fetch;

    // 重写fetch方法
    window.fetch = function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      const startTime = Date.now();
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      const method = init?.method || (typeof input !== 'string' && !(input instanceof URL) ? input.method : 'GET') || 'GET';

      // 调用原始fetch方法
      // @ts-ignore
      return self.originalFetch!.apply(this, arguments).then((response: Response) => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        const fetchInfo: FetchInfo = {
          url,
          method,
          status: response.status,
          duration,
          requestData: init?.body ? init.body.toString() : undefined
        };

        // 记录请求信息
        if (!response.ok) {
          // 错误响应
          self.monitor!.error(
            self.name,
            `Fetch Error: ${fetchInfo.method} ${fetchInfo.url} - Status: ${fetchInfo.status}`,
            undefined,
            fetchInfo
          );
        } else {
          // 成功响应
          self.monitor!.info(
            self.name,
            `Fetch Success: ${fetchInfo.method} ${fetchInfo.url} - Status: ${fetchInfo.status}`
          );
        }

        return response;
      }).catch((error: Error) => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // 记录异常
        self.monitor!.error(
          self.name,
          `Fetch Exception: ${method} ${url} - Error: ${error.message}`,
          error
        );

        throw error;
      });
    };
  }
}