import { Context } from 'koa';
import { ReportInfoModel } from '../database/models/ReportInfo';
import { ErrorInfo } from '@whayl/monitor-core/types';
import { IReportInfo } from '../types';

/**
 * 将驼峰命名转换为下划线命名
 * @param obj 需要转换的对象
 * @returns 转换后的对象
 */
const camelToSnakeCase = (obj: Record<string, any>): Record<string, any> => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const converted: Record<string, any> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 将驼峰命名转换为下划线命名
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      converted[snakeKey] = obj[key];
    }
  }
  return converted;
};

/**
 * 解析请求体数据
 * @param data 原始请求体数据
 * @returns 解析后的数据
 */
const parseRequestBody = (data: any): ErrorInfo | ErrorInfo[] => {
  // 如果是字符串，则尝试解析为JSON
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.warn('Failed to parse request body as JSON:', data);
      return [];
    }
  }
  return data;
};

/**
 * 处理单条监控报告数据
 * @param ctx Koa上下文
 * @param reportData 报告数据
 * @param ip 客户端IP
 */
const handleSingleMonitorReport = async (ctx, reportData: ErrorInfo, ip: string) => {
  // 字段名适配，将驼峰转换为下划线命名

  // 构造完整的报告信息
  const reportInfo: IReportInfo = {
    platform: reportData.platform,
    plugin_name: reportData.pluginName,
    message: reportData.message,
    url: reportData.url,
    timestamp: reportData.timestamp,
    date: reportData.date,
    level: reportData.level,
    device_width: reportData.deviceInfo.width,
    device_height: reportData.deviceInfo.height,
    device_pixel_ratio: reportData.deviceInfo.pixelRatio,
    fingerprint: reportData.fingerprint,
    old_fingerprint: reportData.oldFingerprint,
    ip: ip,
    created_at: new Date(),
    updated_at: new Date()
  };

  // 保存到数据库
  const result = await ReportInfoModel.create(reportInfo);

  // 返回成功响应
  ctx.status = 200;
  ctx.body = {
    success: true,
    message: 'Report data saved successfully',
    data: result
  };
};

/**
 * 处理批量监控报告数据
 * @param ctx Koa上下文
 * @param reportsData 报告数据数组
 * @param ip 客户端IP
 */
const handleBatchMonitorReport = async (ctx, reportsData: ErrorInfo[], ip: string) => {
  if (!Array.isArray(reportsData)) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: 'Request body should be an array of report data'
    };
    return;
  }

  // 构造完整的报告信息数组
  const reports: IReportInfo[] = reportsData.map(reportData => ({
    platform: reportData.platform,
    plugin_name: reportData.pluginName,
    message: reportData.message,
    url: reportData.url,
    timestamp: reportData.timestamp,
    date: reportData.date,
    level: reportData.level,
    device_width: reportData.deviceInfo.width,
    device_height: reportData.deviceInfo.height,
    device_pixel_ratio: reportData.deviceInfo.pixelRatio,
    fingerprint: reportData.fingerprint,
    old_fingerprint: reportData.oldFingerprint,
    ip: ip,
    created_at: new Date(),
    updated_at: new Date()
  }));

  // 批量保存到数据库
  await ReportInfoModel.createBatch(reports);

  // 返回成功响应
  ctx.status = 200;
  ctx.body = {
    success: true,
    message: 'Batch report data saved successfully',
    count: reports.length
  };
};
/**
 * 判断上传的数据是数组还是单个对象，并调用相应处理函数
 * @param ctx Koa上下文
 */
const processData = async (ctx) => {
  try {
    // 获取客户端IP地址
    const ip = ctx.ip || ctx.request.ip || (ctx.headers['x-forwarded-for'] as string) || 'unknown';

    // 获取请求体数据并解析
    const rawData = ctx.request.body;
    const reportData = parseRequestBody(rawData);

    if (Array.isArray(reportData)) {
      await handleBatchMonitorReport(ctx, reportData, ip);
    } else {
      await handleSingleMonitorReport(ctx, reportData, ip);
    }
  } catch (error) {
    console.error('Error processing data:', error);

    // 返回错误响应
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to process data',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
/**
 * 处理监控报告数据
 * @param ctx Koa上下文
 */
export const handleMonitorReport = async (ctx) => {
  await processData(ctx);
};