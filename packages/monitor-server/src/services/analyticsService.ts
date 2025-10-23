import { db } from '../database';
import { IErrorInfo } from '../database/models/ErrorInfo';

interface AnalyticsResult {
  totalErrors: number;
  totalWarnings: number;
  totalInfos: number;
  topErrors: Array<{
    message: string;
    count: number;
  }>;
  topPlugins: Array<{
    pluginName: string;
    count: number;
  }>;
  errorsByTime: Array<{
    date: string;
    count: number;
  }>;
}

/**
 * 获取整体分析数据
 * @param startDate 开始时间戳
 * @param endDate 结束时间戳
 */
export const getOverallAnalytics = async (
  startDate?: number,
  endDate?: number
): Promise<AnalyticsResult> => {
  // 构建时间过滤条件
  let baseQuery = 'SELECT * FROM error_info';
  let countQuery = 'SELECT level, COUNT(*) as count FROM error_info';
  let topErrorsQuery = 'SELECT message, COUNT(*) as count FROM error_info WHERE level = \'ERROR\'';
  let topPluginsQuery = 'SELECT plugin_name, COUNT(*) as count FROM error_info';
  let errorsByTimeQuery = 'SELECT DATE(datetime(timestamp/1000, \'unixepoch\')) as dateStr, COUNT(*) as count FROM error_info';

  const params: any[] = [];
  const countParams: any[] = [];
  const topErrorsParams: any[] = [];
  const topPluginsParams: any[] = [];
  const errorsByTimeParams: any[] = [];

  if (startDate || endDate) {
    const conditions: string[] = [];
    if (startDate) {
      conditions.push('timestamp >= ?');
      params.push(startDate);
      countParams.push(startDate);
      topErrorsParams.push(startDate);
      topPluginsParams.push(startDate);
      errorsByTimeParams.push(startDate);
    }
    if (endDate) {
      conditions.push('timestamp <= ?');
      params.push(endDate);
      countParams.push(endDate);
      topErrorsParams.push(endDate);
      topPluginsParams.push(endDate);
      errorsByTimeParams.push(endDate);
    }

    const whereClause = ` WHERE ${conditions.join(' AND ')}`;
    baseQuery += whereClause;
    countQuery += whereClause;
    topErrorsQuery += whereClause;
    topPluginsQuery += whereClause;
    errorsByTimeQuery += whereClause;
  }

  // 按级别统计
  countQuery += ' GROUP BY level';
  const levelStatsStmt = db.prepare(countQuery);
  const levelStats = levelStatsStmt.all(...countParams);

  // Top 错误信息
  topErrorsQuery += ' GROUP BY message ORDER BY COUNT(*) DESC LIMIT 10';
  const topErrorsStmt = db.prepare(topErrorsQuery);
  const topErrors = topErrorsStmt.all(...topErrorsParams);

  // Top 插件
  topPluginsQuery += ' GROUP BY plugin_name ORDER BY COUNT(*) DESC LIMIT 10';
  const topPluginsStmt = db.prepare(topPluginsQuery);
  const topPlugins = topPluginsStmt.all(...topPluginsParams);

  // 按时间分布
  errorsByTimeQuery += ' GROUP BY DATE(datetime(timestamp/1000, \'unixepoch\')) ORDER BY DATE(datetime(timestamp/1000, \'unixepoch\')) ASC';
  const errorsByTimeStmt = db.prepare(errorsByTimeQuery);
  const errorsByTime = errorsByTimeStmt.all(...errorsByTimeParams);

  // 处理结果
  const result: AnalyticsResult = {
    totalErrors: 0,
    totalWarnings: 0,
    totalInfos: 0,
    topErrors: (topErrors as any).map((item: any) => ({
      message: item.message,
      count: item.count
    })),
    topPlugins: (topPlugins as any).map((item: any) => ({
      pluginName: item.plugin_name,
      count: item.count
    })),
    errorsByTime: (errorsByTime as any).map((item: any) => ({
      date: item.dateStr,
      count: item.count
    }))
  };

  // 设置各级别统计
  (levelStats as any).forEach((stat: any) => {
    const count = stat.count;
    switch (stat.level) {
      case 'ERROR':
        result.totalErrors = count;
        break;
      case 'WARN':
        result.totalWarnings = count;
        break;
      case 'INFO':
        result.totalInfos = count;
        break;
    }
  });

  return result;
};

/**
 * 获取特定插件的分析数据
 * @param pluginName 插件名称
 * @param startDate 开始时间戳
 * @param endDate 结束时间戳
 */
export const getPluginAnalytics = async (
  pluginName: string,
  startDate?: number,
  endDate?: number
) => {
  let baseQuery = 'SELECT * FROM error_info WHERE plugin_name = ?';
  let countQuery = 'SELECT level, COUNT(*) as count FROM error_info WHERE plugin_name = ?';
  let recentQuery = 'SELECT * FROM error_info WHERE plugin_name = ?';
  const params: any[] = [pluginName];
  const countParams: any[] = [pluginName];
  const recentParams: any[] = [pluginName];

  if (startDate || endDate) {
    const conditions: string[] = [];
    if (startDate) {
      conditions.push('timestamp >= ?');
      params.push(startDate);
      countParams.push(startDate);
      recentParams.push(startDate);
    }
    if (endDate) {
      conditions.push('timestamp <= ?');
      params.push(endDate);
      countParams.push(endDate);
      recentParams.push(endDate);
    }

    const whereClause = ` AND ${conditions.join(' AND ')}`;
    baseQuery += whereClause;
    countQuery += whereClause;
    recentQuery += whereClause;
  }

  // 按级别统计
  countQuery += ' GROUP BY level';
  const levelStatsStmt = db.prepare(countQuery);
  const levelStats = levelStatsStmt.all(...countParams);

  // 最近的错误
  recentQuery += ' ORDER BY timestamp DESC LIMIT 20';
  const recentErrorsStmt = db.prepare(recentQuery);
  const recentErrors = recentErrorsStmt.all(...recentParams);

  const result: any = {
    pluginName,
    total: 0,
    levels: {} as Record<string, number>,
    recentErrors: (recentErrors as IErrorInfo[]).map((err: any) => ({
      message: err.message,
      level: err.level,
      timestamp: err.timestamp,
      date: err.date
    }))
  };

  (levelStats as any).forEach((stat: any) => {
    const count = stat.count;
    result.levels[stat.level] = count;
    result.total += count;
  });

  return result;
};