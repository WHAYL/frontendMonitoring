import { db } from '../index';

export interface IAlertRecord {
  id?: number;
  ruleId: number;
  alertType: string;
  severity: string;
  message: string;
  data?: any;
  isResolved: boolean;
  resolvedAt?: Date;
  createdAt?: Date;
}

export class AlertRecordModel {
  /**
   * 创建告警记录
   */
  static async create(record: IAlertRecord): Promise<IAlertRecord> {
    const stmt = db.prepare(`
      INSERT INTO alert_records (
        rule_id, alert_type, severity, message, data, is_resolved, resolved_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      record.ruleId,
      record.alertType,
      record.severity,
      record.message,
      record.data ? JSON.stringify(record.data) : null,
      record.isResolved ? 1 : 0,
      record.resolvedAt
    );

    return {
      ...record,
      id: info.lastInsertRowid as number
    };
  }

  /**
   * 更新告警记录
   */
  static async update(id: number, updates: Partial<IAlertRecord>): Promise<void> {
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'createdAt');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => {
      const value = updates[field as keyof IAlertRecord];
      if (field === 'isResolved') {
        return value ? 1 : 0;
      }
      if (field === 'data') {
        return value ? JSON.stringify(value) : null;
      }
      return value;
    });

    if (fields.length === 0) {return;}

    const stmt = db.prepare(`UPDATE alert_records SET ${setClause} WHERE id = ?`);
    stmt.run(...values, id);
  }

  /**
   * 解决告警
   */
  static async resolve(id: number): Promise<void> {
    const stmt = db.prepare('UPDATE alert_records SET is_resolved = 1, resolved_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(id);
  }

  /**
   * 批量解决告警
   */
  static async resolveBatch(ids: number[]): Promise<void> {
    const stmt = db.prepare('UPDATE alert_records SET is_resolved = 1, resolved_at = CURRENT_TIMESTAMP WHERE id = ?');
    const resolveMany = db.transaction((ids: number[]) => {
      for (const id of ids) {
        stmt.run(id);
      }
    });
    resolveMany(ids);
  }

  /**
   * 根据ID查找告警记录
   */
  static async findById(id: number): Promise<IAlertRecord | null> {
    const stmt = db.prepare('SELECT * FROM alert_records WHERE id = ?');
    const result = stmt.get(id) as IAlertRecord | undefined;
    return result || null;
  }

  /**
   * 获取所有告警记录
   */
  static async findAll(options: {
    limit?: number;
    offset?: number;
    severity?: string;
    alertType?: string;
    isResolved?: boolean;
    startDate?: number;
    endDate?: number;
  } = {}): Promise<IAlertRecord[]> {
    let whereClause = '';
    const params: any[] = [];
    const conditions: string[] = [];

    if (options.severity) {
      conditions.push('severity = ?');
      params.push(options.severity);
    }
    if (options.alertType) {
      conditions.push('alert_type = ?');
      params.push(options.alertType);
    }
    if (options.isResolved !== undefined) {
      conditions.push('is_resolved = ?');
      params.push(options.isResolved ? 1 : 0);
    }
    if (options.startDate) {
      conditions.push('created_at >= datetime(?, "unixepoch")');
      params.push(options.startDate / 1000);
    }
    if (options.endDate) {
      conditions.push('created_at <= datetime(?, "unixepoch")');
      params.push(options.endDate / 1000);
    }

    if (conditions.length > 0) {
      whereClause = ` WHERE ${conditions.join(' AND ')}`;
    }

    let sql = `SELECT * FROM alert_records${whereClause} ORDER BY created_at DESC`;

    if (options.limit) {
      sql += ` LIMIT ${options.limit}`;
    }
    if (options.offset) {
      sql += ` OFFSET ${options.offset}`;
    }

    const stmt = db.prepare(sql);
    return stmt.all(...params) as IAlertRecord[];
  }

  /**
   * 获取未解决的告警
   */
  static async findUnresolved(): Promise<IAlertRecord[]> {
    const stmt = db.prepare('SELECT * FROM alert_records WHERE is_resolved = 0 ORDER BY created_at DESC');
    return stmt.all() as IAlertRecord[];
  }

  /**
   * 根据规则ID获取告警记录
   */
  static async findByRuleId(ruleId: number): Promise<IAlertRecord[]> {
    const stmt = db.prepare('SELECT * FROM alert_records WHERE rule_id = ? ORDER BY created_at DESC');
    return stmt.all(ruleId) as IAlertRecord[];
  }

  /**
   * 获取告警统计
   */
  static async getAlertStats(startDate?: number, endDate?: number): Promise<any> {
    let whereClause = '';
    const params: any[] = [];

    if (startDate || endDate) {
      const conditions: string[] = [];
      if (startDate) {
        conditions.push('created_at >= datetime(?, "unixepoch")');
        params.push(startDate / 1000);
      }
      if (endDate) {
        conditions.push('created_at <= datetime(?, "unixepoch")');
        params.push(endDate / 1000);
      }
      whereClause = ` WHERE ${conditions.join(' AND ')}`;
    }

    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total_alerts,
        COUNT(CASE WHEN is_resolved = 0 THEN 1 END) as unresolved_alerts,
        COUNT(CASE WHEN is_resolved = 1 THEN 1 END) as resolved_alerts,
        COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_alerts,
        COUNT(CASE WHEN severity = 'warning' THEN 1 END) as warning_alerts,
        COUNT(CASE WHEN severity = 'info' THEN 1 END) as info_alerts,
        COUNT(DISTINCT alert_type) as alert_types_count
      FROM alert_records${whereClause}
    `);

    return stmt.get(...params);
  }

  /**
   * 获取告警趋势
   */
  static async getAlertTrend(timeWindow: string = 'hour', startDate?: number, endDate?: number): Promise<any[]> {
    let whereClause = '';
    const params: any[] = [];

    if (startDate || endDate) {
      const conditions: string[] = [];
      if (startDate) {
        conditions.push('created_at >= datetime(?, "unixepoch")');
        params.push(startDate / 1000);
      }
      if (endDate) {
        conditions.push('created_at <= datetime(?, "unixepoch")');
        params.push(endDate / 1000);
      }
      whereClause = ` WHERE ${conditions.join(' AND ')}`;
    }

    let timeFormat = '';
    switch (timeWindow) {
      case 'minute':
        timeFormat = "strftime('%Y-%m-%d %H:%M', created_at)";
        break;
      case 'hour':
        timeFormat = "strftime('%Y-%m-%d %H', created_at)";
        break;
      case 'day':
        timeFormat = "strftime('%Y-%m-%d', created_at)";
        break;
      default:
        timeFormat = "strftime('%Y-%m-%d %H', created_at)";
    }

    const stmt = db.prepare(`
      SELECT 
        ${timeFormat} as time_period,
        COUNT(*) as alert_count,
        COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_count,
        COUNT(CASE WHEN severity = 'warning' THEN 1 END) as warning_count,
        COUNT(CASE WHEN severity = 'info' THEN 1 END) as info_count
      FROM alert_records${whereClause}
      GROUP BY ${timeFormat}
      ORDER BY time_period ASC
    `);

    return stmt.all(...params);
  }

  /**
   * 清理旧的告警记录
   */
  static async cleanupOldRecords(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffTimestamp = cutoffDate.getTime() / 1000;

    const stmt = db.prepare('DELETE FROM alert_records WHERE created_at < datetime(?, "unixepoch")');
    const result = stmt.run(cutoffTimestamp);
    return result.changes;
  }
}
