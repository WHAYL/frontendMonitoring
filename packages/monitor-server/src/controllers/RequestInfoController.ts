import { Context } from 'koa';
import { RequestInfoModel, IRequestInfo } from '../database/models/RequestInfo';

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
 * 处理单条请求信息数据
 * @param ctx Koa上下文
 * @param requestData 请求数据
 */
const handleSingleRequestInfo = async (ctx, requestData: any) => {
  // 构造完整的请求信息
  const requestInfo: IRequestInfo = {
    ...requestData,
    url: requestData.extraData.url,
    method: requestData.extraData.method,
    start_time: requestData.extraData.startTime,
    end_time: requestData.extraData.endTime,
    duration: requestData.extraData.duration,
    error_info: requestData.extraData.error || requestData.extraData.stack || ''
  };

  // 保存到数据库
  const result = await RequestInfoModel.create(requestInfo);

  // 返回成功响应
  ctx.status = 200;
  ctx.body = {
    success: true,
    message: 'Request info saved successfully',
    data: result
  };
};

/**
 * 处理批量请求信息数据
 * @param ctx Koa上下文
 * @param requestsData 请求数据数组
 */
const handleBatchRequestInfo = async (ctx, requestsData: any[]) => {
  if (!Array.isArray(requestsData)) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: 'Request body should be an array of request data'
    };
    return;
  }

  // 构造完整的请求信息数组
  const requests: IRequestInfo[] = requestsData.map(requestData => ({
    ...requestData,
    url: requestData.extraData.url,
    method: requestData.extraData.method,
    start_time: requestData.extraData.startTime,
    end_time: requestData.extraData.endTime,
    duration: requestData.extraData.duration,
    error_info: requestData.extraData.error || requestData.extraData.stack || ''
  }));

  // 批量保存到数据库
  await RequestInfoModel.createBatch(requests);

  // 返回成功响应
  ctx.status = 200;
  ctx.body = {
    success: true,
    message: 'Batch request info saved successfully',
    count: requests.length
  };
};

/**
 * 处理请求信息数据
 * @param ctx Koa上下文
 */
export const handleRequestInfo = async (ctx, requestData) => {
  try {
    if (Array.isArray(requestData)) {
      await handleBatchRequestInfo(ctx, requestData);
    } else {
      await handleSingleRequestInfo(ctx, requestData);
    }
  } catch (error) {
    console.error('Error processing request info data:', error);

    // 返回错误响应
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to process request info data',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * 获取所有请求信息
 * @param ctx Koa上下文
 */
export const getRequestInfos = async (ctx) => {
  try {
    const { page = 1, limit = 10, ...where } = ctx.query;

    // 转换分页参数
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    // 查询数据
    const requests = await RequestInfoModel.findAll({
      where,
      limit: limitNum,
      offset,
      order: [['id', 'DESC']]
    });

    // 查询总数
    const total = await RequestInfoModel.count({ where });

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: requests,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total
      }
    };
  } catch (error) {
    console.error('Error getting request infos:', error);

    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to get request infos',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * 根据ID获取请求信息
 * @param ctx Koa上下文
 */
export const getRequestInfoById = async (ctx) => {
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

    const request = await RequestInfoModel.findById(idNum);

    if (!request) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: 'Request info not found'
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: request
    };
  } catch (error) {
    console.error('Error getting request info by ID:', error);

    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to get request info',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * 删除请求信息
 * @param ctx Koa上下文
 */
export const deleteRequestInfo = async (ctx) => {
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

    const result = await RequestInfoModel.deleteById(idNum);

    if (!result) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: 'Request info not found'
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Request info deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting request info:', error);

    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to delete request info',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};