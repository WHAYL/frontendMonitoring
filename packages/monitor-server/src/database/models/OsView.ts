import { db } from '../index';

export interface IOsViewInfo {
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
    uv: string;  // 修正为字符串类型
    vv: number;
    pv: string;  // 修正为字符串类型
    o_ip: string;
    created_at?: Date;
    updated_at?: Date;
}

export class OsViewInfoModel {
    /**
     * 创建资源信息
     */
    static async create(OsViewInfo: IOsViewInfo): Promise<IOsViewInfo> {
        const stmt = db.prepare(`
      INSERT INTO os_view (
        platform, plugin_name, message, page, timestamp, date, level,
        device_width, device_height, device_pixel_ratio, fingerprint, old_fingerprint, ip,
        uv, vv, pv, o_ip
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const info = stmt.run(
            OsViewInfo.platform,
            OsViewInfo.plugin_name,
            OsViewInfo.message,
            OsViewInfo.page,
            OsViewInfo.timestamp,
            OsViewInfo.date,
            OsViewInfo.level,
            OsViewInfo.device_width,
            OsViewInfo.device_height,
            OsViewInfo.device_pixel_ratio,
            OsViewInfo.fingerprint,
            OsViewInfo.old_fingerprint,
            OsViewInfo.ip,
            OsViewInfo.uv,  // 已经是字符串
            OsViewInfo.vv,
            OsViewInfo.pv,  // 已经是字符串
            OsViewInfo.o_ip,
        );

        return {
            ...OsViewInfo,
            id: info.lastInsertRowid as number
        };
    }

    /**
     * 批量创建资源信息
     */
    static async createBatch(resources: IOsViewInfo[]): Promise<void> {
        const stmt = db.prepare(`
      INSERT INTO os_view (
        platform, plugin_name, message, page, timestamp, date, level,
        device_width, device_height, device_pixel_ratio, fingerprint, old_fingerprint, ip,
        uv, vv, pv, o_ip
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const insertMany = db.transaction((resources: IOsViewInfo[]) => {
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
                    resource.uv,  // 已经是字符串
                    resource.vv,
                    resource.pv,  // 已经是字符串
                    resource.o_ip,
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
    } = {}): Promise<IOsViewInfo[]> {
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
        return stmt.all(...params) as IOsViewInfo[];
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
    static async findById(id: number): Promise<IOsViewInfo | null> {
        const stmt = db.prepare('SELECT * FROM resource WHERE id = ?');
        const result = stmt.get(id);
        return result as IOsViewInfo || null;
    }

    /**
     * 根据ID更新资源信息
     */
    static async updateById(id: number, OsViewInfo: Partial<IOsViewInfo>): Promise<boolean> {
        const fields: string[] = [];
        const params: any[] = [];

        // 构建更新字段
        for (const key in OsViewInfo) {
            if (OsViewInfo.hasOwnProperty(key) && OsViewInfo[key] !== undefined) {
                fields.push(`${key} = ?`);
                params.push(OsViewInfo[key]);
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