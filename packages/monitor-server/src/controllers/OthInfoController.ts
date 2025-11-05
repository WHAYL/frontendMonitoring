import { Context } from 'koa';
import { OthInfoModel, IOthInfo } from '../database/models/OthInfo';
import { XhrExtraData } from '../../../monitor-browser/lib/types/type';

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
 * 处理单条错误信息数据
 * @param ctx Koa上下文
 * @param errorData 错误数据
 * @param ip 客户端IP
 */
const handleSingleOthInfo = async (ctx, errorData: any) => {
    // 构造完整的错误信息
    const errorInfo: IOthInfo = {
        ...errorData,
        extra_data: JSON.stringify(errorData.extraData) || ''
    };

    // 保存到数据库
    const result = await OthInfoModel.create(errorInfo);

    // 返回成功响应
    ctx.status = 200;
    ctx.body = {
        success: true,
        message: 'Error info saved successfully',
        data: result
    };
};

/**
 * 处理批量错误信息数据
 * @param ctx Koa上下文
 * @param errorsData 错误数据数组
 * @param ip 客户端IP
 */
const handleBatchOthInfo = async (ctx, errorsData: any[]) => {
    if (!Array.isArray(errorsData)) {
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: 'Request body should be an array of error data'
        };
        return;
    }

    // 构造完整的错误信息数组
    const errors: IOthInfo[] = errorsData.map(errorData => ({
        ...errorData,
        extra_data: JSON.stringify(errorData.extraData) || ''
    }));

    // 批量保存到数据库
    await OthInfoModel.createBatch(errors);

    // 返回成功响应
    ctx.status = 200;
    ctx.body = {
        success: true,
        message: 'Batch error info saved successfully',
        count: errors.length
    };
};

/**
 * 处理错误信息数据
 * @param ctx Koa上下文
 */
export const handleOthInfo = async (ctx, reportInfo) => {
    try {

        if (Array.isArray(reportInfo)) {
            await handleBatchOthInfo(ctx, reportInfo);
        } else {
            await handleSingleOthInfo(ctx, reportInfo);
        }
    } catch (error) {
        console.error('Error processing error info data:', error);

        // 返回错误响应
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Failed to process error info data',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};

/**
 * 获取所有错误信息
 * @param ctx Koa上下文
 */
export const getOthInfos = async (ctx) => {
    try {
        const { page = 1, limit = 10, ...where } = ctx.query;

        // 转换分页参数
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const offset = (pageNum - 1) * limitNum;

        // 查询数据
        const errors = await OthInfoModel.findAll({
            where,
            limit: limitNum,
            offset,
            order: [['id', 'DESC']]
        });

        // 查询总数
        const total = await OthInfoModel.count({ where });

        ctx.status = 200;
        ctx.body = {
            success: true,
            data: errors,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total
            }
        };
    } catch (error) {
        console.error('Error getting error infos:', error);

        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Failed to get error infos',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};

/**
 * 根据ID获取错误信息
 * @param ctx Koa上下文
 */
export const getOthInfoById = async (ctx) => {
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

        const error = await OthInfoModel.findById(idNum);

        if (!error) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Error info not found'
            };
            return;
        }

        ctx.status = 200;
        ctx.body = {
            success: true,
            data: error
        };
    } catch (error) {
        console.error('Error getting error info by ID:', error);

        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Failed to get error info',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};

/**
 * 删除错误信息
 * @param ctx Koa上下文
 */
export const deleteOthInfo = async (ctx) => {
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

        const result = await OthInfoModel.deleteById(idNum);

        if (!result) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Error info not found'
            };
            return;
        }

        ctx.status = 200;
        ctx.body = {
            success: true,
            message: 'Error info deleted successfully'
        };
    } catch (error) {
        console.error('Error deleting error info:', error);

        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Failed to delete error info',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};