import { getTimestamp, formatTimestamp, getWxCurrentPages } from '../utils';
import type { WxAppMonitorPlugin, WxAppMonitorPluginInitArg } from '../type';
import { LogCategoryKeyValue } from '@whayl/monitor-core';

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
            console.log('rewrite--App', App);
            if (!App) {
                return;
            }
            const originApp = App;
            const that = this;
            const err = ['onError', 'onUnhandledRejection', 'onPageNotFound'];
            App = function (app) {
                // 合并方法，插入记录脚本
                [...err].forEach((methodName) => {
                    const userDefinedMethod = app[methodName]; // 暂存用户定义的方法
                    app[methodName] = function (options) {
                        that.monitor?.reportInfo('ERROR', {
                            logCategory: LogCategoryKeyValue.error,
                            pluginName: that.name,
                            message: 'wxapp ' + methodName,
                            url: getWxCurrentPages().page,
                            extraData: options,
                            timestamp: getTimestamp(),
                            date: formatTimestamp()
                        });
                        return userDefinedMethod && userDefinedMethod.call(that, options);
                    };
                });
                return originApp(app);
            };
        } catch (error) {

        }

    }

    destroy(): void {

        this.monitor = null;
    }
}