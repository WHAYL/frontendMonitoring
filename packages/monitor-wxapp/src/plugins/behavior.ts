import { getTimestamp, formatTimestamp, getQueryString, getDeviceInfo, getWxCurrentPages } from '../utils';
import type { WxAppMonitorPlugin, WxAppMonitorPluginInitArg } from '../type';
import { LogCategoryKeyValue } from '@whayl/monitor-core';
import { debounce } from 'aiy-utils';
import { WxAppEventBus, WxPageBindEventBus, wxPageBindMethods } from '../eventBus';

export class BehaviorPlugin implements WxAppMonitorPlugin {
    name = 'behavior';
    private monitor: WxAppMonitorPluginInitArg | null = null;
    private behaviorList: { methods: string, timestamp: string, options: any }[] = [];
    private onAppHideHandel = () => { };
    private userEventHandlers: { [key: string]: (options?: any) => void } = {};
    constructor() {
        this.name = 'behavior';
    }
    init(monitor: WxAppMonitorPluginInitArg): void {
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
                url: getWxCurrentPages().page,
                extraData: this.behaviorList,
                timestamp: getTimestamp(),
                date: formatTimestamp()
            });
            this.behaviorList = [];
        };
        WxAppEventBus.on('onHide', this.onAppHideHandel);
    }
    private rewriteBehavior() {
        try {
            const that = this;
            // 为每个导航方法创建独立的处理函数
            wxPageBindMethods.forEach(item => {
                this.userEventHandlers[item] = (options) => {
                    that.behaviorList.push({
                        methods: item,
                        timestamp: formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS', getTimestamp()),
                        options
                    });
                };
                WxPageBindEventBus.on(item, this.userEventHandlers[item]);
            });
        } catch (error) {
            console.error(error);
        }
    }
    destroy(): void {
        // 注销所有事件监听器
        wxPageBindMethods.forEach(item => {
            if (this.userEventHandlers[item]) {
                WxPageBindEventBus.off(item, this.userEventHandlers[item]);
                delete this.userEventHandlers[item];
            }
        });
        this.monitor = null;
    }
}