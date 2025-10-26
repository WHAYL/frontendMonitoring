import { Context } from 'koa';
import { AlertRuleModel } from '../database/models/AlertRule';
import { AlertRecordModel } from '../database/models/AlertRecord';

/**
 * 告警控制器
 */
export class AlertController {
  /**
   * 创建告警规则
   */
  static async createAlertRule(ctx: Context) {
    try {
      const ruleData = ctx.request.body;
      const rule = await AlertRuleModel.create(ruleData);
      ctx.body = { success: true, data: rule };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '创建告警规则失败', error: (error as Error).message };
    }
  }

  /**
   * 获取告警规则列表
   */
  static async getAlertRules(ctx: Context) {
    try {
      const rules = await AlertRuleModel.findAll();
      ctx.body = { success: true, data: rules };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '获取告警规则失败', error: (error as Error).message };
    }
  }

  /**
   * 更新告警规则
   */
  static async updateAlertRule(ctx: Context) {
    try {
      const { id } = ctx.params;
      const updateData = ctx.request.body;
      const rule = await AlertRuleModel.update(parseInt(id), updateData);
      ctx.body = { success: true, data: rule };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '更新告警规则失败', error: (error as Error).message };
    }
  }

  /**
   * 删除告警规则
   */
  static async deleteAlertRule(ctx: Context) {
    try {
      const { id } = ctx.params;
      await AlertRuleModel.delete(parseInt(id));
      ctx.body = { success: true, message: '删除成功' };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '删除告警规则失败', error: (error as Error).message };
    }
  }

  /**
   * 获取告警记录
   */
  static async getAlertRecords(ctx: Context) {
    try {
      const {
        page = 1,
        limit = 20,
        startDate,
        endDate,
        severity,
        isResolved
      } = ctx.query;

      const records = await AlertRecordModel.findAll({
        limit: parseInt(limit as string),
        offset: (parseInt(page as string) - 1) * parseInt(limit as string),
        startDate: startDate ? parseInt(startDate as string) : undefined,
        endDate: endDate ? parseInt(endDate as string) : undefined,
        severity: severity as string,
        isResolved: isResolved ? isResolved === 'true' : undefined
      });

      ctx.body = { success: true, data: records };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '获取告警记录失败', error: (error as Error).message };
    }
  }

  /**
   * 解决告警
   */
  static async resolveAlert(ctx: Context) {
    try {
      const { id } = ctx.params;

      await AlertRecordModel.resolve(parseInt(id));
      const record = await AlertRecordModel.findById(parseInt(id));
      ctx.body = { success: true, data: record };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '解决告警失败', error: (error as Error).message };
    }
  }
}
