import { getTimestamp, formatTimestamp, getWxCurrentPages, getQueryString } from '../utils';
import type { WxAppMonitorPlugin, WxAppMonitorPluginInitArg } from '../type';
import { LogCategoryKeyValue } from '@whayl/monitor-core';
import { debounce } from 'aiy-utils';

export class RouterPlugin implements WxAppMonitorPlugin {
    name = 'router';
    private monitor: WxAppMonitorPluginInitArg | null = null;
    private routerList: { page: string, timestamp: string, routeEventId: string }[] = [];
    private showIndex = 0;
    constructor() {
        this.name = 'router';
    }
    init(monitor: WxAppMonitorPluginInitArg): void {
        this.monitor = monitor;
        this.rewriteWxApp();
        this.rewriteWXRouter();
    }

    // private inTabbarPage(page) {
    //     return this.monitor?.tabbarPage.some((item) => page.startsWith(item) || item.startsWith('/' + item));
    // }
    // private setTabbarPageProxy(pages: any[]) {
    //     const tabbarPage = this.monitor?.tabbarPage || [];
    //     const that = this;
    //     pages.forEach((item) => {
    //         if (item.proxyRouter) {
    //             return;
    //         }
    //         if (!tabbarPage.includes(item.route as string)) {
    //             return;
    //         }
    //         item.proxyRouter = true;
    //         const originItem = { ...item };
    //         const originRouter = ["onShow"];
    //         originRouter.forEach(pro => {
    //             item[pro] = function (obj) {
    //                 originItem[pro] && originItem[pro](obj);
    //                 that.routerList.push({
    //                     page: item.route + getQueryString(item.options),
    //                     timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
    //                     routeEventId: "show-" + (++that.showIndex)
    //                 });
    //                 console.log('rewrite--cs', pro, item, that.getRouterList());
    //             };
    //         });
    //     });
    // }
    getRouterList() {
        // 根据routeEventId去重，保留重复项的最后一条数据
        const uniqueMap = new Map<string, { page: string, timestamp: string, routeEventId: string }>();
        this.routerList.forEach(item => {
            uniqueMap.set(item.routeEventId, item);
        });
        return Array.from(uniqueMap.values());
    }
    private uniWxCreatePage() {
        try {
            if (!wx) {
                return;
            }
            const wxC = wx.createPage;
            const load = ['onShow'];
            const that = this;
            wx.createPage = function (options) {
                load.forEach(methodName => {
                    const userDefinedMethod = options[methodName]; // 暂存用户定义的方法
                    options[methodName] = function (options) {
                        const { pages, page } = getWxCurrentPages();
                        that.routerList.push({
                            page: page,
                            timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
                            routeEventId: "show-" + (++that.showIndex)
                        });
                        console.log('[rewrite--createPage]', methodName, that.getRouterList());
                        return userDefinedMethod && userDefinedMethod.call(this, options);
                    };
                });
                return wxC(options);
            };
        } catch (error) {

        }
    }
    private wxPage() {
        try {
            console.log('rewrite--Page', Page);
            if (!Page) {
                return;
            }
            const originPage = Page;
            const that = this;
            const load = ['onShow'];
            Page = function (prams) {
                // 合并方法，插入记录脚本
                [...load].forEach((methodName) => {
                    const userDefinedMethod = prams[methodName]; // 暂存用户定义的方法
                    prams[methodName] = function (options) {
                        const { pages, page } = getWxCurrentPages();
                        that.routerList.push({
                            page: page,
                            timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
                            routeEventId: "show-" + (++that.showIndex)
                        });
                        console.log('[rewrite--Page]', methodName, that.getRouterList());
                        return userDefinedMethod && userDefinedMethod.call(this, options);
                    };
                });
                return originPage(prams);
            };
        } catch (error) {

        }
    }
    private rewriteWXRouter() {

        try {
            if (!wx) { return; }
            this.wxPage();
            this.uniWxCreatePage();
            return;
            // if (!wx.onAfterPageLoad || !wx.onAfterPageUnload) {
            //     this.wxPage();
            //     this.uniWxCreatePage();
            //     return;
            // }
            // const { pages, page } = getWxCurrentPages();
            // that.setTabbarPageProxy(pages);
            // let routeEventId = "";
            // wx.onAfterPageLoad(function (res) {
            //     const { pages, page } = getWxCurrentPages();
            //     that.setTabbarPageProxy(pages);
            //     that.routerList.push({
            //         page: page,
            //         timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
            //         routeEventId: res.routeEventId
            //     });
            //     routeEventId = res.routeEventId;
            //     console.log('rewrite--onAfterPageLoad', page, res, that.getRouterList());
            // });
            // wx.onAfterPageUnload(function (res) {
            //     const { pages, page } = getWxCurrentPages();
            //     that.setTabbarPageProxy(pages);
            //     if (!that.inTabbarPage(page) && routeEventId !== res.routeEventId) {
            //         routeEventId = res.routeEventId;
            //         that.routerList.push({
            //             page: page,
            //             timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
            //             routeEventId: res.routeEventId
            //         });
            //     }

            //     console.log('rewrite--onAfterPageUnload', page, res, that.getRouterList());
            // });

        } catch (error) {
            console.log('rewrite--cs error', error);
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