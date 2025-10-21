import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';

interface XhrInfo {
    method: string;
    url: string;
    status: number;
    duration: number;
    requestData?: string;
    responseData?: string;
}

export class XhrPlugin implements MonitorPlugin {
    name = 'xhr';
    private monitor: FrontendMonitor | null = null;
    private xhrOpen: typeof XMLHttpRequest.prototype.open | null = null;
    private xhrSend: typeof XMLHttpRequest.prototype.send | null = null;
    private requests: Map<XMLHttpRequest, { startTime: number, method: string, url: string, data?: string }> = new Map();

    init(monitor: FrontendMonitor): void {
        this.monitor = monitor;
        this.setupXhrMonitoring();
    }

    destroy(): void {
        if (this.xhrOpen) {
            XMLHttpRequest.prototype.open = this.xhrOpen;
        }

        if (this.xhrSend) {
            XMLHttpRequest.prototype.send = this.xhrSend;
        }

        this.requests.clear();
    }

    private setupXhrMonitoring(): void {
        const self = this;

        // 保存原始方法
        this.xhrOpen = XMLHttpRequest.prototype.open;
        this.xhrSend = XMLHttpRequest.prototype.send;

        // 重写open方法以捕获请求信息
        XMLHttpRequest.prototype.open = function (method: string, url: string | URL) {
            // @ts-ignore
            self.requests.set(this, {
                startTime: Date.now(),
                method,
                url: url.toString()
            });

            // 调用原始open方法
            // @ts-ignore
            return self.xhrOpen!.apply(this, arguments);
        };

        // 重写send方法以捕获请求数据和响应
        XMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
            const requestInfo = self.requests.get(this);
            if (requestInfo) {
                requestInfo.data = body ? body.toString() : '';
            }

            // 监听readystatechange事件以捕获响应
            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4 && self.monitor) { // DONE
                    const endTime = Date.now();
                    const duration = endTime - (requestInfo?.startTime || endTime);

                    const xhrInfo: XhrInfo = {
                        method: requestInfo?.method || 'UNKNOWN',
                        url: requestInfo?.url || 'UNKNOWN',
                        status: this.status,
                        duration,
                        requestData: requestInfo?.data,
                        responseData: this.responseText
                    };

                    // 记录请求信息
                    if (this.status >= 400) {
                        // 错误请求
                        self.monitor.error(
                            self.name,
                            `XHR Error: ${xhrInfo.method} ${xhrInfo.url} - Status: ${xhrInfo.status}`,
                            undefined,
                            xhrInfo
                        );
                    } else {
                        // 成功请求
                        self.monitor.info(
                            self.name,
                            `XHR Success: ${xhrInfo.method} ${xhrInfo.url} - Status: ${xhrInfo.status}`
                        );
                    }

                    // 从Map中移除已完成的请求
                    self.requests.delete(this);
                }
            });

            // 调用原始send方法
            // @ts-ignore
            return self.xhrSend!.apply(this, arguments);
        };
    }
}