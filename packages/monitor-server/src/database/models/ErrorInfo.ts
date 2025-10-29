import { db } from '../index';

export interface IErrorInfo {
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
  error_info: string;
  created_at?: Date;
  updated_at?: Date;
}

export class ErrorInfoModel {
  /**
   * 创建错误信息
   */
  static async create(errorInfo: IErrorInfo): Promise<IErrorInfo> {
    const stmt = db.prepare(`
      INSERT INTO error_info (
        platform, plugin_name, message, page, timestamp, date, level,
        device_width, device_height, device_pixel_ratio, fingerprint, old_fingerprint, ip, error_info
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      errorInfo.platform,
      errorInfo.plugin_name,
      errorInfo.message,
      errorInfo.page,
      errorInfo.timestamp,
      errorInfo.date,
      errorInfo.level,
      errorInfo.device_width,
      errorInfo.device_height,
      errorInfo.device_pixel_ratio,
      errorInfo.fingerprint,
      errorInfo.old_fingerprint,
      errorInfo.ip,
      errorInfo.error_info
    );

    return {
      ...errorInfo,
      id: info.lastInsertRowid as number
    };
  }

  /**
   * 批量创建错误信息
   */
  static async createBatch(errors: IErrorInfo[]): Promise<void> {
    const stmt = db.prepare(`
      INSERT INTO error_info (
        platform, plugin_name, message, page, timestamp, date, level,
        device_width, device_height, device_pixel_ratio, fingerprint, old_fingerprint, ip, error_info
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((errors: IErrorInfo[]) => {
      for (const error of errors) {
        stmt.run(
          error.platform,
          error.plugin_name,
          error.message,
          error.page,
          error.timestamp,
          error.date,
          error.level,
          error.device_width,
          error.device_height,
          error.device_pixel_ratio,
          error.fingerprint,
          error.old_fingerprint,
          error.ip,
          error.error_info
        );
      }
    });

    insertMany(errors);
  }

  /**
   * 根据条件查找错误信息
   */
  static async findAll(options: {
    where?: any;
    limit?: number;
    offset?: number;
    order?: string[][];
  } = {}): Promise<IErrorInfo[]> {
    let sql = 'SELECT * FROM error_info';
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
    return stmt.all(...params) as IErrorInfo[];
  }

  /**
   * 根据条件统计数量
   */
  static async count(options: { where?: any } = {}): Promise<number> {
    let sql = 'SELECT COUNT(*) as count FROM error_info';
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
   * 根据ID查找单个错误信息
   */
  static async findById(id: number): Promise<IErrorInfo | null> {
    const stmt = db.prepare('SELECT * FROM error_info WHERE id = ?');
    const result = stmt.get(id);
    return result as IErrorInfo || null;
  }

  /**
   * 根据ID更新错误信息
   */
  static async updateById(id: number, errorInfo: Partial<IErrorInfo>): Promise<boolean> {
    const fields: string[] = [];
    const params: any[] = [];

    // 构建更新字段
    for (const key in errorInfo) {
      if (errorInfo.hasOwnProperty(key) && errorInfo[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(errorInfo[key]);
      }
    }

    if (fields.length === 0) {
      return false;
    }

    params.push(id);
    const sql = `UPDATE error_info SET ${fields.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(sql);
    const info = stmt.run(...params);

    return (info.changes || 0) > 0;
  }

  /**
   * 根据ID删除错误信息
   */
  static async deleteById(id: number): Promise<boolean> {
    const stmt = db.prepare('DELETE FROM error_info WHERE id = ?');
    const info = stmt.run(id);
    return (info.changes || 0) > 0;
  }
}