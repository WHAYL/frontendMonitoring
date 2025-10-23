import { Context } from 'koa';
import 'koa-body';
import '../types';
import { ErrorInfoModel, IErrorInfo } from '../database/models/ErrorInfo';
import { getOverallAnalytics, getPluginAnalytics } from '../services/analyticsService';

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
      pluginName
    } = ctx.query;

    let result;

    if (pluginName) {
      result = await getPluginAnalytics(
        pluginName as string,
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