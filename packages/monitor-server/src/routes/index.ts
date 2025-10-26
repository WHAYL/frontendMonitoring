import Router from '@koa/router';
import { saveMonitorData } from '../controllers/monitorController';
import dataCollectionRoutes from './dataCollection';
import analyticsRoutes from './analytics';
import alertsRoutes from './alerts';
import dataQueryRoutes from './dataQuery';
import healthRoutes from './health';

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

  // 接收监控数据（保持原有功能）
  router.post('/api/monitor/report', (ctx) => saveMonitorData(ctx));

  // 注册模块化路由
  router.use(dataCollectionRoutes.routes());
  router.use(analyticsRoutes.routes());
  router.use(alertsRoutes.routes());
  router.use(dataQueryRoutes.routes());
  router.use(healthRoutes.routes());

  // 默认路由
  router.get('/', async (ctx) => {
    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Welcome to Monitor Server API',
      version: '2.0.0',
      endpoints: {
        // 数据收集
        report: 'POST /api/monitor/report',
        session: 'POST /api/monitor/session',
        pageVisit: 'POST /api/monitor/page-visit',
        performanceMetric: 'POST /api/monitor/performance',
        behavior: 'POST /api/monitor/behavior',
        network: 'POST /api/monitor/network',

        // 分析数据
        analytics: 'GET /api/monitor/analytics',
        realtime: 'GET /api/monitor/analytics/realtime',
        users: 'GET /api/monitor/analytics/users',
        performanceAnalytics: 'GET /api/monitor/analytics/performance',
        devices: 'GET /api/monitor/analytics/devices',
        alerts: 'GET /api/monitor/analytics/alerts',
        funnel: 'GET /api/monitor/analytics/funnel',
        retention: 'GET /api/monitor/analytics/retention',

        // 数据查询
        sessions: 'GET /api/monitor/sessions',
        pageVisits: 'GET /api/monitor/page-visits',
        behaviors: 'GET /api/monitor/behaviors',
        networkRequests: 'GET /api/monitor/network-requests',
        performanceMetrics: 'GET /api/monitor/performance-metrics',
        behaviorFlow: 'GET /api/monitor/behavior-flow',

        // 告警管理
        alertRules: 'GET /api/monitor/alerts/rules',
        alertRecords: 'GET /api/monitor/alerts/records',

        // 其他
        export: 'GET /api/monitor/export',
        overview: 'GET /api/monitor/overview',
        health: 'GET /health'
      }
    };
  });
};