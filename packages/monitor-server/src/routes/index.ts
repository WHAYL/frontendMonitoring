import Router from '@koa/router';
import { handleMonitorReport } from '../controllers/ReportController';

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
  router.post('/api/monitor/report', handleMonitorReport);

  // 默认路由
  router.get('/', async (ctx) => {
    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Welcome to Monitor Server API',
      version: '2.0.0',
    };
  });
};