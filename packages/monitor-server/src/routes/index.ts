import Router from '@koa/router';
import { handleMonitorReport } from '../controllers/ReportController';
import { handleErrorInfo, getErrorInfos, getErrorInfoById, deleteErrorInfo } from '../controllers/ErrorInfoController';
import { handleRequestInfo, getRequestInfos, getRequestInfoById, deleteRequestInfo } from '../controllers/RequestInfoController';
import { handlePageLifecycle, getPageLifecycles, getPageLifecycleById, deletePageLifecycle } from '../controllers/PageLifecycleController';

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

  // 错误信息相关接口
  router.post('/api/error/info', handleErrorInfo);
  router.get('/api/error/info', getErrorInfos);
  router.get('/api/error/info/:id', getErrorInfoById);
  router.delete('/api/error/info/:id', deleteErrorInfo);

  // 请求信息相关接口
  router.post('/api/request/info', handleRequestInfo);
  router.get('/api/request/info', getRequestInfos);
  router.get('/api/request/info/:id', getRequestInfoById);
  router.delete('/api/request/info/:id', deleteRequestInfo);

  // 页面生命周期相关接口
  router.post('/api/page/lifecycle', handlePageLifecycle);
  router.get('/api/page/lifecycle', getPageLifecycles);
  router.get('/api/page/lifecycle/:id', getPageLifecycleById);
  router.delete('/api/page/lifecycle/:id', deletePageLifecycle);

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