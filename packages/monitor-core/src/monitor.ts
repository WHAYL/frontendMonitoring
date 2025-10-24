import { ReportLevelEnum, type MonitorConfig, type ErrorInfo, type LogData, ReportingLevel } from './type';
import { MYSTORAGE_COUNT, IMMEDIATE_REPORT_LEVEL } from './const';

/**
 * 前端监控核心类
 */
export class FrontendMonitor {
    private config: MonitorConfig = {
        reportLevel: IMMEDIATE_REPORT_LEVEL,
        enabled: true,
        maxStorageCount: MYSTORAGE_COUNT,
        uploadHandler: null,
        platform: ''
    };

    // 本地存储队列，用于存储未达到上报等级的信息
    private storageQueue: ErrorInfo[] = [];

    // 本地存储队列，用于存储未被 storageQueue 移除的信息
    private removedItems: ErrorInfo[] = [];

    // 浏览器指纹
    private fingerprint: string = '';

    private oldFingerprint: string = '';

    /**
     * 初始化监控配置
     * @param config 监控配置
     */
    init(config: MonitorConfig): void {
        this.config = Object.assign(this.config, config);
        this.fingerprint = this.config?.fingerprint || "";

    }
    // 支持运行时动态更新配置
    public updateConfig(newConfig: Partial<MonitorConfig>): void {
        const oldConfig = { ...this.config };
        this.config = Object.assign(this.config, newConfig);

        // 如果上报等级发生变化，检查是否需要上报存储的日志
        if (oldConfig.reportLevel !== this.config.reportLevel) {
            this.checkAndReportStored();
        }

        // 如果浏览器指纹发生变化，则更新
        if (oldConfig.fingerprint !== this.config.fingerprint && this.config.fingerprint) {
            this.setFingerprint(this.config.fingerprint);
        }
    }

    /**
     * 获取浏览器指纹
     * @returns 浏览器指纹
     */
    getFingerprint(): string {
        return this.fingerprint;
    }

    setFingerprint(fingerprint: string): void {
        this.oldFingerprint = this.fingerprint;
        this.fingerprint = fingerprint;
    }

    /**
     * 记录日志的通用方法
     * @param pluginName 插件名称
     * @param level 日志等级
     * @param message 日志消息
     * @param extraData 额外数据
     */
    private log(info: LogData & { level: keyof typeof ReportLevelEnum }): void {
        // 如果监控未启用，则直接返回
        if (!this.config.enabled) { return; }

        // 创建错误信息对象
        const errorInfo: ErrorInfo = {
            ...info,
            fingerprint: this.fingerprint,
            oldFingerprint: this.oldFingerprint,
            platform: this.config.platform
        };

        // 判断是否需要立即上报
        if (ReportLevelEnum[info.level] <= ReportLevelEnum[this.config.reportLevel]) {
            // 立即上报
            this.report(errorInfo);
        } else {
            // 存储到本地队列
            this.storageQueue.push(errorInfo);

            // 如果存储队列超过最大数量，则移除最旧的信息
            if (this.storageQueue.length > (this.config.maxStorageCount || MYSTORAGE_COUNT)) {
                const data: ErrorInfo | undefined = this.storageQueue.shift();
                if (data) {
                    // 限制removedItems数组大小，避免无限增长
                    if (this.removedItems.length > (this.config.maxStorageCount || MYSTORAGE_COUNT) && this.removedItems.length) {
                        this.report(this.removedItems);
                        this.removedItems = [];
                    }
                    this.removedItems.push(data);
                }
            }
        }
    }
    reportInfo(level: ReportingLevel, info: LogData) {
        this.log({
            ...info,
            level: level
        });
    }

    /**
     * 检查本地存储的信息是否满足新的上报条件
     */
    private checkAndReportStored(): void {
        // 过滤出满足当前上报等级的信息
        const reportableItems = this.storageQueue.filter(
            item => ReportLevelEnum[item.level] <= ReportLevelEnum[this.config.reportLevel]
        );

        if (reportableItems.length > 0) {
            // 上报满足条件的信息
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
     * 获取存储队列
     * @returns 存储队列
     */
    getStorageQueue(): ErrorInfo[] {
        return this.storageQueue;
    }
    /**
     * 清空存储队列
     */
    clearStorageQueue(): void {
        this.storageQueue = [];
    }
    /**
     * 上报存储队列中的所有信息
     */
    reportStorageQueue(): void {
        // this.storageQueue.forEach(item => this.report(item));
        if (this.storageQueue.length > 0) {
            this.report(this.storageQueue);
            this.clearStorageQueue();
        }
    }
    /**
     * 上报被移除的所有信息
     */
    reportRemovedItems(): void {
        if (this.removedItems.length > 0) {
            this.report(this.removedItems);
            this.removedItems = [];
        }
    }
    /**
     * 上报剩余的所有信息
     */
    reportRestInfo(): void {
        this.reportStorageQueue();
        this.reportRemovedItems();
    }

    /**
     * 实际执行上报逻辑
     * @param errorInfo 错误信息
     */
    private report(errorInfo: ErrorInfo | ErrorInfo[]): void {
        // 如果配置了自定义上传处理函数，则使用它
        if (typeof this.config.uploadHandler === 'function') {
            try {
                this.config.uploadHandler(errorInfo);
            } catch (err) {
                console.error('[Frontend Monitor] Failed to send error report with custom handler:', err);
            }
        } else {
            // 如果没有配置上传方式，则输出到控制台
            console.log(`[Frontend Monitor] : ${JSON.stringify(errorInfo)}`);
        }
    }

    /**
     * 销毁监控实例，清理资源
     */
    destroy(): void {
        // 清空存储队列
        this.clearStorageQueue();
    }
}