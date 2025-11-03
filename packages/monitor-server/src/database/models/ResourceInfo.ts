import { db } from '../index';

export interface IResourceInfo {
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
  // Resource specific fields
  name: string;
  entry_type: string;
  start_time: number;
  duration: number;
  initiator_type: string;
  next_hop_protocol: string;
  worker_start: number;
  redirect_start: number;
  redirect_end: number;
  fetch_start: number;
  domain_lookup_start: number;
  domain_lookup_end: number;
  connect_start: number;
  connect_end: number;
  secure_connection_start: number;
  request_start: number;
  response_start: number;
  response_end: number;
  transfer_size: number;
  encoded_body_size: number;
  decoded_body_size: number;
  server_timing: string;
  cached: string;
  created_at?: Date;
  updated_at?: Date;
}

export class ResourceInfoModel {
  /**
   * 创建资源信息
   */
  static async create(resourceInfo: IResourceInfo): Promise<IResourceInfo> {
    const stmt = db.prepare(`
      INSERT INTO resource_info (
        platform, plugin_name, message, page, timestamp, date, level,
        device_width, device_height, device_pixel_ratio, fingerprint, old_fingerprint, ip,
        name, entry_type, start_time, duration, initiator_type, next_hop_protocol,
        worker_start, redirect_start, redirect_end, fetch_start,
        domain_lookup_start, domain_lookup_end, connect_start, connect_end,
        secure_connection_start, request_start, response_start, response_end,
        transfer_size, encoded_body_size, decoded_body_size, server_timing, cached
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      resourceInfo.platform,
      resourceInfo.plugin_name,
      resourceInfo.message,
      resourceInfo.page,
      resourceInfo.timestamp,
      resourceInfo.date,
      resourceInfo.level,
      resourceInfo.device_width,
      resourceInfo.device_height,
      resourceInfo.device_pixel_ratio,
      resourceInfo.fingerprint,
      resourceInfo.old_fingerprint,
      resourceInfo.ip,
      resourceInfo.name,
      resourceInfo.entry_type,
      resourceInfo.start_time,
      resourceInfo.duration,
      resourceInfo.initiator_type,
      resourceInfo.next_hop_protocol,
      resourceInfo.worker_start,
      resourceInfo.redirect_start,
      resourceInfo.redirect_end,
      resourceInfo.fetch_start,
      resourceInfo.domain_lookup_start,
      resourceInfo.domain_lookup_end,
      resourceInfo.connect_start,
      resourceInfo.connect_end,
      resourceInfo.secure_connection_start,
      resourceInfo.request_start,
      resourceInfo.response_start,
      resourceInfo.response_end,
      resourceInfo.transfer_size,
      resourceInfo.encoded_body_size,
      resourceInfo.decoded_body_size,
      resourceInfo.server_timing,
      resourceInfo.cached
    );

    return {
      ...resourceInfo,
      id: info.lastInsertRowid as number
    };
  }

  /**
   * 批量创建资源信息
   */
  static async createBatch(resources: IResourceInfo[]): Promise<void> {
    const stmt = db.prepare(`
      INSERT INTO resource_info (
        platform, plugin_name, message, page, timestamp, date, level,
        device_width, device_height, device_pixel_ratio, fingerprint, old_fingerprint, ip,
        name, entry_type, start_time, duration, initiator_type, next_hop_protocol,
        worker_start, redirect_start, redirect_end, fetch_start,
        domain_lookup_start, domain_lookup_end, connect_start, connect_end,
        secure_connection_start, request_start, response_start, response_end,
        transfer_size, encoded_body_size, decoded_body_size, server_timing, cached
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((resources: IResourceInfo[]) => {
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
          resource.name,
          resource.entry_type,
          resource.start_time,
          resource.duration,
          resource.initiator_type,
          resource.next_hop_protocol,
          resource.worker_start,
          resource.redirect_start,
          resource.redirect_end,
          resource.fetch_start,
          resource.domain_lookup_start,
          resource.domain_lookup_end,
          resource.connect_start,
          resource.connect_end,
          resource.secure_connection_start,
          resource.request_start,
          resource.response_start,
          resource.response_end,
          resource.transfer_size,
          resource.encoded_body_size,
          resource.decoded_body_size,
          resource.server_timing,
          resource.cached
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
  } = {}): Promise<IResourceInfo[]> {
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
    return stmt.all(...params) as IResourceInfo[];
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
  static async findById(id: number): Promise<IResourceInfo | null> {
    const stmt = db.prepare('SELECT * FROM resource WHERE id = ?');
    const result = stmt.get(id);
    return result as IResourceInfo || null;
  }

  /**
   * 根据ID更新资源信息
   */
  static async updateById(id: number, resourceInfo: Partial<IResourceInfo>): Promise<boolean> {
    const fields: string[] = [];
    const params: any[] = [];

    // 构建更新字段
    for (const key in resourceInfo) {
      if (resourceInfo.hasOwnProperty(key) && resourceInfo[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(resourceInfo[key]);
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