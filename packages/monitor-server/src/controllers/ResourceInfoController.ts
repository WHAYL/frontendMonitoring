import { Context } from 'koa';
import { ResourceInfoModel, IResourceInfo } from '../database/models/ResourceInfo';

/**
 * 处理单条资源信息数据
 * @param ctx Koa上下文
 * @param resourceData 资源数据
 */
const handleSingleResourceInfo = async (ctx, resourceData: any) => {
  // 构造完整的资源信息
  const resourceInfo: IResourceInfo = {
    // 基础字段 (来自resourceData根层级)
    ...resourceData,
    // Resource specific fields (都来自extraData对象)
    name: resourceData.extraData?.name || '',
    entry_type: resourceData.extraData?.entryType || '',
    start_time: resourceData.extraData?.startTime || 0,
    duration: resourceData.extraData?.duration || 0,
    initiator_type: resourceData.extraData?.initiatorType || '',
    next_hop_protocol: resourceData.extraData?.nextHopProtocol || '',
    worker_start: resourceData.extraData?.workerStart || 0,
    redirect_start: resourceData.extraData?.redirectStart || 0,
    redirect_end: resourceData.extraData?.redirectEnd || 0,
    fetch_start: resourceData.extraData?.fetchStart || 0,
    domain_lookup_start: resourceData.extraData?.domainLookupStart || 0,
    domain_lookup_end: resourceData.extraData?.domainLookupEnd || 0,
    connect_start: resourceData.extraData?.connectStart || 0,
    connect_end: resourceData.extraData?.connectEnd || 0,
    secure_connection_start: resourceData.extraData?.secureConnectionStart || 0,
    request_start: resourceData.extraData?.requestStart || 0,
    response_start: resourceData.extraData?.responseStart || 0,
    response_end: resourceData.extraData?.responseEnd || 0,
    transfer_size: resourceData.extraData?.transferSize || 0,
    encoded_body_size: resourceData.extraData?.encodedBodySize || 0,
    decoded_body_size: resourceData.extraData?.decodedBodySize || 0,
    server_timing: resourceData.extraData?.serverTiming.toString() || '',
    cached: resourceData.extraData?.cached.toString() || 0
  };

  // 保存到数据库
  const result = await ResourceInfoModel.create(resourceInfo);

  // 返回成功响应
  ctx.status = 200;
  ctx.body = {
    success: true,
    message: 'Resource info saved successfully',
    data: result
  };
};

/**
 * 处理批量资源信息数据
 * @param ctx Koa上下文
 * @param resourcesData 资源数据数组
 */
const handleBatchResourceInfo = async (ctx, resourcesData: any[]) => {
  if (!Array.isArray(resourcesData)) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: 'Request body should be an array of resource data'
    };
    return;
  }

  // 构造完整的资源信息数组
  const resources: IResourceInfo[] = resourcesData.map(resourceData => ({
    // 基础字段 (来自resourceData根层级)
  ...resourceData,
    // Resource specific fields (都来自extraData对象)
    name: resourceData.extraData?.name || '',
    entry_type: resourceData.extraData?.entryType || '',
    start_time: resourceData.extraData?.startTime || 0,
    duration: resourceData.extraData?.duration || 0,
    initiator_type: resourceData.extraData?.initiatorType || '',
    next_hop_protocol: resourceData.extraData?.nextHopProtocol || '',
    worker_start: resourceData.extraData?.workerStart || 0,
    redirect_start: resourceData.extraData?.redirectStart || 0,
    redirect_end: resourceData.extraData?.redirectEnd || 0,
    fetch_start: resourceData.extraData?.fetchStart || 0,
    domain_lookup_start: resourceData.extraData?.domainLookupStart || 0,
    domain_lookup_end: resourceData.extraData?.domainLookupEnd || 0,
    connect_start: resourceData.extraData?.connectStart || 0,
    connect_end: resourceData.extraData?.connectEnd || 0,
    secure_connection_start: resourceData.extraData?.secureConnectionStart || 0,
    request_start: resourceData.extraData?.requestStart || 0,
    response_start: resourceData.extraData?.responseStart || 0,
    response_end: resourceData.extraData?.responseEnd || 0,
    transfer_size: resourceData.extraData?.transferSize || 0,
    encoded_body_size: resourceData.extraData?.encodedBodySize || 0,
    decoded_body_size: resourceData.extraData?.decodedBodySize || 0,
    server_timing: resourceData.extraData?.serverTiming.toString() || '',
    cached: resourceData.extraData?.cached.toString() || 0
  }));

  // 批量保存到数据库
  await ResourceInfoModel.createBatch(resources);

  // 返回成功响应
  ctx.status = 200;
  ctx.body = {
    success: true,
    message: 'Batch resource info saved successfully',
    count: resources.length
  };
};

/**
 * 处理资源信息数据
 * @param ctx Koa上下文
 */
export const handleResourceInfo = async (ctx,reportInfo) => {
  try {
    if (Array.isArray(reportInfo)) {
      await handleBatchResourceInfo(ctx, reportInfo);
    } else {
      await handleSingleResourceInfo(ctx, reportInfo);
    }
  } catch (error) {
    console.error('Error processing resource info data:', error);

    // 返回错误响应
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to process resource info data',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * 获取所有资源信息
 * @param ctx Koa上下文
 */
export const getResourceInfos = async (ctx) => {
  try {
    const { page = 1, limit = 10, ...where } = ctx.query;

    // 转换分页参数
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    // 查询数据
    const resources = await ResourceInfoModel.findAll({
      where,
      limit: limitNum,
      offset,
      order: [['id', 'DESC']]
    });

    // 查询总数
    const total = await ResourceInfoModel.count({ where });

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: resources,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total
      }
    };
  } catch (error) {
    console.error('Error getting resource infos:', error);

    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to get resource infos',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * 根据ID获取资源信息
 * @param ctx Koa上下文
 */
export const getResourceInfoById = async (ctx) => {
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

    const resource = await ResourceInfoModel.findById(idNum);

    if (!resource) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: 'Resource info not found'
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: resource
    };
  } catch (error) {
    console.error('Error getting resource info by ID:', error);

    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to get resource info',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * 删除资源信息
 * @param ctx Koa上下文
 */
export const deleteResourceInfo = async (ctx) => {
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

    const result = await ResourceInfoModel.deleteById(idNum);

    if (!result) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: 'Resource info not found'
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Resource info deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting resource info:', error);

    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to delete resource info',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};