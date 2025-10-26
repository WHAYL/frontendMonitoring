import { db } from '../../database';

/**
 * 漏斗分析服务
 */
export class FunnelAnalyticsService {
  /**
   * 获取漏斗分析数据
   */
  static async getFunnelAnalytics(
    funnelSteps: string[],
    startDate?: number,
    endDate?: number
  ): Promise<any> {
    let whereClause = '';
    const params: any[] = [];

    if (startDate || endDate) {
      const conditions: string[] = [];
      if (startDate) {
        conditions.push('timestamp >= ?');
        params.push(startDate);
      }
      if (endDate) {
        conditions.push('timestamp <= ?');
        params.push(endDate);
      }
      whereClause = ` WHERE ${conditions.join(' AND ')}`;
    }

    const funnelData: Array<{
      step: string;
      users: number;
      events: number;
      conversionRate: number;
    }> = [];

    for (let i = 0; i < funnelSteps.length; i++) {
      const step = funnelSteps[i];
      const stepQuery = `
        SELECT 
          COUNT(DISTINCT fingerprint) as users,
          COUNT(*) as events
        FROM user_behaviors${whereClause}
        WHERE behavior_type = ?
      `;
      const stepStmt = db.prepare(stepQuery);
      const stepResult = stepStmt.get(...params, step) as any;

      funnelData.push({
        step,
        users: stepResult?.users || 0,
        events: stepResult?.events || 0,
        conversionRate: i === 0 ? 100 : 0 // 将在后续计算中更新
      });
    }

    // 计算转化率
    const firstStepUsers = funnelData[0]?.users || 1;
    funnelData.forEach((step, index) => {
      step.conversionRate = Math.round((step.users / firstStepUsers) * 100 * 100) / 100;
    });

    return {
      steps: funnelData,
      totalSteps: funnelSteps.length,
      overallConversion: funnelData[funnelData.length - 1]?.conversionRate || 0
    };
  }

  /**
   * 获取自定义漏斗分析
   */
  static async getCustomFunnelAnalytics(
    funnelConfig: {
      name: string;
      steps: Array<{
        name: string;
        conditions: string;
        timeWindow?: number;
      }>;
    },
    startDate?: number,
    endDate?: number
  ): Promise<any> {
    const results: Array<{
      step: string;
      users: number;
      events: number;
      conversionRate: number;
    }> = [];

    for (let i = 0; i < funnelConfig.steps.length; i++) {
      const step = funnelConfig.steps[i];
      let stepQuery = `
        SELECT 
          COUNT(DISTINCT fingerprint) as users,
          COUNT(*) as events
        FROM user_behaviors
        WHERE ${step.conditions}
      `;

      const params: any[] = [];
      if (startDate || endDate) {
        if (startDate) {
          stepQuery += ' AND timestamp >= ?';
          params.push(startDate);
        }
        if (endDate) {
          stepQuery += ' AND timestamp <= ?';
          params.push(endDate);
        }
      }

      if (step.timeWindow) {
        stepQuery += ' AND timestamp >= ?';
        params.push(Date.now() - step.timeWindow);
      }

      const stepStmt = db.prepare(stepQuery);
      const stepResult = stepStmt.get(...params) as any;

      results.push({
        step: step.name,
        users: stepResult?.users || 0,
        events: stepResult?.events || 0,
        conversionRate: i === 0 ? 100 : 0
      });
    }

    // 计算转化率
    const firstStepUsers = results[0]?.users || 1;
    results.forEach((step, index) => {
      step.conversionRate = Math.round((step.users / firstStepUsers) * 100 * 100) / 100;
    });

    return {
      funnelName: funnelConfig.name,
      steps: results,
      totalSteps: funnelConfig.steps.length,
      overallConversion: results[results.length - 1]?.conversionRate || 0
    };
  }
}
