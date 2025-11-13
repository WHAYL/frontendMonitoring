
import { getTimestamp, formatTimestamp, getWxCurrentPages } from '../utils';
import type { WxAppMonitorPlugin, WxAppMonitorPluginInitArg } from '../type';
import { LogCategoryKeyValue } from '@whayl/monitor-core';

export class RequestPlugin implements WxAppMonitorPlugin {
    name = 'request';
    private monitor: WxAppMonitorPluginInitArg | null = null;

    constructor() {
        this.name = 'request';
    }
    init(monitor: WxAppMonitorPluginInitArg): void {
        this.monitor = monitor;
        this.rewriteHttpRequest();
    }
    rewriteHttpRequest() {
        try {
            const originalRequest = wx.request;
            const self = this;
            wx.request = function (param: any) {
                originalRequest({
                    ...param, fail: function (err: any) {
                        self.monitor!.reportInfo('ERROR', {
                            extraData: { param, err },
                            logCategory: LogCategoryKeyValue.xhrFetch,
                            pluginName: self.name,
                            message: 'wx.request error',
                            url: getWxCurrentPages().page,
                            timestamp: getTimestamp(),
                            date: formatTimestamp()
                        });
                        param.fail && param.fail.call(this, err);
                    }
                });
            };

        } catch (error) {

        }
    }

    destroy(): void {

        this.monitor = null;
    }
}
