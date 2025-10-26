import Router from '@koa/router';
import {
  saveUserSession,
  savePageVisit,
  savePerformanceMetric,
  saveUserBehavior,
  saveNetworkRequest
} from '../controllers';

const router = new Router();

// 数据收集路由
router.post('/api/monitor/session', saveUserSession);
router.post('/api/monitor/page-visit', savePageVisit);
router.post('/api/monitor/performance', savePerformanceMetric);
router.post('/api/monitor/behavior', saveUserBehavior);
router.post('/api/monitor/network', saveNetworkRequest);

export default router;
