import { getTimestamp, formatTimestamp, getWxCurrentPages, getQueryString } from '../utils';
import type { PageRouterData, RouterExtraData, WxAppMonitorPlugin, WxAppMonitorPluginInitArg } from '../type';
import { LogCategoryKeyValue } from '@whayl/monitor-core';
import { WxAppEventBus, WxPageEventBus, UniCreatePageEventBus } from '../eventBus';

export class RouterPlugin implements WxAppMonitorPlugin {
    name = 'router';
    private monitor: WxAppMonitorPluginInitArg | null = null;
    private routerList: PageRouterData[] = [];
    private showIndex = 0;
    private eventHandlers: { [key: string]: (options: any) => void } = {};
    constructor() {
        this.name = 'router';
    }
    init(monitor: WxAppMonitorPluginInitArg): void {
        this.monitor = monitor;
        this.rewriteWxApp();
        this.rewriteWXRouter();
    }

    getRouterList() {
        // 根据routeEventId去重，保留重复项的最后一条数据
        const uniqueMap = new Map<string, PageRouterData>();
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
            const that = this;
            // 创建独立的处理函数并保存引用
            this.eventHandlers['uniCreatePageOnShow'] = function (options) {
                const { pages, page } = getWxCurrentPages();
                that.routerList.push({
                    page: page,
                    timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
                    routeEventId: "show-" + (++that.showIndex)
                });
            };

            UniCreatePageEventBus.on('onShow', this.eventHandlers['uniCreatePageOnShow']);
        } catch (error) {

        }
    }
    private wxPage() {
        try {
            if (!Page) {
                return;
            }
            const that = this;
            // 创建独立的处理函数并保存引用
            this.eventHandlers['wxPageOnShow'] = function (options) {
                const { pages, page } = getWxCurrentPages();
                that.routerList.push({
                    page: page,
                    timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
                    routeEventId: "show-" + (++that.showIndex)
                });
            };

            WxPageEventBus.on('onShow', this.eventHandlers['wxPageOnShow']);
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
            if (!App) {
                return;
            }
            const that = this;
            // 创建独立的处理函数并保存引用
            this.eventHandlers['wxAppOnHide'] = function (options) {
                if (!that.getRouterList().length) {
                    return;
                }
                that.monitor && that.monitor.reportInfo('INFO', {
                    logCategory: LogCategoryKeyValue.pageLifecycle,
                    pluginName: that.name,
                    message: 'wx.onHide',
                    url: getWxCurrentPages().page,
                    extraData: that.getRouterList(),
                    timestamp: getTimestamp(),
                    date: formatTimestamp()
                });
                that.routerList = [];
            };

            WxAppEventBus.on('onHide', this.eventHandlers['wxAppOnHide']);
        } catch (error) {

        }

    }

    destroy(): void {
        // 注销所有事件监听器
        if (this.eventHandlers['uniCreatePageOnShow']) {
            UniCreatePageEventBus.off('onShow', this.eventHandlers['uniCreatePageOnShow']);
            delete this.eventHandlers['uniCreatePageOnShow'];
        }

        if (this.eventHandlers['wxPageOnShow']) {
            WxPageEventBus.off('onShow', this.eventHandlers['wxPageOnShow']);
            delete this.eventHandlers['wxPageOnShow'];
        }

        if (this.eventHandlers['wxAppOnHide']) {
            WxAppEventBus.off('onHide', this.eventHandlers['wxAppOnHide']);
            delete this.eventHandlers['wxAppOnHide'];
        }

        this.monitor = null;
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
}