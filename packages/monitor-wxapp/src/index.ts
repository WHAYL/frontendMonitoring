import { DeviceInfo, FrontendMonitor, LogCategoryKeyValue, LogData, MonitorConfig, ReportingLevel } from '@whayl/monitor-core';
import { ConsolePlugin } from './plugins/console';
import { ErrorPlugin } from './plugins/error';
import { RouterPlugin } from './plugins/router';

import { getTimestamp, formatTimestamp, getDeviceInfo } from './utils';
import { WxAppLogData, WxAppMonitorBase, WxAppMonitorConfig, WxAppMonitorPlugin, PartialNavigator } from './type';
import { SetRequired } from 'aiy-utils';
import { WxAppEventBus, WxPageEventBus, UniCreatePageEventBus, wxAppMethods, wxPageMethods, UniCreatePageMethods, wxPageBindMethods, WxPageBindEventBus } from './eventBus';
import { RequestPlugin } from './plugins/request';
/**
 * wxapp监控类
 */
class WxAppMonitor implements WxAppMonitorBase {
    private plugins: WxAppMonitorPlugin[] = [];
    private monitor: FrontendMonitor = new FrontendMonitor();
    private config: WxAppMonitorConfig;

    // 添加网络状态监听，离线时缓存日志，上线时自动上报
    private isOnline: boolean = true;
    private cacheLog: { type: ReportingLevel, data: SetRequired<WxAppLogData, 'deviceInfo' | 'navigator'> }[] = [];

    constructor(config: WxAppMonitorConfig) {
        this.config = config;
        // 缓存设备信息
        getDeviceInfo();

        // 默认配置都为 true
        const {
            consolePluginEnabled = true,
            errorPluginEnabled = true,
            routerPluginEnabled = true,
            requestPluginEnabled = true,
        } = config.pluginsUse || {};

        // 初始化核心监控
        this.monitor.init(config?.monitorConfig);

        // 根据配置动态注册插件
        const pluginsToRegister = [
            consolePluginEnabled && { name: 'ConsolePlugin', creator: () => new ConsolePlugin(config?.consolePluginConfig || {}) },
            errorPluginEnabled && { name: 'ErrorPlugin', creator: () => new ErrorPlugin() },
            routerPluginEnabled && { name: 'RouterPlugin', creator: () => new RouterPlugin() },
            requestPluginEnabled && { name: 'RequestPlugin', creator: () => new RequestPlugin() },
        ].filter(Boolean) as { name: string; creator: () => any }[];

        // 注册插件
        pluginsToRegister.forEach(plugin => {
            this.use(plugin.creator());
        });

        this.init();
        this.setupNetworkListener();
    }

    private init(): void {
        this.rewriteWxApp();
        this.wxPage();
        this.wxComponent();
        this.uniWxCreatePage();
    }
    /** 拦截 uniapp wx.createPage */
    private uniWxCreatePage() {
        try {
            if (!wx) {
                return;
            }
            const wxC = wx.createPage;
            const that = this;
            wx.createPage = function (options) {
                UniCreatePageMethods.forEach(methodName => {
                    const userDefinedMethod = options[methodName]; // 暂存用户定义的方法
                    options[methodName] = function (options) {
                        UniCreatePageEventBus.emit(methodName, options);
                        return userDefinedMethod && userDefinedMethod.call(this, options);
                    };
                });
                if (options.methods) {
                    Object.keys(options.methods).forEach(key => {
                        if (typeof options.methods[key] === 'function' && !UniCreatePageMethods.includes(key as any)) {
                            const userDefinedMethod = options.methods[key]; // 暂存用户定义的方法
                            options.methods[key] = function (...args) {
                                const detail = args[args.length - 1] || args?.[0];//uniapp 事件方法传参 最后或者第一个参数是事件对象$event
                                if (wxPageBindMethods.includes(detail?.type)) {
                                    WxPageBindEventBus.emit(detail.type, {
                                        methods: key,
                                        detail
                                    });
                                }
                                return userDefinedMethod && userDefinedMethod.call(this, ...args);
                            };
                        }
                    });
                }
                return wxC(options);
            };
        } catch (error) {
        }
    }
    /** 拦截 微信 Component */
    private wxComponent() {
        try {
            if (!Component) {
                return;
            }
            const originComponent = Component;
            Component = function (options) {
                // 拦截组件方法
                if (options.methods) {
                    Object.keys(options.methods).forEach(key => {
                        if (typeof options.methods[key] === 'function') {
                            const userDefinedMethod = options.methods[key]; // 暂存用户定义的方法
                            options.methods[key] = function (...args) {
                                const detail = args[args.length - 1] || args?.[0];
                                if (wxPageBindMethods.includes(detail?.type)) {
                                    WxPageBindEventBus.emit(detail.type, {
                                        methods: key,
                                        detail
                                    });
                                }
                                return userDefinedMethod && userDefinedMethod.call(this, ...args);
                            };
                        }
                    });
                }
                return originComponent(options);
            };
        } catch (error) {

        }
    }
    /** 拦截 微信 Page */
    private wxPage() {
        try {
            if (!Page) {
                return;
            }
            const originPage = Page;
            const that = this;
            Page = function (prams) {
                // 合并方法，插入记录脚本
                [...wxPageMethods].forEach((methodName) => {
                    const userDefinedMethod = prams[methodName]; // 暂存用户定义的方法
                    prams[methodName] = function (options) {
                        WxPageEventBus.emit(methodName, options);
                        return userDefinedMethod && userDefinedMethod.call(this, options);
                    };
                });
                Object.keys(prams).forEach(key => {
                    if (typeof prams[key] === 'function' && !wxPageMethods.includes(key as any)) {
                        const userDefinedMethod = prams[key]; // 暂存用户定义的方法
                        prams[key] = function (options) {
                            const type = options?.type;
                            if (wxPageBindMethods.includes(type)) {
                                WxPageBindEventBus.emit(type, { methods: key, detail: options });
                            }
                            return userDefinedMethod && userDefinedMethod.call(this, options);
                        };
                    }
                });
                return originPage(prams);
            };
        } catch (error) {

        }
    }
    /** 拦截 微信 App */
    private rewriteWxApp() {
        try {
            if (!App) {
                return;
            }
            const originApp = App;
            const that = this;
            App = function (app) {
                // 合并方法，插入记录脚本
                wxAppMethods.forEach((methodName) => {
                    const userDefinedMethod = app[methodName]; // 暂存用户定义的方法
                    app[methodName] = function (options) {
                        WxAppEventBus.emit(methodName, options);
                        return userDefinedMethod && userDefinedMethod.call(this, options);
                    };
                });
                return originApp(app);
            };
        } catch (error) {

        }

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
            userAgent: getCatchDeviceInfo.system + '----' + getCatchDeviceInfo.brand + '----' + getCatchDeviceInfo.model + '----' + getCatchDeviceInfo.version,
            platform: getCatchDeviceInfo.platform,
            language: getCatchDeviceInfo.language,
            onLine: true,
            cookieEnabled: true,
        };
    }
    private async getDeviceInfoData(): Promise<DeviceInfo> {
        const getCatchDeviceInfo = await getDeviceInfo();
        return {
            width: getCatchDeviceInfo.screenWidth,
            height: getCatchDeviceInfo.screenHeight,
            pixelRatio: getCatchDeviceInfo.pixelRatio,
        };
    }
    async reportInfo(type: ReportingLevel, data: WxAppLogData) {
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
    use(plugin: WxAppMonitorPlugin): void {
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
export default WxAppMonitor;