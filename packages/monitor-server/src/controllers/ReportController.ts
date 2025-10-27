import { Context } from 'koa';
import { ReportInfoModel, IReportInfo } from '../database/models/ReportInfo';

/**
 * 处理监控报告数据
 * @param ctx Koa上下文
 */
export const handleMonitorReport = async (ctx: Context) => {
  try {
    // 获取客户端IP地址
    const ip = ctx.ip || ctx.request.ip || (ctx.headers['x-forwarded-for'] as string) || 'unknown';

    // 获取请求体数据
    const reportData = ctx.request.body as Partial<IReportInfo>;

    // 构造完整的报告信息
    const reportInfo: IReportInfo = {
      platform: reportData.platform,
      plugin_name: reportData.plugin_name,
      message: reportData.message,
      url: reportData.url,
      timestamp: reportData.timestamp,
      date: reportData.date,
      level: reportData.level,
      device_width: reportData.device_width,
      device_height: reportData.device_height,
      device_pixel_ratio: reportData.device_pixel_ratio,
      fingerprint: reportData.fingerprint,
      old_fingerprint: reportData.old_fingerprint,
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
  } catch (error) {
    console.error('Error saving report data:', error);

    // 返回错误响应
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to save report data',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * 批量处理监控报告数据
 * @param ctx Koa上下文
 */
export const handleBatchMonitorReport = async (ctx: Context) => {
  try {
    // 获取客户端IP地址
    const ip = ctx.ip || ctx.request.ip || (ctx.headers['x-forwarded-for'] as string) || 'unknown';

    // 获取请求体数据（应该是一个报告数组）
    const reportsData = ctx.request.body as Partial<IReportInfo>[];

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
      plugin_name: reportData.plugin_name,
      message: reportData.message,
      url: reportData.url,
      timestamp: reportData.timestamp,
      date: reportData.date,
      level: reportData.level,
      device_width: reportData.device_width,
      device_height: reportData.device_height,
      device_pixel_ratio: reportData.device_pixel_ratio,
      fingerprint: reportData.fingerprint,
      old_fingerprint: reportData.old_fingerprint,
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
  } catch (error) {
    console.error('Error saving batch report data:', error);

    // 返回错误响应
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to save batch report data',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};