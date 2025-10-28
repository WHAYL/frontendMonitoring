import type { FrontendMonitor } from "./monitor";
import { type EnumValuesForKey, createEnumFromArray } from 'aiy-utils';
const LogCategory = [
  { label: '其他', key: 'oth', value: 0 },
  { label: '页面生命周期', key: 'pageLifecycle', value: 1 },
  { label: 'js错误，未处理的Promise，console.error', key: 'error', value: 2 },
  { label: 'xhr,fetch请求信息', key: 'xhrFetch', value: 3 },
  { label: '页面性能相关数据', key: 'pagePerformance', value: 4 },
  { label: '系统相关访问数据', key: 'osView', value: 5 },
  { label: '资源加载信息', key: 'resource', value: 6 },
  { label: '用户行为', key: 'userBehavior', value: 7 },
] as const;
export type LogCategoryValue = EnumValuesForKey<typeof LogCategory, 'value'>
export const LogCategoryKeyValue = createEnumFromArray(LogCategory, 'key', 'value');
// 上报等级枚举，数值越大等级越低
export enum ReportLevelEnum {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  OFF = 4
}

// 兼容原有的类型定义
export type ReportingLevel = keyof typeof ReportLevelEnum;

// 监控配置接口
export interface MonitorConfig {

  // 平台名称，如web, uniapp等
  platform: string,

  // 上报等级阈值，只有等于或高于此等级的信息才会被立即上报
  reportLevel: ReportingLevel;

  // 是否启用监控
  enabled: boolean;

  // 自定义上传处理函数
  uploadHandler: null | ((data: ErrorInfo | ErrorInfo[]) => void);

  // 本地存储最大数量，默认为100
  maxStorageCount?: number;

  // 浏览器指纹
  fingerprint?: string

  // 其他可能的配置项...
}

// 错误信息接口

export interface DeviceInfo {
  width: number;
  height: number;
  pixelRatio: number;
}
export interface LogData {
  logCategory: LogCategoryValue;
  pluginName: string;
  message: string;
  url: string;
  extraData: Record<string, any>;
  timestamp: number;
  date: string;
  deviceInfo: DeviceInfo;
}

export interface ErrorInfo extends LogData {
  // 错误等级
  level: ReportingLevel;

  // 错误消息
  message: string;

  // 错误堆栈
  stack?: string;

  // 唯一指纹
  fingerprint: string;

  oldFingerprint: string;

  platform: string;

  // 其他附加信息
  [key: string]: any;
}