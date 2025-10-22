import { MonitorPlugin } from '@whayl/monitor-core';
import type { FrontendMonitor } from '@whayl/monitor-core';
export interface ConsoleConfig {
    error?: boolean;
    warn?: boolean;
}

export class ConsolePlugin implements MonitorPlugin {
    name = 'console';
    private monitor: FrontendMonitor | null = null;
    private originalError: typeof console.error | null = null;
    private originalWarn: typeof console.warn | null = null;
    private config: ConsoleConfig;
    constructor(config: ConsoleConfig = { error: true, warn: true }) {
        this.name = 'console';
        this.config = config || { error: true, warn: true };
    }
    init(monitor: FrontendMonitor): void {
        this.monitor = monitor;
        this.setupConsoleCapture();
    }

    private setupConsoleCapture(): void {
        const self = this;
        try {
            if (this.config.error === false && this.config.warn === false) {
                return;
            }

            // 避免重复包装
            if (this.originalError || this.originalWarn) return;
            if (this.config.error === true) {
                this.originalError = console.error;
                console.error = function (...args: any[]) {
                    try {
                        const message = args.map(a => {
                            if (typeof a === 'string') return a;
                            try { return JSON.stringify(a); } catch { return String(a); }
                        }).join(' ');
                        const stack = (new Error()).stack;
                        self.monitor && self.monitor.error(self.name, message || 'console.error', { args, stack });
                    } catch (e) {
                        // 忽略上报自身的错误
                    }

                    // 保持原有行为
                    return self.originalError && self.originalError.apply(console, args);
                } as any;
            }
            if (this.config.warn === true) {
                this.originalWarn = console.warn;
                console.warn = function (...args: any[]) {
                    try {
                        const message = args.map(a => {
                            if (typeof a === 'string') return a;
                            try { return JSON.stringify(a); } catch { return String(a); }
                        }).join(' ');

                        const stack = (new Error()).stack;
                        self.monitor && self.monitor.warn(self.name, message || 'console.warn', { args, stack });
                    } catch (e) {
                        // 忽略
                    }

                    return self.originalWarn && self.originalWarn.apply(console, args);
                } as any;
            }



        } catch (e) {
            // ignore environments where console is not writable
        }
    }

    destroy(): void {
        try {
            if (this.originalError) {
                console.error = this.originalError;
                this.originalError = null;
            }
            if (this.originalWarn) {
                console.warn = this.originalWarn;
                this.originalWarn = null;
            }
        } catch (e) {
            // ignore
        }
        this.monitor = null;
    }
}
