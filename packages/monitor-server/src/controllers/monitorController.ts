import { Context } from 'koa';
import 'koa-body';
import '../types';
import { ErrorInfoModel, IErrorInfo } from '../database/models/ErrorInfo';
import { UserSessionModel, IUserSession } from '../database/models/UserSession';
import { PageVisitModel, IPageVisit } from '../database/models/PageVisit';
import { PerformanceMetricModel, IPerformanceMetric } from '../database/models/PerformanceMetric';
import { UserBehaviorModel, IUserBehavior } from '../database/models/UserBehavior';
import { NetworkRequestModel, INetworkRequest } from '../database/models/NetworkRequest';
import { AlertRuleModel, IAlertRule } from '../database/models/AlertRule';
import { AlertRecordModel, IAlertRecord } from '../database/models/AlertRecord';
import {
  getOverallAnalytics,
  getPluginAnalytics,
  getDetailedAnalytics,
  getUserBehaviorFlow,
  getRealtimeAnalytics,
  getUserAnalytics,
  getPerformanceAnalytics,
  getDeviceAnalytics,
  getAlertAnalytics,
  getFunnelAnalytics,
  getRetentionAnalytics,
  exportAnalyticsData
} from '../services/analyticsService';

/**
 * 保存监控数据
 * @param ctx Koa上下文
 */
export const saveMonitorData = async (ctx): Promise<void> => {
  try {
    let rawData = ctx.request.body;

    // 检查数据是否存在
    if (!rawData) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Missing data in request body'
      };
      return;
    }

    // 处理 navigator.sendBeacon 发送的文本数据
    if (typeof rawData === 'string') {
      try {
        rawData = JSON.parse(rawData);
      } catch (parseError) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Invalid JSON data'
        };
        return;
      }
    }

    let monitorData: any[] = [];

    // 处理单条或批量数据
    if (Array.isArray(rawData)) {
      monitorData = rawData;
    } else {
      monitorData = [rawData];
    }

    // 保存数据到数据库
    let savedCount = 0;
    for (const data of monitorData) {
      try {
        const errorInfo: IErrorInfo = {
          level: data.level,
          message: data.message,
          stack: data.stack,
          timestamp: data.timestamp,
          date: data.date,
          url: data.url,
          userId: data.userId,
          pluginName: data.pluginName,
          fingerprint: data.fingerprint,
          userAgent: data.userAgent,
          devicePixelRatio: data.devicePixelRatio,
          extraData: data.extraData
        };

        await ErrorInfoModel.create(errorInfo);
        savedCount++;
      } catch (saveError) {
        console.error('Error saving individual record:', saveError);
        // 继续处理其他记录
      }
    }

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: `Successfully saved ${savedCount} records`,
      data: savedCount
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to save monitor data'
    };
    console.error('Error saving monitor data:', error);
  }
};

/**
 * 获取分析数据
 * @param ctx Koa上下文
 */
export const getAnalyticsData = async (ctx: Context): Promise<void> => {
  try {
    const {
      startDate,
      endDate,
      pluginName,
      type
    } = ctx.query;

    let result;

    if (pluginName) {
      result = await getPluginAnalytics(
        pluginName as string,
        startDate ? parseInt(startDate as string) : undefined,
        endDate ? parseInt(endDate as string) : undefined
      );
    } else if (type === 'detailed') {
      result = await getDetailedAnalytics(
        startDate ? parseInt(startDate as string) : undefined,
        endDate ? parseInt(endDate as string) : undefined
      );
    } else {
      result = await getOverallAnalytics(
        startDate ? parseInt(startDate as string) : undefined,
        endDate ? parseInt(endDate as string) : undefined
      );
    }

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: result
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to fetch analytics data'
    };
    console.error('Error fetching analytics data:', error);
  }
};

/**
 * 获取用户行为流程数据
 * 提供用户的详细操作流程分析，包括：
 * 1. 用户进入系统的时间和地址
 * 2. 页面白屏时间等性能统计
 * 3. 错误统计
 * 4. 用户操作行为（如点击元素）
 * 5. 操作引起的副作用
 * 6. 离开页面的时间和目标页面
 * @param ctx Koa上下文
 */
export const getUserBehaviorFlowData = async (ctx: Context): Promise<void> => {
  try {
    const {
      fingerprint,
      startDate,
      endDate
    } = ctx.query;

    // 检查必要参数
    if (!fingerprint) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Missing fingerprint parameter'
      };
      return;
    }

    const result = await getUserBehaviorFlow(
      fingerprint as string,
      startDate ? parseInt(startDate as string) : undefined,
      endDate ? parseInt(endDate as string) : undefined
    );

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: result
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to fetch user behavior flow data'
    };
    console.error('Error fetching user behavior flow data:', error);
  }
};

/**
 * 保存用户会话数据
 */
export const saveUserSession = async (ctx: Context): Promise<void> => {
  try {
    const sessionData = ctx.request.body as IUserSession;

    if (!sessionData.sessionId || !sessionData.fingerprint) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Missing required fields: sessionId, fingerprint'
      };
      return;
    }

    const session = await UserSessionModel.create(sessionData);

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'User session saved successfully',
      data: session
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to save user session'
    };
    console.error('Error saving user session:', error);
  }
};

/**
 * 保存页面访问数据
 */
export const savePageVisit = async (ctx: Context): Promise<void> => {
  try {
    const visitData = ctx.request.body as IPageVisit;

    if (!visitData.sessionId || !visitData.fingerprint || !visitData.url) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Missing required fields: sessionId, fingerprint, url'
      };
      return;
    }

    const visit = await PageVisitModel.create(visitData);

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Page visit saved successfully',
      data: visit
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to save page visit'
    };
    console.error('Error saving page visit:', error);
  }
};

/**
 * 保存性能指标数据
 */
export const savePerformanceMetric = async (ctx: Context): Promise<void> => {
  try {
    const metricData = ctx.request.body as IPerformanceMetric;

    if (!metricData.sessionId || !metricData.fingerprint || !metricData.metricName) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Missing required fields: sessionId, fingerprint, metricName'
      };
      return;
    }

    const metric = await PerformanceMetricModel.create(metricData);

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Performance metric saved successfully',
      data: metric
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to save performance metric'
    };
    console.error('Error saving performance metric:', error);
  }
};

/**
 * 保存用户行为数据
 */
export const saveUserBehavior = async (ctx: Context): Promise<void> => {
  try {
    const behaviorData = ctx.request.body as IUserBehavior;

    if (!behaviorData.sessionId || !behaviorData.fingerprint || !behaviorData.behaviorType) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Missing required fields: sessionId, fingerprint, behaviorType'
      };
      return;
    }

    const behavior = await UserBehaviorModel.create(behaviorData);

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'User behavior saved successfully',
      data: behavior
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to save user behavior'
    };
    console.error('Error saving user behavior:', error);
  }
};

/**
 * 保存网络请求数据
 */
export const saveNetworkRequest = async (ctx: Context): Promise<void> => {
  try {
    const requestData = ctx.request.body as INetworkRequest;

    if (!requestData.sessionId || !requestData.fingerprint || !requestData.url || !requestData.method) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Missing required fields: sessionId, fingerprint, url, method'
      };
      return;
    }

    const request = await NetworkRequestModel.create(requestData);

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Network request saved successfully',
      data: request
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to save network request'
    };
    console.error('Error saving network request:', error);
  }
};

/**
 * 获取实时分析数据
 */
export const getRealtimeData = async (ctx: Context): Promise<void> => {
  try {
    const result = await getRealtimeAnalytics();

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: result
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to fetch realtime data'
    };
    console.error('Error fetching realtime data:', error);
  }
};

/**
 * 获取用户分析数据
 */
export const getUserAnalyticsData = async (ctx: Context): Promise<void> => {
  try {
    const { startDate, endDate } = ctx.query;
    const result = await getUserAnalytics(
      startDate ? parseInt(startDate as string) : undefined,
      endDate ? parseInt(endDate as string) : undefined
    );

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: result
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to fetch user analytics'
    };
    console.error('Error fetching user analytics:', error);
  }
};

/**
 * 获取性能分析数据
 */
export const getPerformanceData = async (ctx: Context): Promise<void> => {
  try {
    const { startDate, endDate } = ctx.query;
    const result = await getPerformanceAnalytics(
      startDate ? parseInt(startDate as string) : undefined,
      endDate ? parseInt(endDate as string) : undefined
    );

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: result
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to fetch performance data'
    };
    console.error('Error fetching performance data:', error);
  }
};

/**
 * 获取设备分析数据
 */
export const getDeviceData = async (ctx: Context): Promise<void> => {
  try {
    const { startDate, endDate } = ctx.query;
    const result = await getDeviceAnalytics(
      startDate ? parseInt(startDate as string) : undefined,
      endDate ? parseInt(endDate as string) : undefined
    );

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: result
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to fetch device data'
    };
    console.error('Error fetching device data:', error);
  }
};

/**
 * 获取告警分析数据
 */
export const getAlertData = async (ctx: Context): Promise<void> => {
  try {
    const { startDate, endDate } = ctx.query;
    const result = await getAlertAnalytics(
      startDate ? parseInt(startDate as string) : undefined,
      endDate ? parseInt(endDate as string) : undefined
    );

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: result
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to fetch alert data'
    };
    console.error('Error fetching alert data:', error);
  }
};

/**
 * 获取漏斗分析数据
 */
export const getFunnelData = async (ctx: Context): Promise<void> => {
  try {
    const { steps, startDate, endDate } = ctx.query;

    if (!steps) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Missing required parameter: steps'
      };
      return;
    }

    const funnelSteps = (steps as string).split(',');
    const result = await getFunnelAnalytics(
      funnelSteps,
      startDate ? parseInt(startDate as string) : undefined,
      endDate ? parseInt(endDate as string) : undefined
    );

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: result
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to fetch funnel data'
    };
    console.error('Error fetching funnel data:', error);
  }
};

/**
 * 获取留存分析数据
 */
export const getRetentionData = async (ctx: Context): Promise<void> => {
  try {
    const { startDate, endDate } = ctx.query;
    const result = await getRetentionAnalytics(
      startDate ? parseInt(startDate as string) : undefined,
      endDate ? parseInt(endDate as string) : undefined
    );

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: result
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to fetch retention data'
    };
    console.error('Error fetching retention data:', error);
  }
};

/**
 * 导出分析数据
 */
export const exportData = async (ctx: Context): Promise<void> => {
  try {
    const { dataType, format, startDate, endDate } = ctx.query;

    if (!dataType) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Missing required parameter: dataType'
      };
      return;
    }

    const result = await exportAnalyticsData(
      dataType as string,
      format as string || 'json',
      startDate ? parseInt(startDate as string) : undefined,
      endDate ? parseInt(endDate as string) : undefined
    );

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: result
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to export data'
    };
    console.error('Error exporting data:', error);
  }
};

/**
 * 创建告警规则
 */
export const createAlertRule = async (ctx: Context): Promise<void> => {
  try {
    const ruleData = ctx.request.body as IAlertRule;

    if (!ruleData.name || !ruleData.ruleType || !ruleData.conditions) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Missing required fields: name, ruleType, conditions'
      };
      return;
    }

    const rule = await AlertRuleModel.create(ruleData);

    ctx.status = 201;
    ctx.body = {
      success: true,
      message: 'Alert rule created successfully',
      data: rule
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to create alert rule'
    };
    console.error('Error creating alert rule:', error);
  }
};

/**
 * 获取告警规则列表
 */
export const getAlertRules = async (ctx: Context): Promise<void> => {
  try {
    const rules = await AlertRuleModel.findAll();

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: rules
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to fetch alert rules'
    };
    console.error('Error fetching alert rules:', error);
  }
};

/**
 * 更新告警规则
 */
export const updateAlertRule = async (ctx: Context): Promise<void> => {
  try {
    const { id } = ctx.params;
    const updates = ctx.request.body as Partial<IAlertRule>;

    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Missing rule ID'
      };
      return;
    }

    await AlertRuleModel.update(parseInt(id), updates);

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Alert rule updated successfully'
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to update alert rule'
    };
    console.error('Error updating alert rule:', error);
  }
};

/**
 * 删除告警规则
 */
export const deleteAlertRule = async (ctx: Context): Promise<void> => {
  try {
    const { id } = ctx.params;

    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Missing rule ID'
      };
      return;
    }

    await AlertRuleModel.delete(parseInt(id));

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Alert rule deleted successfully'
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to delete alert rule'
    };
    console.error('Error deleting alert rule:', error);
  }
};

/**
 * 获取告警记录
 */
export const getAlertRecords = async (ctx: Context): Promise<void> => {
  try {
    const { limit, offset, severity, alertType, isResolved, startDate, endDate } = ctx.query;

    const options = {
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
      severity: severity as string,
      alertType: alertType as string,
      isResolved: isResolved ? isResolved === 'true' : undefined,
      startDate: startDate ? parseInt(startDate as string) : undefined,
      endDate: endDate ? parseInt(endDate as string) : undefined
    };

    const records = await AlertRecordModel.findAll(options);

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: records
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to fetch alert records'
    };
    console.error('Error fetching alert records:', error);
  }
};

/**
 * 解决告警
 */
export const resolveAlert = async (ctx: Context): Promise<void> => {
  try {
    const { id } = ctx.params;

    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Missing alert ID'
      };
      return;
    }

    await AlertRecordModel.resolve(parseInt(id));

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Alert resolved successfully'
    };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: error.message || 'Failed to resolve alert'
    };
    console.error('Error resolving alert:', error);
  }
};