import { ErrorInfoModel } from '../database/models/ErrorInfo';
import { Types } from 'mongoose';

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
  const timeFilter: any = {};
  if (startDate || endDate) {
    timeFilter.timestamp = {};
    if (startDate) {timeFilter.timestamp.$gte = startDate;}
    if (endDate) {timeFilter.timestamp.$lte = endDate;}
  }

  // 并行执行所有聚合查询
  const [levelStats, topErrors, topPlugins, errorsByTime] = await Promise.all([
    // 按级别统计
    ErrorInfoModel.aggregate([
      { $match: timeFilter },
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      }
    ]),

    // Top 错误信息
    ErrorInfoModel.aggregate([
      { $match: { ...timeFilter, level: 'ERROR' } },
      {
        $group: {
          _id: '$message',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),

    // Top 插件
    ErrorInfoModel.aggregate([
      { $match: timeFilter },
      {
        $group: {
          _id: '$pluginName',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),

    // 按时间分布
    ErrorInfoModel.aggregate([
      { $match: timeFilter },
      {
        $project: {
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: { $toDate: '$timestamp' }
            }
          }
        }
      },
      {
        $group: {
          _id: '$date',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
  ]);

  // 处理结果
  const result: AnalyticsResult = {
    totalErrors: 0,
    totalWarnings: 0,
    totalInfos: 0,
    topErrors: topErrors.map(item => ({
      message: item._id,
      count: item.count
    })),
    topPlugins: topPlugins.map(item => ({
      pluginName: item._id,
      count: item.count
    })),
    errorsByTime: errorsByTime.map(item => ({
      date: item._id,
      count: item.count
    }))
  };

  // 设置各级别统计
  levelStats.forEach(stat => {
    switch (stat._id) {
      case 'ERROR':
        result.totalErrors = stat.count;
        break;
      case 'WARN':
        result.totalWarnings = stat.count;
        break;
      case 'INFO':
        result.totalInfos = stat.count;
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
  const timeFilter: any = { pluginName };
  if (startDate || endDate) {
    timeFilter.timestamp = {};
    if (startDate) {timeFilter.timestamp.$gte = startDate;}
    if (endDate) {timeFilter.timestamp.$lte = endDate;}
  }

  const [levelStats, recentErrors] = await Promise.all([
    // 按级别统计
    ErrorInfoModel.aggregate([
      { $match: timeFilter },
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      }
    ]),

    // 最近的错误
    ErrorInfoModel.find({ ...timeFilter })
      .sort({ timestamp: -1 })
      .limit(20)
  ]);

  const result: any = {
    pluginName,
    total: 0,
    levels: {},
    recentErrors: recentErrors.map((err: any) => ({
      message: err.message,
      level: err.level,
      timestamp: err.timestamp,
      date: err.date
    }))
  };

  levelStats.forEach(stat => {
    result.levels[stat._id] = stat.count;
    result.total += stat.count;
  });

  return result;
};