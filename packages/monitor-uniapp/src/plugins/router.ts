import { getTimestamp, formatTimestamp, getUniCurrentPages, getQueryString, getDeviceInfo } from '../utils';
import type { UniAppMonitorPlugin, UniAppMonitorPluginInitArg } from '../type';
import { LogCategoryKeyValue } from '@whayl/monitor-core';
import { debounce } from 'aiy-utils';
import { UniNavEventBus, UniNavMethods, UniAppEventBus } from '../eventBus';

export class RouterPlugin implements UniAppMonitorPlugin {
    name = 'router';
    private monitor: UniAppMonitorPluginInitArg | null = null;
    private routerList: { page: string, timestamp: string }[] = [];
    private onAppHideHandel = () => { };
    constructor() {
        this.name = 'router';
    }
    init(monitor: UniAppMonitorPluginInitArg): void {
        this.monitor = monitor;

        getDeviceInfo().then((res) => {
            switch (res.uniPlatform) {
                case 'web':
                    this.rewriteRouter();
                    break;
                case 'mp-weixin':

                    break;
                default: this.rewriteRouter();
            }
        });
        this.onAppHideHandel = () => {
            console.log('app hide', this.routerList);
        };
        UniAppEventBus.on('onAppHide', this.onAppHideHandel);
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
            UniNavMethods.forEach(item => {
                UniNavEventBus.on(item, (options) => {
                    if (item !== 'navigateBack') {
                        const { pages, page } = getUniCurrentPages();
                        that.routerList.push({
                            page: options.url,
                            timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
                        });
                    } else {
                        setTimeout(() => {
                            const { pages, page } = getUniCurrentPages();
                            that.routerList.push({
                                page: page,
                                timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
                            });
                        }, 40);
                    }
                    console.log('router', item, that.routerList);
                });
            });
        } catch (error) {
            console.error(error);
        }

    }
    destroy(): void {

        this.monitor = null;
    }
}