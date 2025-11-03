import { getTimestamp, formatTimestamp } from '../utils';
import type { AnalyticsExtraData, AnalyticsHistoryExtraData, AnalyticsPluginConfig, BrowserMonitorPlugin, BrowserMonitorPluginInitArg } from '../type';
import { LogCategoryKeyValue } from '@whayl/monitor-core';
import { monitorEventBus } from '../eventBus';

const DAILY_KEY_PREFIX = '__whayl_analytics_';

function safeJSONParse<T = any>(s: string | null, fallback: T): T {
    if (!s) { return fallback; }
    try {
        return JSON.parse(s) as T;
    } catch {
        return fallback;
    }
}

export class AnalyticsPlugin implements BrowserMonitorPlugin {
    name = 'analytics';
    private monitor: BrowserMonitorPluginInitArg | null = null;
    private abortController: AbortController | null = null;
    private config: AnalyticsPluginConfig;
    private ipCached: string | null = null;

    constructor(config: AnalyticsPluginConfig = {}) {
        this.config = config;
    }

    init(monitor: BrowserMonitorPluginInitArg): void {
        this.monitor = monitor;
        // 清理不属于今天的历史 localStorage 记录
        try {
            this.clearOldRecords();
        } catch (e) {
            // ignore
        }
        // 创建AbortController来管理所有事件监听器
        this.abortController = new AbortController();
        const { signal } = this.abortController;

        // 初始 PV: 每次页面加载或本次脚本执行计为一次 PV
        this.increasePV(window.location.href);

        // 初始 UV: 以浏览器指纹(fingerprint)或device为准，按日去重，使用 monitor.getFingerprint() 如果可用
        this.ensureUV(window.location.href);

        // 初始 VV: 访问次数，使用 sessionStorage 标记一次会话，session 结束后再次打开计为新 VV
        this.ensureVV();

        // IP: 如果提供 ipProvider，则获取并缓存到当天 key
        this.ensureIP();

        // 监听路由变化事件
        monitorEventBus.on("monitorRouteChange", this.handleRouteChange.bind(this));

        // 在页面隐藏或卸载时上报当前计数（可选）
        const onUnload = () => {
            this.reportNow();
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('pagehide', onUnload, { signal });
            window.addEventListener('beforeunload', onUnload, { signal });
            // visibilitychange 在切换 tab 时触发
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    this.reportNow();
                }
            }, { signal });
        }
    }

    private handleRouteChange(data: any) {
        // 当路由发生变化时增加 PV 和 UV
        this.increasePV(data.currentRoute);
        this.ensureUV(data.currentRoute);
    }

    private getTodayDate(): string {
        // 返回 YYYY/MM/DD
        // 使用 monitor 的 formatTimestamp，参数顺序为 (format, timestamp)
        return formatTimestamp('YYYY/MM/DD', getTimestamp());
    }

    private getTodayKey(suffix: string) {
        const date = this.getTodayDate();
        return `${DAILY_KEY_PREFIX}${date}_${suffix}`;
    }

    /**
     * 清除 localStorage 中以 DAILY_KEY_PREFIX 开头但不属于今天的记录
     */
    private clearOldRecords(): void {
        try {
            const todayPrefix = `${DAILY_KEY_PREFIX}${this.getTodayDate()}_`;
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!key) { continue; }
                if (key.startsWith(DAILY_KEY_PREFIX) && !key.startsWith(todayPrefix)) {
                    keysToRemove.push(key);
                }
            }
            // 如果有要移除的旧记录，先收集并上报一次，然后再删除
            if (keysToRemove.length > 0) {
                const oldRecords: Record<string, any> = {};

                // 分别收集旧的 PV 和 UV 数据
                const pvData: Record<string, number> = {};
                const uvData: Record<string, Record<string, number>> = {};
                let vvData = 0;
                let ipData = null;

                keysToRemove.forEach(k => {
                    try {
                        const raw = localStorage.getItem(k);
                        if (k.includes('_pv')) {
                            Object.assign(pvData, safeJSONParse(raw, {}));
                        } else if (k.includes('_uv')) {
                            Object.assign(uvData, safeJSONParse(raw, {}));
                        } else if (k.includes('_vv')) {
                            vvData = safeJSONParse(raw, 0);
                        } else if (k.includes('_ip_list')) {
                            ipData = safeJSONParse(raw, null);
                        }
                    } catch (e) {
                        // ignore per-key parse error
                    }
                });

                // 计算 UV 数量（与 reportNow 方法保持一致）
                const uvCount: Record<string, number> = {};
                Object.keys(uvData).forEach(route => {
                    uvCount[route] = Object.keys(uvData[route]).length;
                });

                oldRecords['pv'] = pvData;
                oldRecords['uv'] = uvCount;
                oldRecords['vv'] = vvData;
                oldRecords['ip'] = ipData;

                try {
                    if (this.monitor) {
                        this.monitor.reportInfo('INFO', {
                            logCategory: LogCategoryKeyValue.osView,
                            pluginName: this.name,
                            message: 'analytics_history_before_cleanup',
                            extraData: {
                                timestamp: getTimestamp(),
                                ...oldRecords,
                            },
                            url: window.location.href,
                            timestamp: getTimestamp(),
                            date: formatTimestamp()
                        });
                    }
                } catch (e) {
                    // ignore reporting errors
                }

                // 最后删除这些 key
                keysToRemove.forEach(k => localStorage.removeItem(k));
            }
        } catch (e) {
            // ignore
        }
    }

    private increasePV(route: string) {
        try {
            const key = this.getTodayKey('pv');
            const pvData = safeJSONParse<Record<string, number>>(localStorage.getItem(key), {});
            pvData[route] = (pvData[route] || 0) + 1;
            localStorage.setItem(key, JSON.stringify(pvData));
        } catch (e) {
            // ignore
        }
    }

    private ensureUV(route: string) {
        try {
            const key = this.getTodayKey('uv');
            // 使用 fingerprint 优先
            const fp = this.monitor ? this.monitor.getFingerprint() : '';
            const uvData = safeJSONParse<Record<string, Record<string, number>>>(localStorage.getItem(key), {});

            if (!uvData[route]) {
                uvData[route] = {};
            }

            const id = fp || this.getClientId();
            if (!uvData[route][id]) {
                uvData[route][id] = getTimestamp();
                localStorage.setItem(key, JSON.stringify(uvData));
            }
        } catch (e) {
            // ignore
        }
    }

    private ensureVV() {
        try {
            const sessionFlag = this.getTodayKey('vv_session');
            // sessionStorage 在一次浏览器标签页会话里是共享的，使用一个随机 id 标记本次标签页已计入 VV
            const has = sessionStorage.getItem(sessionFlag);
            if (!has) {
                // 无则本次 session 计为一次 VV
                const key = this.getTodayKey('vv');
                const cur = safeJSONParse<number>(localStorage.getItem(key), 0) as number;
                localStorage.setItem(key, JSON.stringify(cur + 1));
                sessionStorage.setItem(sessionFlag, String(getTimestamp()));
            }
        } catch (e) {
            // ignore
        }
    }

    private async ensureIP() {
        try {
            if (!this.config.ipProvider) { return; }
            const key = this.getTodayKey('ip_list');
            const cached = safeJSONParse<string | null>(localStorage.getItem(key), null);
            if (cached) {
                this.ipCached = cached;
                return;
            }
            const ip = await this.config.ipProvider();
            if (ip) {
                this.ipCached = ip;
                localStorage.setItem(key, JSON.stringify(ip));
            }
        } catch (e) {
            // ignore
        }
    }

    // 生成简单客户端 id（非强指纹），用于在无法获取 fingerprint 时作为 UV 去重依据
    private getClientId(): string {
        try {
            const key = '__whayl_client_id__';
            let id = localStorage.getItem(key);
            if (!id) {
                id = `${getTimestamp()}_${Math.random().toString(36).slice(2, 9)}`;
                localStorage.setItem(key, id);
            }
            return id;
        } catch (e) {
            return 'unknown_client';
        }
    }

    private reportNow() {
        try {
            if (!this.monitor) { return; }

            const pvKey = this.getTodayKey('pv');
            const uvKey = this.getTodayKey('uv');
            const vvKey = this.getTodayKey('vv');
            const ipKey = this.getTodayKey('ip_list');

            const pvData = safeJSONParse<Record<string, number>>(localStorage.getItem(pvKey), {});
            const uvData = safeJSONParse<Record<string, Record<string, number>>>(localStorage.getItem(uvKey), {});
            const vv = safeJSONParse<number>(localStorage.getItem(vvKey), 0) as number;
            const ip = safeJSONParse<string | null>(localStorage.getItem(ipKey), null);

            // 计算每个页面的 UV 数量
            const uvCount: Record<string, number> = {};
            Object.keys(uvData).forEach(route => {
                uvCount[route] = Object.keys(uvData[route]).length;
            });

            const payload: AnalyticsExtraData = {
                pv: pvData,
                uv: uvCount,
                vv,
                ip: ip || this.ipCached || null,
                timestamp: getTimestamp(),
            };

            // 使用 info 级别上报统计数据
            this.monitor.reportInfo('INFO', {
                logCategory: LogCategoryKeyValue.osView,
                pluginName: this.name,
                message: 'analytics_report',
                url: window.location.href,
                extraData: payload,
                timestamp: getTimestamp(),
                date: formatTimestamp()
            });
        } catch (e) {
            // ignore
        }
    }

    destroy(): void {
        this.monitor = null;
        // 使用abort controller一次性取消所有事件监听器
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
        // 移除路由监听
        monitorEventBus.off("monitorRouteChange", this.handleRouteChange.bind(this));
    }
}

export default AnalyticsPlugin;