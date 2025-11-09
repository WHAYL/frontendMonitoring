import { getTimestamp, formatTimestamp, getUniCurrentPages, getQueryString, getDeviceInfo } from '../utils';
import type { UniAppMonitorPlugin, UniAppMonitorPluginInitArg } from '../type';
import { LogCategoryKeyValue } from '@whayl/monitor-core';
import { debounce } from 'aiy-utils';

export class RouterPlugin implements UniAppMonitorPlugin {
    name = 'router';
    private monitor: UniAppMonitorPluginInitArg | null = null;
    private routerList: { page: string, timestamp: string }[] = [];
    constructor() {
        this.name = 'router';
    }
    init(monitor: UniAppMonitorPluginInitArg): void {
        this.monitor = monitor;

        getDeviceInfo().then((res) => {
            console.log('rewrite--init', res.uniPlatform);
            switch (res.uniPlatform) {
                case 'web':
                    this.rewriteRouter();
                    break;
                case 'mp-weixin':
                    this.rewriteWxApp();
                    this.rewriteWXRouter();
                    break;
                default: this.rewriteRouter();
            }
        });

    }
    private rewriteRouter() {
        try {
            if (!uni) {
                return;
            }
            const that = this;
            setTimeout(() => {
                const { pages, page } = getUniCurrentPages();
                that.routerList.push({
                    page: page,
                    timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
                });
            }, 400);
            const originUni = { ...uni };
            const originRouter = ["switchTab", "navigateTo", "redirectTo", "reLaunch", "navigateBack"];
            originRouter.forEach(item => {
                uni[item] = function (obj) {
                    if (item === 'navigateBack') {
                        setTimeout(() => {
                            const { pages, page } = getUniCurrentPages();
                            that.routerList.push({
                                page: page,
                                timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
                            });
                        }, 40);

                    } else {
                        that.routerList.push({
                            page: obj.url,
                            timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
                        });
                    }
                    originUni[item] && originUni[item](obj);

                    let ur = '';
                    that.routerList.forEach((item, index) => {
                        ur += index + 1 + '----------' + item.page + ':' + item.timestamp + ';';
                    });
                    console.log('rewrite--router', item, ur);
                };
            });
        } catch (error) {
            console.error(error);
        }

    }
    private inTabbarPage(page) {
        return this.monitor?.tabbarPage.some((item) => page.startsWith(item) || item.startsWith('/' + item));
    }
    private setTabbarPageProxy(pages: any[]) {
        console.log('getUniCurrentPages', pages);
        const tabbarPage = this.monitor?.tabbarPage || [];
        const that = this;
        pages.forEach((item) => {
            if (item.proxyRouter) {
                return;
            }
            if (!tabbarPage.includes(item.route as string)) {
                return;
            }
            item.proxyRouter = true;
            const originItem = { ...item };
            const originRouter = ["onShow"];
            originRouter.forEach(pro => {
                item[pro] = function (obj) {
                    originItem[pro] && originItem[pro](obj);
                    that.routerList.push({
                        page: item.route + getQueryString(item.options),
                        timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
                    });
                    console.log('rewrite--cs', pro, item, that.routerList);
                };
            });
        });
    }
    private rewriteWXRouter() {

        try {
            const that = this;
            if (!wx) { return; }
            if (!wx.onAfterPageLoad || !wx.onAfterPageUnload) {
                return;
            }
            const { pages, page } = getUniCurrentPages();
            that.setTabbarPageProxy(pages);
            let routeEventId = "";
            wx.onAfterPageLoad(function (res) {
                const { pages, page } = getUniCurrentPages();
                that.setTabbarPageProxy(pages);
                that.routerList.push({
                    page: page,
                    timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
                });
                routeEventId = res.routeEventId;
                console.log('rewrite--onAfterPageLoad', page, res, that.routerList);
            });
            wx.onAfterPageUnload(debounce(function (res) {
                const { pages, page } = getUniCurrentPages();
                that.setTabbarPageProxy(pages);
                if (!that.inTabbarPage(page) && routeEventId !== res.routeEventId) {
                    routeEventId = res.routeEventId;
                    that.routerList.push({
                        page: page,
                        timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
                    });
                }

                console.log('rewrite--onAfterPageUnload', page, res, that.routerList);
            }, 1000, false, true));

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