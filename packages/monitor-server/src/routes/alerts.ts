import Router from '@koa/router';
import {
  createAlertRule,
  getAlertRules,
  updateAlertRule,
  deleteAlertRule,
  getAlertRecords,
  resolveAlert
} from '../controllers';

const router = new Router();

// 告警管理路由
router.post('/api/monitor/alerts/rules', createAlertRule);
router.get('/api/monitor/alerts/rules', getAlertRules);
router.put('/api/monitor/alerts/rules/:id', updateAlertRule);
router.delete('/api/monitor/alerts/rules/:id', deleteAlertRule);
router.get('/api/monitor/alerts/records', getAlertRecords);
router.put('/api/monitor/alerts/records/:id/resolve', resolveAlert);

export default router;
