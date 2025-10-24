import type { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
import { monitor } from '@whayl/monitor-core';

export interface AnalyticsPluginConfig {
    // 可选获取公网 IP 的异步函数（例如调用第三方服务），返回 IP 字符串
    ipProvider?: () => Promise<string | null>;
}

const DAILY_KEY_PREFIX = '__whayl_analytics_';

function safeJSONParse<T = any>(s: string | null, fallback: T): T {
    if (!s) { return fallback; }
    try {
        return JSON.parse(s) as T;
    } catch {
        return fallback;
    }
}

export class AnalyticsPlugin implements MonitorPlugin {
    name = 'analytics';
    private monitor: FrontendMonitor | null = null;
    private abortController: AbortController | null = null;
    private config: AnalyticsPluginConfig;
    private ipCached: string | null = null;

    constructor(config: AnalyticsPluginConfig = {}) {
        this.config = config;
    }

    init(monitor: FrontendMonitor): void {
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

        // PV: 每次页面加载或本次脚本执行计为一次 PV
        this.increasePV();

        // UV: 以浏览器指纹(fingerprint)或device为准，按日去重，使用 monitor.getFingerprint() 如果可用
        this.ensureUV();

        // VV: 访问次数，使用 sessionStorage 标记一次会话，session 结束后再次打开计为新 VV
        this.ensureVV();

        // IP: 如果提供 ipProvider，则获取并缓存到当天 key
        this.ensureIP();

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
    private getTodayDate(): string {
        // 返回 YYYY/MM/DD
        if (this.monitor) {
            // 使用 monitor 的 formatTimestamp，参数顺序为 (format, timestamp)
            return this.monitor.formatTimestamp('YYYY/MM/DD', this.monitor.getTimestamp());
        }
        return new Date().toISOString().slice(0, 10).replace(/-/g, '/');
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
                keysToRemove.forEach(k => {
                    try {
                        const raw = localStorage.getItem(k);
                        // 解析 JSON 或保留原始字符串
                        oldRecords[k] = safeJSONParse(raw, raw);
                    } catch (e) {
                        // ignore per-key parse error
                        oldRecords[k] = null;
                    }
                });

                try {
                    if (this.monitor) {
                        this.monitor.info(this.name, 'analytics_history_before_cleanup', {
                            reportedAt: this.monitor.getTimestamp(),
                            items: oldRecords,
                        }, window.location.href);
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

    private increasePV() {
        try {
            const key = this.getTodayKey('pv');
            const cur = safeJSONParse<number>(localStorage.getItem(key), 0) as number;
            localStorage.setItem(key, JSON.stringify(cur + 1));
        } catch (e) {
            // ignore
        }
    }

    private ensureUV() {
        try {
            const key = this.getTodayKey('uv');
            // 使用 fingerprint 优先
            const fp = this.monitor ? this.monitor.getFingerprint() : '';
            const uvSet = safeJSONParse<Record<string, number>>(localStorage.getItem(key), {});
            const id = fp || this.getClientId();
            if (!uvSet[id]) {
                uvSet[id] = this.monitor?.getTimestamp() || Date.now();
                localStorage.setItem(key, JSON.stringify(uvSet));
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
                sessionStorage.setItem(sessionFlag, String(this.monitor?.getTimestamp() || Date.now()));
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
                id = `${this.monitor?.getTimestamp() || Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
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

            const pv = safeJSONParse<number>(localStorage.getItem(pvKey), 0) as number;
            const uvObj = safeJSONParse<Record<string, number>>(localStorage.getItem(uvKey), {});
            const vv = safeJSONParse<number>(localStorage.getItem(vvKey), 0) as number;
            const ip = safeJSONParse<string | null>(localStorage.getItem(ipKey), null);

            const uv = Object.keys(uvObj).length;

            const payload = {
                pv,
                uv,
                vv,
                ip: ip || this.ipCached || null,
                timestamp: this.monitor.getTimestamp(),
            };

            // 使用 info 级别上报统计数据
            this.monitor.info(this.name, 'analytics_report', payload, window.location.href);
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
    }
}

export default AnalyticsPlugin;
