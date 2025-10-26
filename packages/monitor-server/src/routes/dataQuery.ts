import Router from '@koa/router';
import {
  getUserSessions,
  getPageVisits,
  getUserBehaviors,
  getNetworkRequests,
  getPerformanceMetrics,
  getUserBehaviorFlow,
  getSystemOverview
} from '../controllers';

const router = new Router();

// 数据查询路由
router.get('/api/monitor/sessions', getUserSessions);
router.get('/api/monitor/page-visits', getPageVisits);
router.get('/api/monitor/behaviors', getUserBehaviors);
router.get('/api/monitor/network-requests', getNetworkRequests);
router.get('/api/monitor/performance-metrics', getPerformanceMetrics);
router.get('/api/monitor/behavior-flow', getUserBehaviorFlow);
router.get('/api/monitor/overview', getSystemOverview);

export default router;
