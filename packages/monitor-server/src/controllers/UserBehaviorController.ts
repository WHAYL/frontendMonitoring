import { Context } from 'koa';
import { UserBehaviorInfoModel, IUserBehaviorInfo } from '../database/models/UserBehavior';

/**
 * 处理单条资源信息数据
 * @param ctx Koa上下文
 * @param resourceData 资源数据
 */
const handleSingleUserBehaviorInfo = async (ctx, resourceData: any) => {
    // 构造完整的资源信息
    const UserBehaviorInfo: IUserBehaviorInfo = {
        // 基础字段 (来自resourceData根层级)
        ...resourceData,
        // Resource specific fields (都来自extraData对象)
        x: resourceData.extraData?.x || 0,
        y: resourceData.extraData?.y || 0,
        scrollX: resourceData.extraData?.scrollX || 0,
        scrollY: resourceData.extraData?.scrollY || 0,
        local_name: resourceData.extraData?.localName || '',
        class_name: resourceData.extraData?.className || '',
        class_list: resourceData.extraData?.classList || '',
        dom_id: resourceData.extraData?.domId || '',
        node_name: resourceData.extraData?.nodeName || '',
        tag_name: resourceData.extraData?.tagName || '',
        data_set: resourceData.extraData?.dataset || '',
        path: JSON.stringify(resourceData.extraData?.path) || '',
    };

    // 保存到数据库
    const result = await UserBehaviorInfoModel.create(UserBehaviorInfo);

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
const handleBatchUserBehaviorInfo = async (ctx, resourcesData: any[]) => {
    if (!Array.isArray(resourcesData)) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: 'Request body should be an array of resource data'
        };
        return;
    }

    // 构造完整的资源信息数组
    const resources: IUserBehaviorInfo[] = resourcesData.map(resourceData => ({
        // 基础字段 (来自resourceData根层级)
        ...resourceData,
        // Resource specific fields (都来自extraData对象)
        x: resourceData.extraData?.x || 0,
        y: resourceData.extraData?.y || 0,
        scrollX: resourceData.extraData?.scrollX || 0,
        scrollY: resourceData.extraData?.scrollY || 0,
        local_name: resourceData.extraData?.localName || '',
        class_name: resourceData.extraData?.className || '',
        class_list: resourceData.extraData?.classList || '',
        dom_id: resourceData.extraData?.domId || '',
        node_name: resourceData.extraData?.nodeName || '',
        tag_name: resourceData.extraData?.tagName || '',
        data_set: resourceData.extraData?.dataset || '',
        path: JSON.stringify(resourceData.extraData?.path) || '',
    }));

    // 批量保存到数据库
    await UserBehaviorInfoModel.createBatch(resources);

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
export const handleUserBehaviorInfo = async (ctx, reportInfo) => {
    try {
        if (Array.isArray(reportInfo)) {
            await handleBatchUserBehaviorInfo(ctx, reportInfo);
        } else {
            await handleSingleUserBehaviorInfo(ctx, reportInfo);
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
export const getUserBehaviorInfos = async (ctx) => {
    try {
        const { page = 1, limit = 10, ...where } = ctx.query;

        // 转换分页参数
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const offset = (pageNum - 1) * limitNum;

        // 查询数据
        const resources = await UserBehaviorInfoModel.findAll({
            where,
            limit: limitNum,
            offset,
            order: [['id', 'DESC']]
        });

        // 查询总数
        const total = await UserBehaviorInfoModel.count({ where });

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
export const getUserBehaviorInfoById = async (ctx) => {
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

        const resource = await UserBehaviorInfoModel.findById(idNum);

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
export const deleteUserBehaviorInfo = async (ctx) => {
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

        const result = await UserBehaviorInfoModel.deleteById(idNum);

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