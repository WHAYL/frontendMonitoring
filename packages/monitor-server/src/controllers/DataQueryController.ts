import { Context } from 'koa';
import { UserSessionModel } from '../database/models/UserSession';
import { PageVisitModel } from '../database/models/PageVisit';
import { UserBehaviorModel } from '../database/models/UserBehavior';
import { NetworkRequestModel } from '../database/models/NetworkRequest';
import { PerformanceMetricModel } from '../database/models/PerformanceMetric';
import { getUserBehaviorFlow } from '../services/analytics';

/**
 * 数据查询控制器
 */
export class DataQueryController {
  /**
   * 获取用户会话
   */
  static async getUserSessions(ctx: Context) {
    try {
      const { fingerprint, limit = 100 } = ctx.query;
      if (!fingerprint) {
        ctx.status = 400;
        ctx.body = { success: false, message: '缺少指纹参数' };
        return;
      }

      const sessions = await UserSessionModel.findByFingerprint(
        fingerprint as string,
        parseInt(limit as string)
      );
      ctx.body = { success: true, data: sessions };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '获取用户会话失败', error: (error as Error).message };
    }
  }

  /**
   * 获取页面访问记录
   */
  static async getPageVisits(ctx: Context) {
    try {
      const { sessionId, limit = 100 } = ctx.query;
      if (!sessionId) {
        ctx.status = 400;
        ctx.body = { success: false, message: '缺少会话ID参数' };
        return;
      }

      const visits = await PageVisitModel.findBySessionId(
        sessionId as string
      );
      ctx.body = { success: true, data: visits };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '获取页面访问记录失败', error: (error as Error).message };
    }
  }

  /**
   * 获取用户行为记录
   */
  static async getUserBehaviors(ctx: Context) {
    try {
      const { fingerprint, limit = 100 } = ctx.query;
      if (!fingerprint) {
        ctx.status = 400;
        ctx.body = { success: false, message: '缺少指纹参数' };
        return;
      }

      const behaviors = await UserBehaviorModel.getUserBehaviorFlow(
        fingerprint as string
      );
      ctx.body = { success: true, data: behaviors };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '获取用户行为记录失败', error: (error as Error).message };
    }
  }

  /**
   * 获取网络请求记录
   */
  static async getNetworkRequests(ctx: Context) {
    try {
      const { sessionId, limit = 100 } = ctx.query;
      if (!sessionId) {
        ctx.status = 400;
        ctx.body = { success: false, message: '缺少会话ID参数' };
        return;
      }

      const requests = await NetworkRequestModel.findBySessionId(
        sessionId as string
      );
      ctx.body = { success: true, data: requests };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '获取网络请求记录失败', error: (error as Error).message };
    }
  }

  /**
   * 获取性能指标记录
   */
  static async getPerformanceMetrics(ctx: Context) {
    try {
      const { sessionId, limit = 100 } = ctx.query;
      if (!sessionId) {
        ctx.status = 400;
        ctx.body = { success: false, message: '缺少会话ID参数' };
        return;
      }

      const metrics = await PerformanceMetricModel.findBySessionId(
        sessionId as string
      );
      ctx.body = { success: true, data: metrics };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '获取性能指标记录失败', error: (error as Error).message };
    }
  }

  /**
   * 获取用户行为流程
   */
  static async getUserBehaviorFlow(ctx: Context) {
    try {
      const { fingerprint, startDate, endDate } = ctx.query;
      if (!fingerprint) {
        ctx.status = 400;
        ctx.body = { success: false, message: '缺少指纹参数' };
        return;
      }

      const flow = await getUserBehaviorFlow(
        fingerprint as string,
        startDate ? parseInt(startDate as string) : undefined,
        endDate ? parseInt(endDate as string) : undefined
      );
      ctx.body = { success: true, data: flow };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '获取用户行为流程失败', error: (error as Error).message };
    }
  }

  /**
   * 获取系统概览
   */
  static async getSystemOverview(ctx: Context) {
    try {
      const { startDate, endDate } = ctx.query;

      // 获取基础统计
      const [sessionStats, pageStats, behaviorStats] = await Promise.all([
        UserSessionModel.getSessionStats(
          startDate ? parseInt(startDate as string) : undefined,
          endDate ? parseInt(endDate as string) : undefined
        ),
        PageVisitModel.getPageStats(
          startDate ? parseInt(startDate as string) : undefined,
          endDate ? parseInt(endDate as string) : undefined
        ),
        UserBehaviorModel.getBehaviorStats(
          startDate ? parseInt(startDate as string) : undefined,
          endDate ? parseInt(endDate as string) : undefined
        )
      ]);

      ctx.body = {
        success: true,
        data: {
          sessions: sessionStats,
          pages: pageStats,
          behaviors: behaviorStats,
          timeRange: {
            start: startDate ? new Date(parseInt(startDate as string)).toISOString() : null,
            end: endDate ? new Date(parseInt(endDate as string)).toISOString() : null
          }
        }
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: '获取系统概览失败', error: (error as Error).message };
    }
  }
}
