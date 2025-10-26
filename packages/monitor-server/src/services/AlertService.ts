import { AlertRuleModel } from '../database/models/AlertRule';
import { AlertRecordModel } from '../database/models/AlertRecord';
import { BaseAnalyticsService } from './analytics/BaseAnalytics';

/**
 * 告警服务
 */
export class AlertService {
  /**
   * 检查告警规则
   */
  static async checkAlertRules(): Promise<void> {
    try {
      // 获取所有启用的告警规则
      const rules = await AlertRuleModel.findActive();

      for (const rule of rules) {
        await AlertService.checkRule(rule);
      }
    } catch (error) {
      console.error('检查告警规则失败:', error);
    }
  }

  /**
   * 检查单个规则
   */
  static async checkRule(rule: any): Promise<void> {
    try {
      let shouldAlert = false;
      let alertValue = 0;

      switch (rule.ruleType) {
        case 'error_rate':
          {
            const errorStats = await BaseAnalyticsService.getOverallAnalytics(
              Date.now() - (rule.timeWindow || 0) * 1000,
              Date.now()
            );
            alertValue = errorStats.totalErrors;
            shouldAlert = alertValue >= (rule.thresholdValue || 0);
            break;
          }

        case 'performance':
          // 这里需要根据具体的性能指标来检查
          // 暂时跳过
          break;

        case 'user_behavior':
          // 这里需要根据用户行为指标来检查
          // 暂时跳过
          break;

        default:
          console.warn(`未知的告警类型: ${rule.ruleType}`);
          return;
      }

      if (shouldAlert) {
        await AlertService.createAlert(rule, alertValue);
      }
    } catch (error) {
      console.error(`检查规则 ${rule.id} 失败:`, error);
    }
  }

  /**
   * 创建告警记录
   */
  static async createAlert(rule: any, value: number): Promise<void> {
    try {
      // 检查是否已经存在未解决的相同告警
      const existingAlerts = await AlertRecordModel.findByRuleId(rule.id);
      const unresolvedAlert = existingAlerts.find(alert => !alert.isResolved);
      if (unresolvedAlert) {
        return; // 避免重复告警
      }

      const alertData = {
        ruleId: rule.id,
        alertType: rule.ruleType,
        severity: 'warning', // 默认严重性
        message: `告警触发: ${rule.description || rule.name}`,
        data: {
          value: value,
          threshold: rule.thresholdValue,
          ruleName: rule.name,
          timeWindow: rule.timeWindow
        },
        isResolved: false
      };

      await AlertRecordModel.create(alertData);
      console.log(`告警已创建: ${rule.name}`);
    } catch (error) {
      console.error('创建告警失败:', error);
    }
  }

  /**
   * 启动告警检查定时器
   */
  static startAlertChecker(intervalMs: number = 60000): void {
    setInterval(async () => {
      await AlertService.checkAlertRules();
    }, intervalMs);
  }
}