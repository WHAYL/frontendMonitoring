import { LogCategoryValue } from "@whayl/monitor-core/types";

declare module 'koa' {
    interface Request {
        body?: any;
    }
}

export interface IReportInfo {
    id?: number;
    logCategory: LogCategoryValue;
    platform: string;
    plugin_name: string;
    message: string;
    page: string;
    timestamp: number;
    date: string;
    level: string;
    device_width: number;
    device_height: number;
    device_pixel_ratio: number;
    fingerprint: string;
    old_fingerprint: string;
    ip: string;
    created_at: Date;
    updated_at: Date;
    extraData: Record<string, any>;
}