import { Context } from 'koa';
import { UserSessionModel } from '../database/models/UserSession';
import { PageVisitModel } from '../database/models/PageVisit';
import { PerformanceMetricModel } from '../database/models/PerformanceMetric';
import { UserBehaviorModel } from '../database/models/UserBehavior';
import { NetworkRequestModel } from '../database/models/NetworkRequest';

/**
 * 数据收集控制器
 */
export class DataCollectionController {
  /**
   * 保存用户会话
   */
  static async saveUserSession(ctx: Context) {
    try {
      const sessionData = ctx.request.body;
      const session = await UserSessionModel.create(sessionData);
      ctx.body = { success: true, data: session };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '保存用户会话失败', error: (error as Error).message };
    }
  }

  /**
   * 保存页面访问
   */
  static async savePageVisit(ctx: Context) {
    try {
      const visitData = ctx.request.body;
      const visit = await PageVisitModel.create(visitData);
      ctx.body = { success: true, data: visit };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '保存页面访问失败', error: (error as Error).message };
    }
  }

  /**
   * 保存性能指标
   */
  static async savePerformanceMetric(ctx: Context) {
    try {
      const metricData = ctx.request.body;
      const metric = await PerformanceMetricModel.create(metricData);
      ctx.body = { success: true, data: metric };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '保存性能指标失败', error: (error as Error).message };
    }
  }

  /**
   * 保存用户行为
   */
  static async saveUserBehavior(ctx: Context) {
    try {
      const behaviorData = ctx.request.body;
      const behavior = await UserBehaviorModel.create(behaviorData);
      ctx.body = { success: true, data: behavior };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '保存用户行为失败', error: (error as Error).message };
    }
  }

  /**
   * 保存网络请求
   */
  static async saveNetworkRequest(ctx: Context) {
    try {
      const requestData = ctx.request.body;
      const request = await NetworkRequestModel.create(requestData);
      ctx.body = { success: true, data: request };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '保存网络请求失败', error: (error as Error).message };
    }
  }
}
