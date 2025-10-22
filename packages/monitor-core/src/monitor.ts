import { ReportLevelEnum, type MonitorConfig, type ErrorInfo, type MonitorPlugin } from './type';
import { MYSTORAGE_COUNT, IMMEDIATE_REPORT_LEVEL } from './const';

/**
 * 前端监控核心类
 */
export class FrontendMonitor {
    private config: MonitorConfig = {
        reportLevel: IMMEDIATE_REPORT_LEVEL,
        enabled: true,
        maxStorageCount: MYSTORAGE_COUNT,
        uploadHandler: (data: ErrorInfo) => {
            console.log('[Frontend Monitor] No upload handler configured. Error info:', data);
        }
    };

    // 本地存储队列，用于存储未达到上报等级的信息
    private storageQueue: ErrorInfo[] = [];

    // 浏览器指纹
    private fingerprint: string = '';

    /**
     * 获取高精度时间戳
     * 优先使用 performance.now() + performance.timeOrigin，如果不支持则回退到 Date.now()
     * @returns 时间戳（毫秒）
     */
    getTimestamp(): number {
        return typeof performance !== 'undefined' && typeof performance.now === 'function' && typeof performance.timeOrigin === 'number'
            ? performance.now() + performance.timeOrigin
            : Date.now();
    }

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
     * 记录日志的通用方法
     * @param pluginName 插件名称
     * @param level 日志等级
     * @param message 日志消息
     * @param extraData 额外数据
     */
    private log(pluginName: string, level: keyof typeof ReportLevelEnum, message: string, extraData: Record<string, any> = {}): void {
        // 如果监控未启用，则直接返回
        if (!this.config.enabled) return;

        // 创建错误信息对象
        const errorInfo: ErrorInfo = {
            level,
            message,
            timestamp: this.getTimestamp(), // 使用高精度时间戳
            url: typeof window !== 'undefined' ? window.location.href : '',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
            pluginName,
            fingerprint: this.fingerprint,
            devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
            extraData
        };

        // 判断是否需要立即上报
        if (ReportLevelEnum[level] <= ReportLevelEnum[this.config.reportLevel]) {
            // 立即上报
            this.report(errorInfo);
        } else {
            // 存储到本地队列
            this.storageQueue.push(errorInfo);

            // 如果存储队列超过最大数量，则移除最旧的信息
            if (this.storageQueue.length > (this.config.maxStorageCount || MYSTORAGE_COUNT)) {
                const data: ErrorInfo | undefined = this.storageQueue.shift();
                if (data) {
                    this.report(data);
                }
            }
        }
    }

    /**
     * 记录错误信息
     * @param pluginName 插件名称
     * @param message 错误消息
     * @param extraData 额外数据
     */
    error(pluginName: string, message: string, extraData: Record<string, any> = {}): void {
        this.log(pluginName, 'ERROR', message, extraData);
    }

    /**
     * 记录警告信息
     * @param pluginName 插件名称
     * @param message 警告消息
     * @param extraData 额外数据
     */
    warn(pluginName: string, message: string, extraData: Record<string, any> = {}): void {
        this.log(pluginName, 'WARN', message, extraData);
    }

    /**
     * 记录普通信息
     * @param pluginName 插件名称
     * @param message 信息消息
     * @param extraData 额外数据
     */
    info(pluginName: string, message: string, extraData: Record<string, any> = {}): void {
        this.log(pluginName, 'INFO', message, extraData);
    }

    /**
     * 记录调试信息
     * @param pluginName 插件名称
     * @param message 调试消息
     * @param extraData 额外数据
     */
    debug(pluginName: string, message: string, extraData: Record<string, any> = {}): void {
        this.log(pluginName, 'DEBUG', message, extraData);
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
        this.storageQueue.forEach(item => this.report(item));
        this.clearStorageQueue();
    }

    /**
     * 实际执行上报逻辑
     * @param errorInfo 错误信息
     */
    private report(errorInfo: ErrorInfo): void {
        // 如果配置了自定义上传处理函数，则使用它
        if (this.config.uploadHandler) {
            try {
                this.config.uploadHandler(errorInfo);
            } catch (err) {
                console.error('[Frontend Monitor] Failed to send error report with custom handler:', err);
            }
        } else {
            // 如果没有配置上传方式，则输出到控制台
            console.log(`[Frontend Monitor] ${errorInfo.level.toUpperCase()}: ${errorInfo.message}`, errorInfo);
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
const monitor = new FrontendMonitor()
// 导出类型定义
export { ReportLevelEnum, monitor };
export type { MonitorConfig, ErrorInfo, MonitorPlugin };