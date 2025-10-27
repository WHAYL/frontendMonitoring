import { IReportInfo } from '../../types';
import { db } from '../index';

export class ReportInfoModel {
  /**
   * 创建报告信息
   */
  static async create(reportInfo: IReportInfo): Promise<IReportInfo> {
    const stmt = db.prepare(`
      INSERT INTO report_info (
        platform, plugin_name, message, url, timestamp, date, level,
        device_width, device_height, device_pixel_ratio, fingerprint, old_fingerprint, ip
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      reportInfo.platform,
      reportInfo.plugin_name,
      reportInfo.message,
      reportInfo.url,
      reportInfo.timestamp,
      reportInfo.date,
      reportInfo.level,
      reportInfo.device_width,
      reportInfo.device_height,
      reportInfo.device_pixel_ratio,
      reportInfo.fingerprint,
      reportInfo.old_fingerprint,
      reportInfo.ip
    );

    return {
      ...reportInfo,
      id: info.lastInsertRowid as number
    };
  }

  /**
   * 批量创建报告信息
   */
  static async createBatch(reports: IReportInfo[]): Promise<void> {
    const stmt = db.prepare(`
      INSERT INTO report_info (
        platform, plugin_name, message, url, timestamp, date, level,
        device_width, device_height, device_pixel_ratio, fingerprint, old_fingerprint, ip
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((reports: IReportInfo[]) => {
      for (const report of reports) {
        stmt.run(
          report.platform,
          report.plugin_name,
          report.message,
          report.url,
          report.timestamp,
          report.date,
          report.level,
          report.device_width,
          report.device_height,
          report.device_pixel_ratio,
          report.fingerprint,
          report.old_fingerprint,
          report.ip
        );
      }
    });

    insertMany(reports);
  }

  /**
   * 根据条件查找报告信息
   */
  static async findAll(options: {
    where?: any;
    limit?: number;
    offset?: number;
    order?: string[][];
  } = {}): Promise<IReportInfo[]> {
    let sql = 'SELECT * FROM report_info';
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
    return stmt.all(...params) as IReportInfo[];
  }

  /**
   * 根据条件统计数量
   */
  static async count(options: { where?: any } = {}): Promise<number> {
    let sql = 'SELECT COUNT(*) as count FROM report_info';
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
   * 根据ID查找单个报告信息
   */
  static async findById(id: number): Promise<IReportInfo | null> {
    const stmt = db.prepare('SELECT * FROM report_info WHERE id = ?');
    const result = stmt.get(id);
    return result as IReportInfo || null;
  }

  /**
   * 根据ID更新报告信息
   */
  static async updateById(id: number, reportInfo: Partial<IReportInfo>): Promise<boolean> {
    const fields: string[] = [];
    const params: any[] = [];

    // 构建更新字段
    for (const key in reportInfo) {
      if (reportInfo.hasOwnProperty(key) && reportInfo[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(reportInfo[key]);
      }
    }

    if (fields.length === 0) {
      return false;
    }

    params.push(id);
    const sql = `UPDATE report_info SET ${fields.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(sql);
    const info = stmt.run(...params);

    return (info.changes || 0) > 0;
  }

  /**
   * 根据ID删除报告信息
   */
  static async deleteById(id: number): Promise<boolean> {
    const stmt = db.prepare('DELETE FROM report_info WHERE id = ?');
    const info = stmt.run(id);
    return (info.changes || 0) > 0;
  }
}