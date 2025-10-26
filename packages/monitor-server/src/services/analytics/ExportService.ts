import { BaseAnalyticsService } from './BaseAnalytics';
import { UserAnalyticsService } from './UserAnalytics';
import { PerformanceAnalyticsService } from './PerformanceAnalytics';
import { DeviceAnalyticsService } from './DeviceAnalytics';
import { AlertAnalyticsService } from './AlertAnalytics';
import { UserSessionModel } from '../../database/models/UserSession';
import { PageVisitModel } from '../../database/models/PageVisit';
import { UserBehaviorModel } from '../../database/models/UserBehavior';
import { NetworkRequestModel } from '../../database/models/NetworkRequest';

/**
 * 数据导出服务
 */
export class ExportService {
  /**
   * 导出分析数据
   */
  static async exportAnalyticsData(
    dataType: string,
    format: string = 'json',
    startDate?: number,
    endDate?: number
  ): Promise<any> {
    let data: any = {};

    switch (dataType) {
      case 'errors':
        data = await BaseAnalyticsService.getOverallAnalytics(startDate, endDate);
        break;
      case 'sessions':
        data = await UserSessionModel.getSessionStats(startDate, endDate);
        break;
      case 'pages':
        data = await PageVisitModel.getPageStats(startDate, endDate);
        break;
      case 'behaviors':
        data = await UserBehaviorModel.getBehaviorStats(startDate, endDate);
        break;
      case 'network':
        data = await NetworkRequestModel.getNetworkStats(startDate, endDate);
        break;
      case 'performance':
        data = await PerformanceAnalyticsService.getPerformanceAnalytics(startDate, endDate);
        break;
      case 'alerts':
        data = await AlertAnalyticsService.getAlertAnalytics(startDate, endDate);
        break;
      case 'users':
        data = await UserAnalyticsService.getUserAnalytics(startDate, endDate);
        break;
      case 'devices':
        data = await DeviceAnalyticsService.getDeviceAnalytics(startDate, endDate);
        break;
      default:
        throw new Error(`Unsupported data type: ${dataType}`);
    }

    if (format === 'csv') {
      return this.convertToCSV(data);
    }

    return data;
  }

  /**
   * 导出完整报告
   */
  static async exportFullReport(
    startDate?: number,
    endDate?: number
  ): Promise<any> {
    const [
      errors,
      users,
      performance,
      devices,
      alerts
    ] = await Promise.all([
      BaseAnalyticsService.getOverallAnalytics(startDate, endDate),
      UserAnalyticsService.getUserAnalytics(startDate, endDate),
      PerformanceAnalyticsService.getPerformanceAnalytics(startDate, endDate),
      DeviceAnalyticsService.getDeviceAnalytics(startDate, endDate),
      AlertAnalyticsService.getAlertAnalytics(startDate, endDate)
    ]);

    return {
      reportInfo: {
        generatedAt: new Date().toISOString(),
        timeRange: {
          start: startDate ? new Date(startDate).toISOString() : null,
          end: endDate ? new Date(endDate).toISOString() : null
        }
      },
      summary: {
        totalErrors: errors.totalErrors,
        totalUsers: users.sessions?.unique_users || 0,
        totalSessions: users.sessions?.total_sessions || 0,
        totalPageViews: users.pages?.total_visits || 0,
        totalAlerts: alerts.stats?.total_alerts || 0
      },
      errors,
      users,
      performance,
      devices,
      alerts
    };
  }

  /**
   * 将数据转换为CSV格式
   */
  private static convertToCSV(data: any): string {
    if (Array.isArray(data)) {
      if (data.length === 0) {return '';}

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
          const value = row[header] || '';
          // 处理包含逗号的值
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value;
        }).join(','))
      ].join('\n');

      return csvContent;
    }

    // 对于非数组数据，转换为JSON字符串
    return JSON.stringify(data, null, 2);
  }

  /**
   * 导出用户行为数据
   */
  static async exportUserBehaviorData(
    fingerprint: string,
    startDate?: number,
    endDate?: number
  ): Promise<any> {
    const behaviorFlow = await UserAnalyticsService.getUserBehaviorFlow(fingerprint, startDate, endDate);

    return {
      user: fingerprint,
      exportTime: new Date().toISOString(),
      timeRange: {
        start: startDate ? new Date(startDate).toISOString() : null,
        end: endDate ? new Date(endDate).toISOString() : null
      },
      ...behaviorFlow
    };
  }
}
