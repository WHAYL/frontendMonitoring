import { db } from '../index';

export interface IUserBehaviorInfo {
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
    x: number;
    y: number;
    scrollX: number;
    scrollY: number;
    local_name: string;
    class_name: string;
    class_list: string;
    dom_id: string;
    node_name: string;
    tag_name: string;
    data_set: string;
    path: string;
    created_at?: Date;
    updated_at?: Date;
}

export class UserBehaviorInfoModel {
    /**
     * 创建资源信息
     */
    static async create(UserBehaviorInfo: IUserBehaviorInfo): Promise<IUserBehaviorInfo> {
        const stmt = db.prepare(`
      INSERT INTO user_behavior (
        platform, plugin_name, message, page, timestamp, date, level,
        device_width, device_height, device_pixel_ratio, fingerprint, old_fingerprint, ip,
        x, y, scrollX, scrollY, local_name, class_name, class_list, dom_id, node_name, tag_name, data_set, path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const info = stmt.run(
            UserBehaviorInfo.platform,
            UserBehaviorInfo.plugin_name,
            UserBehaviorInfo.message,
            UserBehaviorInfo.page,
            UserBehaviorInfo.timestamp,
            UserBehaviorInfo.date,
            UserBehaviorInfo.level,
            UserBehaviorInfo.device_width,
            UserBehaviorInfo.device_height,
            UserBehaviorInfo.device_pixel_ratio,
            UserBehaviorInfo.fingerprint,
            UserBehaviorInfo.old_fingerprint,
            UserBehaviorInfo.ip,
            UserBehaviorInfo.x,
            UserBehaviorInfo.y,
            UserBehaviorInfo.scrollX,
            UserBehaviorInfo.scrollY,
            UserBehaviorInfo.local_name,
            UserBehaviorInfo.class_name,
            UserBehaviorInfo.class_list,
            UserBehaviorInfo.dom_id,
            UserBehaviorInfo.node_name,
            UserBehaviorInfo.tag_name,
            UserBehaviorInfo.data_set,
            UserBehaviorInfo.path,
        );

        return {
            ...UserBehaviorInfo,
            id: info.lastInsertRowid as number
        };
    }

    /**
     * 批量创建资源信息
     */
    static async createBatch(resources: IUserBehaviorInfo[]): Promise<void> {
        const stmt = db.prepare(`
      INSERT INTO resource (
        platform, plugin_name, message, page, timestamp, date, level,
        device_width, device_height, device_pixel_ratio, fingerprint, old_fingerprint, ip,
        x, y, scrollX, scrollY, local_name, class_name, class_list, dom_id, node_name, tag_name, data_set, path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const insertMany = db.transaction((resources: IUserBehaviorInfo[]) => {
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
                    resource.x,
                    resource.y,
                    resource.scrollX,
                    resource.scrollY,
                    resource.local_name,
                    resource.class_name,
                    resource.class_list,
                    resource.dom_id,
                    resource.node_name,
                    resource.tag_name,
                    resource.data_set,
                    resource.path,
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
    } = {}): Promise<IUserBehaviorInfo[]> {
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
        return stmt.all(...params) as IUserBehaviorInfo[];
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
    static async findById(id: number): Promise<IUserBehaviorInfo | null> {
        const stmt = db.prepare('SELECT * FROM resource WHERE id = ?');
        const result = stmt.get(id);
        return result as IUserBehaviorInfo || null;
    }

    /**
     * 根据ID更新资源信息
     */
    static async updateById(id: number, UserBehaviorInfo: Partial<IUserBehaviorInfo>): Promise<boolean> {
        const fields: string[] = [];
        const params: any[] = [];

        // 构建更新字段
        for (const key in UserBehaviorInfo) {
            if (UserBehaviorInfo.hasOwnProperty(key) && UserBehaviorInfo[key] !== undefined) {
                fields.push(`${key} = ?`);
                params.push(UserBehaviorInfo[key]);
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