import { AlertRecordModel } from '../../database/models/AlertRecord';
import { AlertRuleModel } from '../../database/models/AlertRule';

/**
 * 告警分析服务
 */
export class AlertAnalyticsService {
  /**
   * 获取告警分析数据
   */
  static async getAlertAnalytics(
    startDate?: number,
    endDate?: number
  ): Promise<any> {
    // 获取告警统计
    const alertStats = await AlertRecordModel.getAlertStats(startDate, endDate);

    // 获取告警趋势
    const alertTrend = await AlertRecordModel.getAlertTrend('hour', startDate, endDate);

    // 获取未解决的告警
    const unresolvedAlerts = await AlertRecordModel.findUnresolved();

    // 获取告警规则统计
    const ruleStats = await AlertRuleModel.getRuleStats();

    return {
      stats: alertStats,
      trend: alertTrend,
      unresolved: unresolvedAlerts,
      rules: ruleStats
    };
  }

  /**
   * 获取告警严重程度分析
   */
  static async getAlertSeverityAnalysis(
    startDate?: number,
    endDate?: number
  ): Promise<any> {
    const alerts = await AlertRecordModel.findAll({
      startDate,
      endDate,
      limit: 1000
    });

    const severityStats = {
      critical: alerts.filter(alert => alert.severity === 'critical').length,
      warning: alerts.filter(alert => alert.severity === 'warning').length,
      info: alerts.filter(alert => alert.severity === 'info').length
    };

    const alertTypes = alerts.reduce((acc: any, alert) => {
      acc[alert.alertType] = (acc[alert.alertType] || 0) + 1;
      return acc;
    }, {});

    return {
      severityStats,
      alertTypes,
      totalAlerts: alerts.length
    };
  }

  /**
   * 获取告警响应时间分析
   */
  static async getAlertResponseTimeAnalysis(
    startDate?: number,
    endDate?: number
  ): Promise<any> {
    const resolvedAlerts = await AlertRecordModel.findAll({
      startDate,
      endDate,
      isResolved: true,
      limit: 1000
    });

    const responseTimes = resolvedAlerts
      .filter(alert => alert.resolvedAt)
      .map(alert => {
        const created = new Date(alert.createdAt!).getTime();
        const resolved = new Date(alert.resolvedAt!).getTime();
        return resolved - created;
      });

    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;

    return {
      avgResponseTime,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      totalResolved: resolvedAlerts.length
    };
  }
}
