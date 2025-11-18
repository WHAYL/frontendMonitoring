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
    private navEventHandlers: { [key: string]: (options?: any) => void } = {};
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
            this.monitor?.reportInfo('INFO', {
                logCategory: LogCategoryKeyValue.pageLifecycle,
                pluginName: this.name,
                message: 'pageLifecycle',
                url: getUniCurrentPages().page,
                extraData: this.routerList,
                timestamp: getTimestamp(),
                date: formatTimestamp()
            });
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

            // 为每个导航方法创建独立的处理函数
            UniNavMethods.forEach(item => {
                this.navEventHandlers[item] = (options) => {
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
                };

                UniNavEventBus.on(item, this.navEventHandlers[item]);
            });
        } catch (error) {
            console.error(error);
        }

    }
    destroy(): void {
        UniAppEventBus.off('onAppHide', this.onAppHideHandel);

        // 注销所有导航事件监听器
        UniNavMethods.forEach(item => {
            if (this.navEventHandlers[item]) {
                UniNavEventBus.off(item, this.navEventHandlers[item]);
                delete this.navEventHandlers[item];
            }
        });

        this.monitor = null;
    }
}