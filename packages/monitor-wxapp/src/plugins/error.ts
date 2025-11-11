import { getTimestamp, formatTimestamp, getWxCurrentPages } from '../utils';
import type { WxAppMonitorPlugin, WxAppMonitorPluginInitArg } from '../type';
import { LogCategoryKeyValue } from '@whayl/monitor-core';
import { WxAppEventBus } from '../eventBus';

export class ErrorPlugin implements WxAppMonitorPlugin {
    name = 'error';
    private monitor: WxAppMonitorPluginInitArg | null = null;
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
            const methods = ['onError', 'onUnhandledRejection', 'onPageNotFound'];
            methods.forEach((methodName) => {
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
            const err = ['onError', 'onUnhandledRejection', 'onPageNotFound'] as const;
            [...err].forEach((methodName) => {
                WxAppEventBus.on(methodName, function (options) {
                    that.monitor?.reportInfo('ERROR', {
                        logCategory: LogCategoryKeyValue.error,
                        pluginName: that.name,
                        message: 'wx-App ' + methodName,
                        url: getWxCurrentPages().page,
                        extraData: options,
                        timestamp: getTimestamp(),
                        date: formatTimestamp()
                    });
                });
            });
        } catch (error) {

        }

    }

    destroy(): void {

        this.monitor = null;
    }
}