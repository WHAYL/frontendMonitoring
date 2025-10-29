import { db } from '../index';

export interface IPageLifecycle {
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
  change_type: string;
  enter_time: number;
  leave_time: number;
  current_route: string;
  previous_route: string;
  route: string;
  target: string;
  duration: number;
  created_at?: Date;
  updated_at?: Date;
}

export class PageLifecycleModel {
  /**
   * 创建页面生命周期信息
   */
  static async create(pageLifecycle: IPageLifecycle): Promise<IPageLifecycle> {
    const stmt = db.prepare(`
      INSERT INTO page_lifecycle (
        platform, plugin_name, message, page, timestamp, date, level,
        device_width, device_height, device_pixel_ratio, fingerprint, old_fingerprint, ip,
        change_type, enter_time, leave_time, current_route, previous_route, route, target, duration
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      pageLifecycle.platform,
      pageLifecycle.plugin_name,
      pageLifecycle.message,
      pageLifecycle.page,
      pageLifecycle.timestamp,
      pageLifecycle.date,
      pageLifecycle.level,
      pageLifecycle.device_width,
      pageLifecycle.device_height,
      pageLifecycle.device_pixel_ratio,
      pageLifecycle.fingerprint,
      pageLifecycle.old_fingerprint,
      pageLifecycle.ip,
      pageLifecycle.change_type,
      pageLifecycle.enter_time,
      pageLifecycle.leave_time,
      pageLifecycle.current_route,
      pageLifecycle.previous_route,
      pageLifecycle.route,
      pageLifecycle.target,
      pageLifecycle.duration
    );

    return {
      ...pageLifecycle,
      id: info.lastInsertRowid as number
    };
  }

  /**
   * 批量创建页面生命周期信息
   */
  static async createBatch(lifecycles: IPageLifecycle[]): Promise<void> {
    const stmt = db.prepare(`
      INSERT INTO page_lifecycle (
        platform, plugin_name, message, page, timestamp, date, level,
        device_width, device_height, device_pixel_ratio, fingerprint, old_fingerprint, ip,
        change_type, enter_time, leave_time, current_route, previous_route, route, target, duration
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((lifecycles: IPageLifecycle[]) => {
      for (const lifecycle of lifecycles) {
        stmt.run(
          lifecycle.platform,
          lifecycle.plugin_name,
          lifecycle.message,
          lifecycle.page,
          lifecycle.timestamp,
          lifecycle.date,
          lifecycle.level,
          lifecycle.device_width,
          lifecycle.device_height,
          lifecycle.device_pixel_ratio,
          lifecycle.fingerprint,
          lifecycle.old_fingerprint,
          lifecycle.ip,
          lifecycle.change_type,
          lifecycle.enter_time,
          lifecycle.leave_time,
          lifecycle.current_route,
          lifecycle.previous_route,
          lifecycle.route,
          lifecycle.target,
          lifecycle.duration
        );
      }
    });

    insertMany(lifecycles);
  }

  /**
   * 根据条件查找页面生命周期信息
   */
  static async findAll(options: {
    where?: any;
    limit?: number;
    offset?: number;
    order?: string[][];
  } = {}): Promise<IPageLifecycle[]> {
    let sql = 'SELECT * FROM page_lifecycle';
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
    return stmt.all(...params) as IPageLifecycle[];
  }

  /**
   * 根据条件统计数量
   */
  static async count(options: { where?: any } = {}): Promise<number> {
    let sql = 'SELECT COUNT(*) as count FROM page_lifecycle';
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
   * 根据ID查找单个页面生命周期信息
   */
  static async findById(id: number): Promise<IPageLifecycle | null> {
    const stmt = db.prepare('SELECT * FROM page_lifecycle WHERE id = ?');
    const result = stmt.get(id);
    return result as IPageLifecycle || null;
  }

  /**
   * 根据ID更新页面生命周期信息
   */
  static async updateById(id: number, pageLifecycle: Partial<IPageLifecycle>): Promise<boolean> {
    const fields: string[] = [];
    const params: any[] = [];

    // 构建更新字段
    for (const key in pageLifecycle) {
      if (pageLifecycle.hasOwnProperty(key) && pageLifecycle[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(pageLifecycle[key]);
      }
    }

    if (fields.length === 0) {
      return false;
    }

    params.push(id);
    const sql = `UPDATE page_lifecycle SET ${fields.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(sql);
    const info = stmt.run(...params);

    return (info.changes || 0) > 0;
  }

  /**
   * 根据ID删除页面生命周期信息
   */
  static async deleteById(id: number): Promise<boolean> {
    const stmt = db.prepare('DELETE FROM page_lifecycle WHERE id = ?');
    const info = stmt.run(id);
    return (info.changes || 0) > 0;
  }
}