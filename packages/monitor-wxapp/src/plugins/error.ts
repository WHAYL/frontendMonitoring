import { getTimestamp, formatTimestamp, getWxCurrentPages } from '../utils';
import type { WxAppMonitorPlugin, WxAppMonitorPluginInitArg } from '../type';
import { LogCategoryKeyValue } from '@whayl/monitor-core';
import { WxAppEventBus } from '../eventBus';

export class ErrorPlugin implements WxAppMonitorPlugin {
    name = 'error';
    private monitor: WxAppMonitorPluginInitArg | null = null;
    private errorEventHandlers: { [key: string]: (options?: any) => void } = {};
    private errMethods = ['onError', 'onUnhandledRejection', 'onPageNotFound'] as const;
    constructor() {
        this.name = 'error';
    }
    init(monitor: WxAppMonitorPluginInitArg): void {
        this.monitor = monitor;
        this.rewriteWxApp();
        this.rewriteUniApp();
        // this.wxMethods()

    }
    private wxMethods() {
        const that = this;
        const methods = ['onError', 'onPageNotFound', 'onUnhandledRejection'];
        methods.forEach((methodName) => {
            wx[methodName](function (err) {
                that.monitor && that.monitor.reportInfo('ERROR', {
                    logCategory: LogCategoryKeyValue.error,
                    pluginName: that.name,
                    message: 'wx.' + methodName,
                    url: getWxCurrentPages().page,
                    extraData: err,
                    timestamp: getTimestamp(),
                    date: formatTimestamp()
                });
            });
        });
    }
    private rewriteUniApp() {
        try {
            if (!uni) {
                return;
            }
            const that = this;
            this.errMethods.forEach((methodName) => {
                uni[methodName](function (err) {
                    that.monitor && that.monitor.reportInfo('ERROR', {
                        logCategory: LogCategoryKeyValue.error,
                        pluginName: that.name,
                        message: 'uni.' + methodName,
                        url: getWxCurrentPages().page,
                        extraData: err,
                        timestamp: getTimestamp(),
                        date: formatTimestamp()
                    });
                });
            });
        } catch (error) {

        }
    }
    /** 拦截 微信 App */
    private rewriteWxApp() {
        try {
            if (!App) {
                return;
            }
            const that = this;
            this.errMethods.forEach((methodName) => {
                // 创建独立的处理函数并保存引用
                this.errorEventHandlers[methodName] = (options) => {
                    that.monitor?.reportInfo('ERROR', {
                        logCategory: LogCategoryKeyValue.error,
                        pluginName: that.name,
                        message: 'wx-App ' + methodName,
                        url: getWxCurrentPages().page,
                        extraData: options,
                        timestamp: getTimestamp(),
                        date: formatTimestamp()
                    });
                };

                WxAppEventBus.on(methodName, this.errorEventHandlers[methodName]);
            });
        } catch (error) {

        }

    }

    destroy(): void {
        // 注销所有错误事件监听器
        this.errMethods.forEach((methodName) => {
            if (this.errorEventHandlers[methodName]) {
                WxAppEventBus.off(methodName, this.errorEventHandlers[methodName]);
                delete this.errorEventHandlers[methodName];
            }
        });

        this.monitor = null;
    }
}