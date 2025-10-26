import Router from '@koa/router';
import { Context } from 'koa';

const router = new Router();

// 健康检查路由
router.get('/', async (ctx: Context) => {
  const endpoints = {
    dataCollection: {
      'POST /api/monitor/session': '保存用户会话',
      'POST /api/monitor/page-visit': '保存页面访问',
      'POST /api/monitor/performance': '保存性能指标',
      'POST /api/monitor/behavior': '保存用户行为',
      'POST /api/monitor/network': '保存网络请求'
    },
    analytics: {
      'GET /api/monitor/analytics/realtime': '获取实时分析数据',
      'GET /api/monitor/analytics/users': '获取用户分析数据',
      'GET /api/monitor/analytics/performance': '获取性能分析数据',
      'GET /api/monitor/analytics/devices': '获取设备分析数据',
      'GET /api/monitor/analytics/alerts': '获取告警分析数据',
      'GET /api/monitor/analytics/funnel': '获取漏斗分析数据',
      'GET /api/monitor/analytics/retention': '获取留存分析数据',
      'GET /api/monitor/export': '导出分析数据'
    },
    alerts: {
      'POST /api/monitor/alerts/rules': '创建告警规则',
      'GET /api/monitor/alerts/rules': '获取告警规则列表',
      'PUT /api/monitor/alerts/rules/:id': '更新告警规则',
      'DELETE /api/monitor/alerts/rules/:id': '删除告警规则',
      'GET /api/monitor/alerts/records': '获取告警记录',
      'PUT /api/monitor/alerts/records/:id/resolve': '解决告警'
    },
    dataQuery: {
      'GET /api/monitor/sessions': '获取用户会话',
      'GET /api/monitor/page-visits': '获取页面访问记录',
      'GET /api/monitor/behaviors': '获取用户行为记录',
      'GET /api/monitor/network-requests': '获取网络请求记录',
      'GET /api/monitor/performance-metrics': '获取性能指标记录',
      'GET /api/monitor/behavior-flow': '获取用户行为流程',
      'GET /api/monitor/overview': '获取系统概览'
    }
  };

  ctx.body = {
    success: true,
    message: '前端监控服务运行正常',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints
  };
});

// 服务状态检查
router.get('/health', async (ctx: Context) => {
  ctx.body = {
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  };
});

export default router;
