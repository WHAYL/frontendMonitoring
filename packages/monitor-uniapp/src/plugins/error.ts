import { getTimestamp, formatTimestamp, getUniCurrentPages } from '../utils';
import type { UniAppMonitorPlugin, UniAppMonitorPluginInitArg } from '../type';
import { LogCategoryKeyValue } from '@whayl/monitor-core';

export class ErrorPlugin implements UniAppMonitorPlugin {
    name = 'error';
    private monitor: UniAppMonitorPluginInitArg | null = null;
    constructor() {
        this.name = 'error';
    }
    init(monitor: UniAppMonitorPluginInitArg): void {
        this.monitor = monitor;
        const that = this;
        const methods = ['onError', 'onPageNotFound'];
        methods.forEach((methodName) => {
            uni[methodName](function (err) {
                that.monitor && that.monitor.reportInfo('ERROR', {
                    logCategory: LogCategoryKeyValue.error,
                    pluginName: that.name,
                    message: 'uni.' + methodName,
                    url: getUniCurrentPages().page,
                    extraData: err,
                    timestamp: getTimestamp(),
                    date: formatTimestamp()
                });
            });
        });
    }

    destroy(): void {

        this.monitor = null;
    }
}