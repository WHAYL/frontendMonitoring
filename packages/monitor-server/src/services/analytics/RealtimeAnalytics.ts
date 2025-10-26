import { UserSessionModel } from '../../database/models/UserSession';
import { PageVisitModel } from '../../database/models/PageVisit';
import { UserBehaviorModel } from '../../database/models/UserBehavior';
import { NetworkRequestModel } from '../../database/models/NetworkRequest';
import { getOverallAnalytics } from './BaseAnalytics';

/**
 * 实时分析服务
 */
export class RealtimeAnalyticsService {
  /**
   * 获取实时分析数据
   */
  static async getRealtimeData(): Promise<any> {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    // 获取最近1小时的活跃会话
    const activeSessions = await UserSessionModel.getActiveSessions();

    // 获取最近1小时的错误统计
    const recentErrors = await getOverallAnalytics(oneHourAgo, now);

    // 获取最近1小时的性能数据
    const performanceStats = await PageVisitModel.getPerformanceAnalysis(oneHourAgo, now);

    // 获取最近1小时的网络请求统计
    const networkStats = await NetworkRequestModel.getNetworkStats(oneHourAgo, now);

    // 获取最近1小时的用户行为统计
    const behaviorStats = await UserBehaviorModel.getBehaviorStats(oneHourAgo, now);

    return {
      timestamp: now,
      activeSessions: activeSessions.length,
      recentErrors,
      performance: performanceStats,
      network: networkStats,
      behaviors: behaviorStats,
      timeRange: {
        start: oneHourAgo,
        end: now
      }
    };
  }
}
