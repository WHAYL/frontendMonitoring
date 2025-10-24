import Router from '@koa/router';
import { saveMonitorData, getAnalyticsData, getUserBehaviorFlowData } from '../controllers/monitorController';

/**
 * 设置路由
 * @param router Koa路由器实例
 */
export const setupRoutes = (router: Router): void => {
  // 健康检查接口
  router.get('/health', async (ctx) => {
    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Monitor server is running'
    };
  });

  // 接收监控数据
  router.post('/api/monitor/report', (ctx) => saveMonitorData(ctx));

  // 获取分析数据
  router.get('/api/monitor/analytics', getAnalyticsData);

  // 获取详细分析数据
  router.get('/api/monitor/analytics/detailed', getAnalyticsData);

  // 获取用户行为流程数据
  router.get('/api/monitor/analytics/user-flow', getUserBehaviorFlowData);

  // 默认路由
  router.get('/', async (ctx) => {
    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Welcome to Monitor Server API',
      endpoints: {
        health: 'GET /health',
        report: 'POST /api/monitor/report',
        analytics: 'GET /api/monitor/analytics',
        detailedAnalytics: 'GET /api/monitor/analytics/detailed',
        userFlow: 'GET /api/monitor/analytics/user-flow'
      }
    };
  });
};