import { ReportLevelEnum, type MonitorConfig, type ErrorInfo, type MonitorPlugin } from './type';
import { MYSTORAGE_COUNT, IMMEDIATE_REPORT_LEVEL } from './const';

/**
 * 前端监控核心类
 */
export class FrontendMonitor {
    private config: MonitorConfig = {
        reportLevel: IMMEDIATE_REPORT_LEVEL,
        enabled: true,
        maxStorageCount: MYSTORAGE_COUNT
    };

    // 本地存储队列，用于存储未达到上报等级的信息
    private storageQueue: ErrorInfo[] = [];

    // 浏览器指纹
    private fingerprint: string = '';

    /**
     * 初始化监控配置
     * @param config 监控配置
     */
    init(config: Partial<MonitorConfig>): void {
        this.config = Object.assign(this.config, config);

    }

    /**
     * 获取浏览器指纹
     * @returns 浏览器指纹
     */
    getFingerprint(): string {
        return this.fingerprint;
    }



    /**
     * 记录错误信息
     * @param pluginName 插件名称
     * @param level 错误等级
     * @param message 错误消息
     * @param error 可选的错误对象
     */
    log(pluginName: string, level: keyof typeof ReportLevelEnum, message: string, error?: Error, data?: any): void {
        // 检查是否启用监控
        if (!this.config.enabled) {
            return;
        }
        const timestamp = typeof performance !== 'undefined'
            ? Math.floor(performance.now() + performance.timeOrigin)
            : Date.now();
        const errorInfo: ErrorInfo = {
            level,
            message,
            timestamp,
            url: typeof window !== 'undefined' ? window.location.href : '',
            pluginName,
            fingerprint: this.fingerprint,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
            data
        };

        // 检查等级是否满足上报条件
        if (ReportLevelEnum[level] <= ReportLevelEnum[this.config.reportLevel]) {
            // 满足上报条件，执行上报
            this.report(errorInfo);
        } else {
            // 不满足上报条件，存储到本地队列
            this.storeLocally(errorInfo);
        }
    }

    /**
     * 记录错误等级的信息
     * @param pluginName 插件名称
     * @param message 错误消息
     * @param error 可选的错误对象
     */
    error(pluginName: string, message: string, error?: Error, data?: any): void {
        this.log(pluginName, 'ERROR', message, error, data);
    }

    /**
     * 记录警告等级的信息
     * @param pluginName 插件名称
     * @param message 警告消息
     * @param error 可选的错误对象
     */
    warn(pluginName: string, message: string, error?: Error, data?: any): void {
        this.log(pluginName, 'WARN', message, error, data);
    }

    /**
     * 记录信息等级的信息
     * @param pluginName 插件名称
     * @param message 信息消息
     */
    info(pluginName: string, message: string, data?: any): void {
        this.log(pluginName, 'INFO', message, undefined, data);
    }

    /**
     * 记录调试等级的信息
     * @param pluginName 插件名称
     * @param message 调试消息
     */
    debug(pluginName: string, message: string, data?: any): void {
        this.log(pluginName, 'DEBUG', message, undefined, data);
    }

    /**
     * 将信息存储到本地队列
     * @param errorInfo 错误信息
     */
    private storeLocally(errorInfo: ErrorInfo): void {
        // 添加到队列开头
        this.storageQueue.unshift(errorInfo);

        // 如果超出最大存储数量，移除最旧的记录
        if (this.storageQueue.length > (this.config.maxStorageCount || MYSTORAGE_COUNT)) {
            this.storageQueue.pop();
        }
    }

    /**
     * 检查并上报本地存储的信息
     * 当上报等级发生变化时调用此方法
     */
    checkAndReportStored(): void {
        if (!this.config.enabled || this.storageQueue.length === 0) {
            return;
        }

        // 过滤出满足当前上报等级的信息
        const reportableItems = this.storageQueue.filter(
            item => ReportLevelEnum[item.level] <= ReportLevelEnum[this.config.reportLevel]
        );

        if (reportableItems.length > 0) {
            // 上报这些信息
            reportableItems.forEach(item => this.report(item));

            // 从存储队列中移除已上报的信息
            this.storageQueue = this.storageQueue.filter(
                item => ReportLevelEnum[item.level] > ReportLevelEnum[this.config.reportLevel]
            );
        }
    }

    /**
     * 更新上报等级配置
     * @param level 新的上报等级
     */
    updateReportLevel(level: keyof typeof ReportLevelEnum): void {
        this.config.reportLevel = level;
        // 上报等级变化后，检查本地存储的信息是否满足新的上报条件
        this.checkAndReportStored();
    }

    /**
     * 实际执行上报逻辑
     * @param errorInfo 错误信息
     */
    private report(errorInfo: ErrorInfo): void {
        // 在实际项目中，这里会发送数据到后端服务器
        console.log(`[Frontend Monitor] ${errorInfo.level.toUpperCase()}: ${errorInfo.message}`, errorInfo);

        // 示例上报逻辑：
        // fetch('/api/monitor/report', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(errorInfo)
        // });
    }

    /**
     * 销毁监控实例，清理资源
     */
    destroy(): void {
        // 清空存储队列
        this.storageQueue = [];
    }
}
const monitor = new FrontendMonitor()
// 导出类型定义
export { ReportLevelEnum, monitor };
export type { MonitorConfig, ErrorInfo, MonitorPlugin };