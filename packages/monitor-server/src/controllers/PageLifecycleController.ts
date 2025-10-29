import { Context } from 'koa';
import { PageLifecycleModel, IPageLifecycle } from '../database/models/PageLifecycle';

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
const parseRequestBody = (data: any): any | any[] => {
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
 * 处理单条页面生命周期数据
 * @param ctx Koa上下文
 * @param lifecycleData 生命周期数据
 * @param ip 客户端IP
 */
const handleSinglePageLifecycle = async (ctx, lifecycleData: any, ip: string) => {
  // 构造完整的页面生命周期信息
  const lifecycleInfo: IPageLifecycle = {
    platform: lifecycleData.platform,
    plugin_name: lifecycleData.pluginName,
    message: lifecycleData.message,
    page: lifecycleData.page,
    timestamp: lifecycleData.timestamp,
    date: lifecycleData.date,
    level: lifecycleData.level,
    device_width: lifecycleData.deviceInfo?.width,
    device_height: lifecycleData.deviceInfo?.height,
    device_pixel_ratio: lifecycleData.deviceInfo?.pixelRatio,
    fingerprint: lifecycleData.fingerprint,
    old_fingerprint: lifecycleData.oldFingerprint,
    ip: ip,
    change_type: lifecycleData.changeType,
    enter_time: lifecycleData.enterTime,
    leave_time: lifecycleData.leaveTime,
    current_route: lifecycleData.currentRoute,
    previous_route: lifecycleData.previousRoute,
    route: lifecycleData.route,
    target: lifecycleData.target,
    duration: lifecycleData.duration
  };

  // 保存到数据库
  const result = await PageLifecycleModel.create(lifecycleInfo);

  // 返回成功响应
  ctx.status = 200;
  ctx.body = {
    success: true,
    message: 'Page lifecycle info saved successfully',
    data: result
  };
};

/**
 * 处理批量页面生命周期数据
 * @param ctx Koa上下文
 * @param lifecyclesData 生命周期数据数组
 * @param ip 客户端IP
 */
const handleBatchPageLifecycle = async (ctx, lifecyclesData: any[], ip: string) => {
  if (!Array.isArray(lifecyclesData)) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: 'Request body should be an array of lifecycle data'
    };
    return;
  }

  // 构造完整的生命周期信息数组
  const lifecycles: IPageLifecycle[] = lifecyclesData.map(lifecycleData => ({
    platform: lifecycleData.platform,
    plugin_name: lifecycleData.pluginName,
    message: lifecycleData.message,
    page: lifecycleData.page,
    timestamp: lifecycleData.timestamp,
    date: lifecycleData.date,
    level: lifecycleData.level,
    device_width: lifecycleData.deviceInfo?.width,
    device_height: lifecycleData.deviceInfo?.height,
    device_pixel_ratio: lifecycleData.deviceInfo?.pixelRatio,
    fingerprint: lifecycleData.fingerprint,
    old_fingerprint: lifecycleData.oldFingerprint,
    ip: ip,
    change_type: lifecycleData.changeType,
    enter_time: lifecycleData.enterTime,
    leave_time: lifecycleData.leaveTime,
    current_route: lifecycleData.currentRoute,
    previous_route: lifecycleData.previousRoute,
    route: lifecycleData.route,
    target: lifecycleData.target,
    duration: lifecycleData.duration
  }));

  // 批量保存到数据库
  await PageLifecycleModel.createBatch(lifecycles);

  // 返回成功响应
  ctx.status = 200;
  ctx.body = {
    success: true,
    message: 'Batch page lifecycle info saved successfully',
    count: lifecycles.length
  };
};

/**
 * 处理页面生命周期数据
 * @param ctx Koa上下文
 */
export const handlePageLifecycle = async (ctx) => {
  try {
    // 获取客户端IP地址
    const ip = ctx.ip || ctx.request.ip || (ctx.headers['x-forwarded-for'] as string) || 'unknown';

    // 获取请求体数据并解析
    const rawData = ctx.request.body;
    const lifecycleData = parseRequestBody(rawData);

    if (Array.isArray(lifecycleData)) {
      await handleBatchPageLifecycle(ctx, lifecycleData, ip);
    } else {
      await handleSinglePageLifecycle(ctx, lifecycleData, ip);
    }
  } catch (error) {
    console.error('Error processing page lifecycle data:', error);

    // 返回错误响应
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to process page lifecycle data',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * 获取所有页面生命周期信息
 * @param ctx Koa上下文
 */
export const getPageLifecycles = async (ctx) => {
  try {
    const { page = 1, limit = 10, ...where } = ctx.query;

    // 转换分页参数
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    // 查询数据
    const lifecycles = await PageLifecycleModel.findAll({
      where,
      limit: limitNum,
      offset,
      order: [['id', 'DESC']]
    });

    // 查询总数
    const total = await PageLifecycleModel.count({ where });

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: lifecycles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total
      }
    };
  } catch (error) {
    console.error('Error getting page lifecycles:', error);

    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to get page lifecycles',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * 根据ID获取页面生命周期信息
 * @param ctx Koa上下文
 */
export const getPageLifecycleById = async (ctx) => {
  try {
    const { id } = ctx.params;
    const idNum = parseInt(id, 10);

    if (isNaN(idNum)) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Invalid ID'
      };
      return;
    }

    const lifecycle = await PageLifecycleModel.findById(idNum);

    if (!lifecycle) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: 'Page lifecycle info not found'
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: lifecycle
    };
  } catch (error) {
    console.error('Error getting page lifecycle by ID:', error);

    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to get page lifecycle info',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * 删除页面生命周期信息
 * @param ctx Koa上下文
 */
export const deletePageLifecycle = async (ctx) => {
  try {
    const { id } = ctx.params;
    const idNum = parseInt(id, 10);

    if (isNaN(idNum)) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Invalid ID'
      };
      return;
    }

    const result = await PageLifecycleModel.deleteById(idNum);

    if (!result) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: 'Page lifecycle info not found'
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Page lifecycle info deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting page lifecycle info:', error);

    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to delete page lifecycle info',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};