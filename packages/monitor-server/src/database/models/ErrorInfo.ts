import { db } from '../index';

export interface IErrorInfo {
  id?: number;
  level: string;
  message: string;
  stack?: string;
  timestamp: number;
  date: string;
  url: string;
  userId?: string;
  pluginName?: string;
  fingerprint?: string;
  userAgent?: string;
  devicePixelRatio?: number;
  extraData?: any;
  // 新增字段用于更详细的分析
  platform?: string;           // 平台信息 (web, uniapp, etc.)
  os?: string;                 // 操作系统
  browser?: string;            // 浏览器
  viewportWidth?: number;      // 视口宽度
  viewportHeight?: number;     // 视口高度
  screenWidth?: number;        // 屏幕宽度
  screenHeight?: number;       // 屏幕高度
  networkType?: string;        // 网络类型
  pageStayTime?: number;       // 页面停留时间
  routeFrom?: string;          // 来源路由
  routeTo?: string;            // 目标路由
  eventType?: string;          // 事件类型
  eventTarget?: string;        // 事件目标
  resourceUrl?: string;        // 资源URL
  resourceType?: string;       // 资源类型
  loadTime?: number;           // 加载时间
  httpStatus?: number;         // HTTP状态码
  createdAt?: Date;
  updatedAt?: Date;
}

export class ErrorInfoModel {
  /**
   * 创建错误信息
   */
  static async create(errorInfo: IErrorInfo): Promise<IErrorInfo> {
    const stmt = db.prepare(`
      INSERT INTO error_info (
        level, message, stack, timestamp, date, url, user_id, plugin_name, 
        fingerprint, user_agent, device_pixel_ratio, extra_data,
        platform, os, browser, viewport_width, viewport_height, screen_width,
        screen_height, network_type, page_stay_time, route_from, route_to,
        event_type, event_target, resource_url, resource_type, load_time, http_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      errorInfo.level,
      errorInfo.message,
      errorInfo.stack,
      errorInfo.timestamp,
      errorInfo.date,
      errorInfo.url,
      errorInfo.userId,
      errorInfo.pluginName,
      errorInfo.fingerprint,
      errorInfo.userAgent,
      errorInfo.devicePixelRatio,
      errorInfo.extraData ? JSON.stringify(errorInfo.extraData) : null,
      errorInfo.platform,
      errorInfo.os,
      errorInfo.browser,
      errorInfo.viewportWidth,
      errorInfo.viewportHeight,
      errorInfo.screenWidth,
      errorInfo.screenHeight,
      errorInfo.networkType,
      errorInfo.pageStayTime,
      errorInfo.routeFrom,
      errorInfo.routeTo,
      errorInfo.eventType,
      errorInfo.eventTarget,
      errorInfo.resourceUrl,
      errorInfo.resourceType,
      errorInfo.loadTime,
      errorInfo.httpStatus
    );

    return {
      ...errorInfo,
      id: info.lastInsertRowid as number
    };
  }

  /**
   * 根据条件查找错误信息
   */
  static async findAll(options: {
    where?: any;
    attributes?: string[];
    group?: string[];
    order?: string[][];
    limit?: number
  } = {}): Promise<any[]> {
    let sql = 'SELECT * FROM error_info';
    const params: any[] = [];

    // 构建 WHERE 条件
    if (options.where) {
      const whereConditions: string[] = [];
      for (const key in options.where) {
        if (options.where.hasOwnProperty(key)) {
          // 处理特殊操作符
          if (typeof options.where[key] === 'object' && options.where[key] !== null) {
            for (const op in options.where[key]) {
              if (op === 'Op.gte') {
                whereConditions.push(`${key} >= ?`);
                params.push(options.where[key][op]);
              } else if (op === 'Op.lte') {
                whereConditions.push(`${key} <= ?`);
                params.push(options.where[key][op]);
              }
            }
          } else {
            whereConditions.push(`${key} = ?`);
            params.push(options.where[key]);
          }
        }
      }

      if (whereConditions.length > 0) {
        sql += ` WHERE ${whereConditions.join(' AND ')}`;
      }
    }

    // 处理分组
    if (options.group && options.group.length > 0) {
      sql += ` GROUP BY ${options.group.join(', ')}`;
    }

    // 处理排序
    if (options.order && options.order.length > 0) {
      const orderConditions = options.order.map(([field, direction]) => `${field} ${direction}`);
      sql += ` ORDER BY ${orderConditions.join(', ')}`;
    }

    // 处理限制
    if (options.limit) {
      sql += ` LIMIT ${options.limit}`;
    }

    const stmt = db.prepare(sql);
    return stmt.all(...params);
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
   * 聚合函数
   */
  static fn(fnName: string, fieldName: string): string {
    return `${fnName}(${fieldName})`;
  }

  /**
   * 获取 Sequelize 实例（为了兼容现有代码）
   */
  static get sequelize() {
    return {
      fn: (fnName: string, fieldName: string) => ({
        fnName,
        fieldName
      }),
      col: (fieldName: string) => fieldName,
      literal: (str: string) => str
    };
  }
}