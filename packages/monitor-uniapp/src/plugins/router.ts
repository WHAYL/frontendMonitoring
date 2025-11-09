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

                    originUni[item] && originUni[item]({
                        ...obj, success: function (res) {
                            obj.success && obj.success(res);
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
                        }
                    });

                    let ur = '';
                    that.routerList.forEach((item, index) => {
                        ur += index + 1 + '----------' + item.page + ':' + item.timestamp + '-----------';
                    });
                    console.log('rewrite--router', item, ur, that.routerList);
                };
            });
        } catch (error) {
            console.error(error);
        }

    }

    destroy(): void {

        this.monitor = null;
    }
}