import type { FrontendMonitor } from "./monitor";

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
export interface ErrorInfo {
  // 错误等级
  level: ReportingLevel;

  // 错误消息
  message: string;

  // 错误堆栈
  stack?: string;

  // 发生时间
  timestamp: number;

  // 页面URL
  url: string;

  // 插件名称
  pluginName?: string;

  // 唯一指纹
  fingerprint?: string;

  // 用户浏览器信息
  userAgent?: string;

  // 其他附加信息
  [key: string]: any;
}

// 插件接口
export interface MonitorPlugin {
  // 插件名称
  name: string;

  // 插件初始化方法
  init: (monitor: FrontendMonitor) => void;

  // 插件销毁方法
  destroy?: () => void;
}

export interface LogData {
  pluginName: string;
  message: string;
  url: string;
  extraData: Record<string, any>;
  timestamp: number;
  date: string;
}