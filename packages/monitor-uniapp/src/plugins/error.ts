import { getTimestamp, formatTimestamp, getUniCurrentPages } from '../utils';
import type { DomErrorExtraData, DomUnhandledRejectionExtraData, UniAppMonitorPlugin, UniAppMonitorPluginInitArg } from '../type';
import { LogCategoryKeyValue } from '@whayl/monitor-core';

export class ErrorPlugin implements UniAppMonitorPlugin {
    name = 'error';
    abortController: any;
    private monitor: UniAppMonitorPluginInitArg | null = null;
    constructor() {
        this.name = 'error';
    }
    init(monitor: UniAppMonitorPluginInitArg): void {
        this.monitor = monitor;
        const that = this;
        const methods = ['onError', 'onPageNotFound'];
        methods.forEach((methodName) => {
            uni[methodName](function (err) {
                that.monitor && that.monitor.reportInfo('ERROR', {
                    logCategory: LogCategoryKeyValue.error,
                    pluginName: that.name,
                    message: 'uni.' + methodName,
                    url: getUniCurrentPages().page,
                    extraData: err,
                    timestamp: getTimestamp(),
                    date: formatTimestamp()
                });
            });
        });
        this.h5ErrorHandler();
    }
    private h5ErrorHandler() {
        try {
            if (!window || !window.addEventListener) {
                return;
            }
            // 创建AbortController来管理所有事件监听器
            this.abortController = new AbortController();
            const { signal } = this.abortController;

            // 监听未捕获的错误
            window.addEventListener('error', (event: ErrorEvent) => {
                const extraData: DomErrorExtraData = {
                    message: event.message,           // 错误信息
                    filename: event.filename,         // 发生错误的文件
                    lineno: event.lineno,             // 行号
                    colno: event.colno,               // 列号
                    error: event.error,               // Error 对象
                };
                this.monitor!.reportInfo('ERROR', {
                    logCategory: LogCategoryKeyValue.error,
                    pluginName: this.name,
                    message: `JavaScript Error: ${event.message}`,
                    url: window.location.href,
                    extraData,
                    timestamp: getTimestamp(),
                    date: formatTimestamp()
                });
            }, { signal });

            // 监听未处理的Promise拒绝
            window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
                const extraData: DomUnhandledRejectionExtraData = {
                    type: event.type,
                    // Promise 相关信息
                    promise: event.promise,              // 被拒绝的 Promise 对象
                    reason: event.reason,                // 拒绝原因

                    // 拒绝原因的详细解析
                    reasonType: typeof event.reason,
                    isError: event.reason instanceof Error,

                    // 如果是 Error 对象
                    errorMessage: event.reason?.message,
                    errorStack: event.reason?.stack,
                    errorName: event.reason?.name,
                };
                this.monitor!.reportInfo('ERROR', {
                    logCategory: LogCategoryKeyValue.error,
                    pluginName: this.name,
                    message: `Unhandled Promise Rejection: ${event.reason}`,
                    url: window.location.href,
                    extraData,
                    timestamp: getTimestamp(),
                    date: formatTimestamp()
                });
            }, { signal });
        } catch (error) {

        }

    }
    destroy(): void {
        // 使用abort controller一次性取消所有事件监听器
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }

        this.monitor = null;
    }
}