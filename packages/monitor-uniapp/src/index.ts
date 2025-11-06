import { DeviceInfo, FrontendMonitor, LogCategoryKeyValue, LogData, MonitorConfig, ReportingLevel } from '@whayl/monitor-core';
import { ConsolePlugin } from './plugins/console';
import { ErrorPlugin } from './plugins/error';

import { getTimestamp, formatTimestamp, getDeviceInfo } from './utils';
import { UniAppLogData, UniAppMonitorBase, UniAppMonitorConfig, UniAppMonitorPlugin, PartialNavigator } from './type';
import { SetRequired } from 'aiy-utils';
export { monitorEventBus } from './eventBus';
/**
 * 浏览器监控类
 */
class UniAppMonitor implements UniAppMonitorBase {
    private plugins: UniAppMonitorPlugin[] = [];
    private monitor: FrontendMonitor = new FrontendMonitor();
    private abortController: AbortController | null = null;
    // 添加网络状态监听，离线时缓存日志，上线时自动上报
    private isOnline: boolean = navigator.onLine;
    private cacheLog: { type: ReportingLevel, data: SetRequired<UniAppLogData, 'deviceInfo' | 'navigator'> }[] = [];

    constructor(config: UniAppMonitorConfig) {
        // 缓存设备信息
        getDeviceInfo();

        // 默认配置都为 true
        const {
            consolePluginEnabled = true,
            errorPluginEnabled = true,
        } = config.pluginsUse || {};

        // 初始化核心监控
        this.monitor.init(config?.monitorConfig);

        // 根据配置动态注册插件
        const pluginsToRegister = [
            consolePluginEnabled && { name: 'ConsolePlugin', creator: () => new ConsolePlugin(config?.consolePluginConfig || {}) },
            errorPluginEnabled && { name: 'ErrorPlugin', creator: () => new ErrorPlugin() },
        ].filter(Boolean) as { name: string; creator: () => any }[];

        // 注册插件
        pluginsToRegister.forEach(plugin => {
            this.use(plugin.creator());
        });

        this.init();
        this.setupNetworkListener();
    }

    private init(): void {
        // 创建AbortController来管理所有事件监听器
        this.abortController = new AbortController();

    }
    reportAllLog(): void {
        this.reportCacheLog();
        this.monitor.reportRestInfo();
    }
    private reportCacheLog(): void {
        if (this.cacheLog.length) {
            this.cacheLog.forEach(item => {
                this.monitor.reportInfo(item.type, item.data);
            });
            this.cacheLog = [];
        }
    }
    private setupNetworkListener(): void {

    }
    setFingerprint(value: string) {
        this.monitor.setFingerprint(value);
    }
    getFingerprint(): string {
        return this.monitor.getFingerprint();
    }
    private async getNavigatorData(): Promise<PartialNavigator> {
        const getCatchDeviceInfo = await getDeviceInfo();
        return {
            userAgent: getCatchDeviceInfo.osName + '----' + getCatchDeviceInfo.ua + '----' + getCatchDeviceInfo.deviceType,
            platform: getCatchDeviceInfo.uniPlatform,
            language: getCatchDeviceInfo.appLanguage,
            onLine: true,
            cookieEnabled: true,
        };
    }
    private async getDeviceInfoData(): Promise<DeviceInfo> {
        const getCatchDeviceInfo = await getDeviceInfo();
        return {
            width: getCatchDeviceInfo.screenWidth,
            height: getCatchDeviceInfo.screenHeight,
            pixelRatio: getCatchDeviceInfo.devicePixelRatio,
        };
    }
    async reportInfo(type: ReportingLevel, data: UniAppLogData) {
        data.navigator = await this.getNavigatorData();
        const deviceInfo = await this.getDeviceInfoData();
        if (!this.isOnline) {
            // 如果当前处于离线状态，则缓存日志
            this.cacheLog.push({ type, data: { ...data, deviceInfo: deviceInfo, navigator: data.navigator } });
            return;
        }
        this.monitor.reportInfo(type, { ...data, deviceInfo: deviceInfo });
    }

    /**
     * 添加插件
     * @param plugin 监控插件
     */
    use(plugin: UniAppMonitorPlugin): void {
        // 检查插件是否包含必需的name属性
        if (!plugin.name) {
            console.error('Plugin must have a name property');
            return;
        }

        // 检查插件是否包含必需的init方法
        if (typeof plugin.init !== 'function') {
            console.error(`Plugin ${plugin.name} must have an init method`);
            return;
        }

        // 检查插件是否已存在
        const existingPlugin = this.plugins.find(p => p.name === plugin.name);
        if (existingPlugin) {
            console.warn(`Plugin ${plugin.name} already exists, skipping addition.`);
            return;
        }

        this.plugins.push(plugin);
        // 初始化插件
        plugin.init({ reportInfo: this.reportInfo.bind(this), getFingerprint: this.getFingerprint.bind(this) });
    }

    /**
     * 销毁监控实例
     */
    destroy(): void {
        // 使用abort controller一次性取消所有事件监听器
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }

        // 销毁所有插件
        this.plugins.forEach(plugin => {
            if (typeof plugin.destroy === 'function') {
                plugin.destroy();
            }
        });

        // 清空插件列表
        this.plugins = [];
    }
}

// 默认导出浏览器监控类
export default UniAppMonitor;