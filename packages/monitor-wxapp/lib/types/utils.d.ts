import { WxSystemInfo } from "./type";
export declare function getTimestamp(): number;
export declare function formatTimestamp(format?: string, timestamp?: number): string;
export declare function getQueryString(options?: Record<string, any>): string;
export declare function arrayAt<T>(arr: T[], index: number): T | undefined;
export declare function getWxCurrentPages(data?: {
    index?: number;
}): {
    pages: WxPage[];
    page: string;
};
export declare function getDeviceInfo(): Promise<WxSystemInfo>;
