import { getTimestamp, formatTimestamp, getUniCurrentPages } from '../utils';
import type { UniAppMonitorPlugin, UniAppMonitorPluginInitArg } from '../type';
import { LogCategoryKeyValue } from '@whayl/monitor-core';

export class RouterPlugin implements UniAppMonitorPlugin {
    name = 'router';
    private monitor: UniAppMonitorPluginInitArg | null = null;
    constructor() {
        this.name = 'router';
    }
    init(monitor: UniAppMonitorPluginInitArg): void {
        this.monitor = monitor;
        // this.rewriteRouter();
        this.rewriteApp();
        this.rewritePage();
        this.rewriteWXRouter();

    }
    private rewriteRouter() {
        try {
            if (!uni) {
                return;
            }
            const originUni = { ...uni };
            const originRouter = ["switchTab", "navigateTo", "redirectTo", "reLaunch", "navigateBack"];
            originRouter.forEach(item => {
                uni[item] = function (obj) {
                    originUni[item] && originUni[item](obj);
                    console.log('rewrite--router', item, obj);
                };
            });
        } catch (error) {
            console.error(error);
        }

    }
    private rewriteWXRouter() {
        try {
            if (!wx) { return; }
            wx.onBeforePageLoad(function (res) {
                console.log('rewrite--onBeforePageLoad', res);
            });
            wx.onAfterPageLoad(function (res) {
                console.log('rewrite--onAfterPageLoad', getUniCurrentPages());
            });
            wx.onBeforePageUnload(function (res) {
                console.log('rewrite--onBeforePageUnload', res);
            });
            wx.onAfterPageUnload(function (res) {
                console.log('rewrite--onAfterPageUnload', res, getUniCurrentPages());
            });
            const originWx = { ...wx };
            const originRouter = ["switchTab", "navigateTo", "redirectTo", "reLaunch", "navigateBack"];
            originRouter.forEach(item => {
                wx[item] = function (obj) {
                    originWx[item] && originWx[item](obj);
                    console.log('rewrite--cs', item, obj);
                    setTimeout(() => {
                        console.log('rewrite--cs', item, getUniCurrentPages());
                    }, 0);
                };
            });
        } catch (error) {
            console.log('rewrite--cs error', error);
        }
    }

    /** 拦截 微信 Page */
    private rewritePage() {
        try {
            console.log('rewrite--page', Page);
            if (!Page) {
                return;
            }
            const originPage = Page;
            const that = this;
            const load = ['onLoad', 'onShow', 'onHide', 'onReady', 'onUnload', 'onTabItemTap'];
            Page = function (page) {
                console.log('rewrite--page', 111111);
                // 合并方法，插入记录脚本
                [...load].forEach((methodName) => {
                    const userDefinedMethod = page[methodName]; // 暂存用户定义的方法
                    page[methodName] = function (options) {
                        console.log('[rewrite--Page]', methodName, options);
                        return userDefinedMethod && userDefinedMethod.call(this, options);
                    };
                });
                return originPage(page);
            };
        } catch (error) {

        }
    }
    /** 拦截 微信 App */
    private rewriteApp() {
        try {
            console.log('rewrite--App', App);
            if (!App) {
                return;
            }
            const originApp = App;
            const that = this;
            const err = ['onError', 'onUnhandledRejection', 'onPageNotFound'];
            const load = ['onLaunch', 'onShow', 'onHide'];
            App = function (app) {
                // 合并方法，插入记录脚本
                [...err, ...load].forEach((methodName) => {
                    const userDefinedMethod = app[methodName]; // 暂存用户定义的方法
                    app[methodName] = function (options) {
                        console.log('[rewrite--App]', methodName, options);
                        return userDefinedMethod && userDefinedMethod.call(this, options);
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