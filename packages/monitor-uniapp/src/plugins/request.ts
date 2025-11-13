
import { getTimestamp, formatTimestamp, getUniCurrentPages } from '../utils';
import type { UniAppMonitorPlugin, UniAppMonitorPluginInitArg } from '../type';
import { LogCategoryKeyValue } from '@whayl/monitor-core';

export class RequestPlugin implements UniAppMonitorPlugin {
    name = 'request';
    private monitor: UniAppMonitorPluginInitArg | null = null;

    constructor() {
        this.name = 'request';
    }
    init(monitor: UniAppMonitorPluginInitArg): void {
        this.monitor = monitor;
        this.rewriteHttpRequest();
    }
    rewriteHttpRequest() {
        try {
            const originalRequest = uni.request;
            const self = this;
            uni.request = function (param: any) {
                originalRequest({
                    ...param, fail: function (err: any) {
                        self.monitor!.reportInfo('ERROR', {
                            extraData: { param, err },
                            logCategory: LogCategoryKeyValue.xhrFetch,
                            pluginName: self.name,
                            message: 'uni.request error',
                            url: getUniCurrentPages().page,
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
