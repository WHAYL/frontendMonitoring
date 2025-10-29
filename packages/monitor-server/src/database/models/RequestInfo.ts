import { db } from '../index';

export interface IRequestInfo {
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
  url: string;
  method: string;
  start_time: number;
  end_time: number;
  duration: number;
  error_info: string;
  created_at?: Date;
  updated_at?: Date;
}

export class RequestInfoModel {
  /**
   * 创建请求信息
   */
  static async create(requestInfo: IRequestInfo): Promise<IRequestInfo> {
    const stmt = db.prepare(`
      INSERT INTO request_info (
        platform, plugin_name, message, page, timestamp, date, level,
        device_width, device_height, device_pixel_ratio, fingerprint, old_fingerprint, ip,
        url, method, start_time, end_time, duration, error_info
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      requestInfo.platform,
      requestInfo.plugin_name,
      requestInfo.message,
      requestInfo.page,
      requestInfo.timestamp,
      requestInfo.date,
      requestInfo.level,
      requestInfo.device_width,
      requestInfo.device_height,
      requestInfo.device_pixel_ratio,
      requestInfo.fingerprint,
      requestInfo.old_fingerprint,
      requestInfo.ip,
      requestInfo.url,
      requestInfo.method,
      requestInfo.start_time,
      requestInfo.end_time,
      requestInfo.duration,
      requestInfo.error_info
    );

    return {
      ...requestInfo,
      id: info.lastInsertRowid as number
    };
  }

  /**
   * 批量创建请求信息
   */
  static async createBatch(requests: IRequestInfo[]): Promise<void> {
    const stmt = db.prepare(`
      INSERT INTO request_info (
        platform, plugin_name, message, page, timestamp, date, level,
        device_width, device_height, device_pixel_ratio, fingerprint, old_fingerprint, ip,
        url, method, start_time, end_time, duration, error_info
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((requests: IRequestInfo[]) => {
      for (const request of requests) {
        stmt.run(
          request.platform,
          request.plugin_name,
          request.message,
          request.page,
          request.timestamp,
          request.date,
          request.level,
          request.device_width,
          request.device_height,
          request.device_pixel_ratio,
          request.fingerprint,
          request.old_fingerprint,
          request.ip,
          request.url,
          request.method,
          request.start_time,
          request.end_time,
          request.duration,
          request.error_info
        );
      }
    });

    insertMany(requests);
  }

  /**
   * 根据条件查找请求信息
   */
  static async findAll(options: {
    where?: any;
    limit?: number;
    offset?: number;
    order?: string[][];
  } = {}): Promise<IRequestInfo[]> {
    let sql = 'SELECT * FROM request_info';
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
    return stmt.all(...params) as IRequestInfo[];
  }

  /**
   * 根据条件统计数量
   */
  static async count(options: { where?: any } = {}): Promise<number> {
    let sql = 'SELECT COUNT(*) as count FROM request_info';
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
   * 根据ID查找单个请求信息
   */
  static async findById(id: number): Promise<IRequestInfo | null> {
    const stmt = db.prepare('SELECT * FROM request_info WHERE id = ?');
    const result = stmt.get(id);
    return result as IRequestInfo || null;
  }

  /**
   * 根据ID更新请求信息
   */
  static async updateById(id: number, requestInfo: Partial<IRequestInfo>): Promise<boolean> {
    const fields: string[] = [];
    const params: any[] = [];

    // 构建更新字段
    for (const key in requestInfo) {
      if (requestInfo.hasOwnProperty(key) && requestInfo[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(requestInfo[key]);
      }
    }

    if (fields.length === 0) {
      return false;
    }

    params.push(id);
    const sql = `UPDATE request_info SET ${fields.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(sql);
    const info = stmt.run(...params);

    return (info.changes || 0) > 0;
  }

  /**
   * 根据ID删除请求信息
   */
  static async deleteById(id: number): Promise<boolean> {
    const stmt = db.prepare('DELETE FROM request_info WHERE id = ?');
    const info = stmt.run(id);
    return (info.changes || 0) > 0;
  }
}