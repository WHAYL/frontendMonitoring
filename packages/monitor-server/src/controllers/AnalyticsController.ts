import { Context } from 'koa';
import {
  getRealtimeAnalytics,
  getUserAnalytics,
  getUserBehaviorFlow,
  getPerformanceAnalytics,
  getDeviceAnalytics,
  getFunnelAnalytics,
  getRetentionAnalytics,
  getAlertAnalytics,
  exportAnalyticsData
} from '../services/analytics';

/**
 * 分析控制器
 */
export class AnalyticsController {
  /**
   * 获取实时数据
   */
  static async getRealtimeData(ctx: Context) {
    try {
      const data = await getRealtimeAnalytics();
      ctx.body = { success: true, data };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '获取实时数据失败', error: (error as Error).message };
    }
  }

  /**
   * 获取用户分析数据
   */
  static async getUserAnalyticsData(ctx: Context) {
    try {
      const { startDate, endDate } = ctx.query;
      const data = await getUserAnalytics(
        startDate ? parseInt(startDate as string) : undefined,
        endDate ? parseInt(endDate as string) : undefined
      );
      ctx.body = { success: true, data };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '获取用户分析数据失败', error: (error as Error).message };
    }
  }

  /**
   * 获取性能数据
   */
  static async getPerformanceData(ctx: Context) {
    try {
      const { startDate, endDate } = ctx.query;
      const data = await getPerformanceAnalytics(
        startDate ? parseInt(startDate as string) : undefined,
        endDate ? parseInt(endDate as string) : undefined
      );
      ctx.body = { success: true, data };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '获取性能数据失败', error: (error as Error).message };
    }
  }

  /**
   * 获取设备数据
   */
  static async getDeviceData(ctx: Context) {
    try {
      const { startDate, endDate } = ctx.query;
      const data = await getDeviceAnalytics(
        startDate ? parseInt(startDate as string) : undefined,
        endDate ? parseInt(endDate as string) : undefined
      );
      ctx.body = { success: true, data };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '获取设备数据失败', error: (error as Error).message };
    }
  }

  /**
   * 获取告警数据
   */
  static async getAlertData(ctx: Context) {
    try {
      const { startDate, endDate } = ctx.query;
      const data = await getAlertAnalytics(
        startDate ? parseInt(startDate as string) : undefined,
        endDate ? parseInt(endDate as string) : undefined
      );
      ctx.body = { success: true, data };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '获取告警数据失败', error: (error as Error).message };
    }
  }

  /**
   * 获取漏斗数据
   */
  static async getFunnelData(ctx: Context) {
    try {
      const { steps, startDate, endDate } = ctx.query;
      if (!steps) {
        ctx.status = 400;
        ctx.body = { success: false, message: '缺少步骤参数' };
        return;
      }

      const funnelSteps = (steps as string).split(',');
      const data = await getFunnelAnalytics(
        funnelSteps,
        startDate ? parseInt(startDate as string) : undefined,
        endDate ? parseInt(endDate as string) : undefined
      );
      ctx.body = { success: true, data };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '获取漏斗数据失败', error: (error as Error).message };
    }
  }

  /**
   * 获取留存数据
   */
  static async getRetentionData(ctx: Context) {
    try {
      const { startDate, endDate } = ctx.query;
      const data = await getRetentionAnalytics(
        startDate ? parseInt(startDate as string) : undefined,
        endDate ? parseInt(endDate as string) : undefined
      );
      ctx.body = { success: true, data };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '获取留存数据失败', error: (error as Error).message };
    }
  }

  /**
   * 导出数据
   */
  static async exportData(ctx: Context) {
    try {
      const { type, format = 'json', startDate, endDate } = ctx.query;
      if (!type) {
        ctx.status = 400;
        ctx.body = { success: false, message: '缺少数据类型参数' };
        return;
      }

      const data = await exportAnalyticsData(
        type as string,
        format as string,
        startDate ? parseInt(startDate as string) : undefined,
        endDate ? parseInt(endDate as string) : undefined
      );

      ctx.body = { success: true, data };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '导出数据失败', error: (error as Error).message };
    }
  }
}
