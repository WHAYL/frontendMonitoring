export interface MonitorData {
  level: string;
  message: string;
  stack?: string;
  timestamp: number;
  date: string;
  url: string;
  userId?: string;
  pluginName?: string;
  fingerprint?: string;
  userAgent?: string;
  devicePixelRatio?: number;
  extraData?: Record<string, any>;
}

export interface AnalyticsQuery {
  startDate?: number;
  endDate?: number;
  pluginName?: string;
  level?: string;
  limit?: number;
}