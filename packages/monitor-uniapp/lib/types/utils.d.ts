import { UniSystemInfo } from "./type";
export declare function getTimestamp(): number;
export declare function formatTimestamp(format?: string, timestamp?: number): string;
export declare function getUniCurrentPages(index?: number): string;
export declare function getDeviceInfo(): Promise<UniSystemInfo>;
