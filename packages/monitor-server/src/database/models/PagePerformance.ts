import { db } from '../index';

export interface IPagePerformanceInfo {
    id?: number;
    platform: string;
    plugin_name: string;
    message: string;
    page: string;
    timestamp: number;
    date: string;
    level: string;
    device_width: number;
    device_height: number;
    device_pixel_ratio: number;
    fingerprint: string;
    old_fingerprint: string;
    ip: string;
    metric_type: string;
    value: number;
    navigation_type: string;
    rating: string;
    page_start_time: number;
    page_end_time: number;
    white_screen_duration: number;
    status: string;
    selectors: string;
    created_at?: Date;
    updated_at?: Date;
}

export class PagePerformanceInfoModel {
    /**
     * 创建资源信息
     */
    static async create(PagePerformanceInfo: IPagePerformanceInfo): Promise<IPagePerformanceInfo> {
        const stmt = db.prepare(`
      INSERT INTO page_performance (
        platform, plugin_name, message, page, timestamp, date, level,
        device_width, device_height, device_pixel_ratio, fingerprint, old_fingerprint, ip,
        metric_type, value, navigation_type, rating,
        page_start_time, page_end_time, white_screen_duration, status, selectors
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const info = stmt.run(
            PagePerformanceInfo.platform,
            PagePerformanceInfo.plugin_name,
            PagePerformanceInfo.message,
            PagePerformanceInfo.page,
            PagePerformanceInfo.timestamp,
            PagePerformanceInfo.date,
            PagePerformanceInfo.level,
            PagePerformanceInfo.device_width,
            PagePerformanceInfo.device_height,
            PagePerformanceInfo.device_pixel_ratio,
            PagePerformanceInfo.fingerprint,
            PagePerformanceInfo.old_fingerprint,
            PagePerformanceInfo.ip,
            PagePerformanceInfo.metric_type,
            PagePerformanceInfo.value,
            PagePerformanceInfo.navigation_type,
            PagePerformanceInfo.rating,
            PagePerformanceInfo.page_start_time,
            PagePerformanceInfo.page_end_time,
            PagePerformanceInfo.white_screen_duration,
            PagePerformanceInfo.status,
            PagePerformanceInfo.selectors,
        );

        return {
            ...PagePerformanceInfo,
            id: info.lastInsertRowid as number
        };
    }

    /**
     * 批量创建资源信息
     */
    static async createBatch(resources: IPagePerformanceInfo[]): Promise<void> {
        const stmt = db.prepare(`
      INSERT INTO page_performance (
        platform, plugin_name, message, page, timestamp, date, level,
        device_width, device_height, device_pixel_ratio, fingerprint, old_fingerprint, ip,
        metric_type, value, navigation_type, rating,
        page_start_time, page_end_time, white_screen_duration, status, selectors
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const insertMany = db.transaction((resources: IPagePerformanceInfo[]) => {
            for (const resource of resources) {
                stmt.run(
                    resource.platform,
                    resource.plugin_name,
                    resource.message,
                    resource.page,
                    resource.timestamp,
                    resource.date,
                    resource.level,
                    resource.device_width,
                    resource.device_height,
                    resource.device_pixel_ratio,
                    resource.fingerprint,
                    resource.old_fingerprint,
                    resource.ip,
                    resource.metric_type,
                    resource.value,
                    resource.navigation_type,
                    resource.rating,
                    resource.page_start_time,
                    resource.page_end_time,
                    resource.white_screen_duration,
                    resource.status,
                    resource.selectors,
                );
            }
        });

        insertMany(resources);
    }

    /**
     * 根据条件查找资源信息
     */
    static async findAll(options: {
        where?: any;
        limit?: number;
        offset?: number;
        order?: string[][];
    } = {}): Promise<IPagePerformanceInfo[]> {
        let sql = 'SELECT * FROM resource';
        const params: any[] = [];

        // 构建 WHERE 条件
        if (options.where) {
            const whereConditions: string[] = [];
            for (const key in options.where) {
                if (options.where.hasOwnProperty(key)) {
                    whereConditions.push(`${key} = ?`);
                    params.push(options.where[key]);
                }
            }

            if (whereConditions.length > 0) {
                sql += ` WHERE ${whereConditions.join(' AND ')}`;
            }
        }

        // 处理排序
        if (options.order && options.order.length > 0) {
            const orderConditions = options.order.map(([field, direction]) => `${field} ${direction}`);
            sql += ` ORDER BY ${orderConditions.join(', ')}`;
        }

        // 处理分页
        if (options.limit) {
            sql += ` LIMIT ${options.limit}`;
            if (options.offset) {
                sql += ` OFFSET ${options.offset}`;
            }
        }

        const stmt = db.prepare(sql);
        return stmt.all(...params) as IPagePerformanceInfo[];
    }

    /**
     * 根据条件统计数量
     */
    static async count(options: { where?: any } = {}): Promise<number> {
        let sql = 'SELECT COUNT(*) as count FROM resource';
        const params: any[] = [];

        if (options.where) {
            const whereConditions: string[] = [];
            for (const key in options.where) {
                if (options.where.hasOwnProperty(key)) {
                    whereConditions.push(`${key} = ?`);
                    params.push(options.where[key]);
                }
            }

            if (whereConditions.length > 0) {
                sql += ` WHERE ${whereConditions.join(' AND ')}`;
            }
        }

        const stmt = db.prepare(sql);
        const result = stmt.get(...params) as { count: number };
        return result.count;
    }

    /**
     * 根据ID查找单个资源信息
     */
    static async findById(id: number): Promise<IPagePerformanceInfo | null> {
        const stmt = db.prepare('SELECT * FROM resource WHERE id = ?');
        const result = stmt.get(id);
        return result as IPagePerformanceInfo || null;
    }

    /**
     * 根据ID更新资源信息
     */
    static async updateById(id: number, PagePerformanceInfo: Partial<IPagePerformanceInfo>): Promise<boolean> {
        const fields: string[] = [];
        const params: any[] = [];

        // 构建更新字段
        for (const key in PagePerformanceInfo) {
            if (PagePerformanceInfo.hasOwnProperty(key) && PagePerformanceInfo[key] !== undefined) {
                fields.push(`${key} = ?`);
                params.push(PagePerformanceInfo[key]);
            }
        }

        if (fields.length === 0) {
            return false;
        }

        params.push(id);
        const sql = `UPDATE resource SET ${fields.join(', ')} WHERE id = ?`;
        const stmt = db.prepare(sql);
        const info = stmt.run(...params);

        return (info.changes || 0) > 0;
    }

    /**
     * 根据ID删除资源信息
     */
    static async deleteById(id: number): Promise<boolean> {
        const stmt = db.prepare('DELETE FROM resource WHERE id = ?');
        const info = stmt.run(id);
        return (info.changes || 0) > 0;
    }
}