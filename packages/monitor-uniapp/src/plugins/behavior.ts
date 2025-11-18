import { getTimestamp, formatTimestamp, getUniCurrentPages, getQueryString, getDeviceInfo } from '../utils';
import type { UniAppMonitorPlugin, UniAppMonitorPluginInitArg } from '../type';
import { LogCategoryKeyValue } from '@whayl/monitor-core';
import { debounce } from 'aiy-utils';
import { UniPageBindEventBus, uniPageBindMethods, UniAppEventBus } from '../eventBus';

export class BehaviorPlugin implements UniAppMonitorPlugin {
    name = 'behavior';
    private monitor: UniAppMonitorPluginInitArg | null = null;
    private behaviorList: { methods: string, timestamp: string, options: any }[] = [];
    private onAppHideHandel = () => { };
    private userEventHandlers: { [key: string]: (options?: any) => void } = {};
    constructor() {
        this.name = 'behavior';
    }
    init(monitor: UniAppMonitorPluginInitArg): void {
        this.monitor = monitor;
        this.rewriteBehavior();
        this.onAppHideHandel = () => {
            console.log('onAppHide', this.behaviorList.length);
            if (!this.behaviorList.length) {
                return;
            }
            this.monitor?.reportInfo('INFO', {
                logCategory: LogCategoryKeyValue.userBehavior,
                pluginName: this.name,
                message: 'userBehavior',
                url: getUniCurrentPages().page,
                extraData: this.behaviorList,
                timestamp: getTimestamp(),
                date: formatTimestamp()
            });
            this.behaviorList = [];
        };
        UniAppEventBus.on('onAppHide', this.onAppHideHandel);
    }
    private rewriteBehavior() {
        try {
            if (!uni) {
                return;
            }
            const that = this;
            // 为每个导航方法创建独立的处理函数
            uniPageBindMethods.forEach(item => {
                this.userEventHandlers[item] = (options) => {
                    that.behaviorList.push({
                        methods: item,
                        timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
                        options
                    });
                };
                UniPageBindEventBus.on(item, this.userEventHandlers[item]);
            });
        } catch (error) {
            console.error(error);
        }

    }
    destroy(): void {
        UniAppEventBus.off('onAppHide', this.onAppHideHandel);

        // 注销所有导航事件监听器
        uniPageBindMethods.forEach(item => {
            if (this.userEventHandlers[item]) {
                UniPageBindEventBus.off(item, this.userEventHandlers[item]);
                delete this.userEventHandlers[item];
            }
        });

        this.monitor = null;
    }
}