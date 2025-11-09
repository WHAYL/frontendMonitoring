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
        const that = this;
        wx.onError(function (err) {
            that.monitor && that.monitor.reportInfo('ERROR', {
                logCategory: LogCategoryKeyValue.error,
                pluginName: that.name,
                message: err,
                url: getWxCurrentPages().page,
                extraData: err,
                timestamp: getTimestamp(),
                date: formatTimestamp()
            });
        });
    }

    destroy(): void {

        this.monitor = null;
    }
}