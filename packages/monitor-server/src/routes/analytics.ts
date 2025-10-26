import Router from '@koa/router';
import {
  getRealtimeData,
  getUserAnalyticsData,
  getPerformanceData,
  getDeviceData,
  getAlertData,
  getFunnelData,
  getRetentionData,
  exportData
} from '../controllers';

const router = new Router();

// 分析路由
router.get('/api/monitor/analytics/realtime', getRealtimeData);
router.get('/api/monitor/analytics/users', getUserAnalyticsData);
router.get('/api/monitor/analytics/performance', getPerformanceData);
router.get('/api/monitor/analytics/devices', getDeviceData);
router.get('/api/monitor/analytics/alerts', getAlertData);
router.get('/api/monitor/analytics/funnel', getFunnelData);
router.get('/api/monitor/analytics/retention', getRetentionData);
router.get('/api/monitor/export', exportData);

export default router;
