import { db } from '../index';

export interface IPerformanceMetric {
  id?: number;
  sessionId: string;
  fingerprint: string;
  url: string;
  metricName: string;
  metricValue: number;
  metricUnit?: string;
  timestamp: number;
  createdAt?: Date;
}

export class PerformanceMetricModel {
  /**
   * 创建性能指标记录
   */
  static async create(metric: IPerformanceMetric): Promise<IPerformanceMetric> {
    const stmt = db.prepare(`
      INSERT INTO performance_metrics (
        session_id, fingerprint, url, metric_name, metric_value, metric_unit, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      metric.sessionId,
      metric.fingerprint,
      metric.url,
      metric.metricName,
      metric.metricValue,
      metric.metricUnit,
      metric.timestamp
    );

    return {
      ...metric,
      id: info.lastInsertRowid as number
    };
  }

  /**
   * 批量创建性能指标记录
   */
  static async createBatch(metrics: IPerformanceMetric[]): Promise<void> {
    const stmt = db.prepare(`
      INSERT INTO performance_metrics (
        session_id, fingerprint, url, metric_name, metric_value, metric_unit, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((metrics: IPerformanceMetric[]) => {
      for (const metric of metrics) {
        stmt.run(
          metric.sessionId,
          metric.fingerprint,
          metric.url,
          metric.metricName,
          metric.metricValue,
          metric.metricUnit,
          metric.timestamp
        );
      }
    });

    insertMany(metrics);
  }

  /**
   * 根据会话ID获取性能指标
   */
  static async findBySessionId(sessionId: string): Promise<IPerformanceMetric[]> {
    const stmt = db.prepare(`
      SELECT * FROM performance_metrics 
      WHERE session_id = ? 
      ORDER BY timestamp ASC
    `);
    return stmt.all(sessionId) as IPerformanceMetric[];
  }

  /**
   * 根据指标名称获取性能数据
   */
  static async findByMetricName(metricName: string, startDate?: number, endDate?: number): Promise<IPerformanceMetric[]> {
    let whereClause = ' WHERE metric_name = ?';
    const params: any[] = [metricName];

    if (startDate || endDate) {
      if (startDate) {
        whereClause += ' AND timestamp >= ?';
        params.push(startDate);
      }
      if (endDate) {
        whereClause += ' AND timestamp <= ?';
        params.push(endDate);
      }
    }

    const stmt = db.prepare(`
      SELECT * FROM performance_metrics${whereClause}
      ORDER BY timestamp ASC
    `);
    return stmt.all(...params) as IPerformanceMetric[];
  }

  /**
   * 获取性能指标统计
   */
  static async getMetricStats(metricName: string, startDate?: number, endDate?: number): Promise<any> {
    let whereClause = ' WHERE metric_name = ?';
    const params: any[] = [metricName];

    if (startDate || endDate) {
      if (startDate) {
        whereClause += ' AND timestamp >= ?';
        params.push(startDate);
      }
      if (endDate) {
        whereClause += ' AND timestamp <= ?';
        params.push(endDate);
      }
    }

    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total_records,
        AVG(metric_value) as avg_value,
        MIN(metric_value) as min_value,
        MAX(metric_value) as max_value,
        (SELECT metric_value FROM performance_metrics${whereClause} ORDER BY metric_value LIMIT 1 OFFSET (COUNT(*)/2)) as median_value
      FROM performance_metrics${whereClause}
    `);

    return stmt.get(...params);
  }

  /**
   * 获取所有性能指标概览
   */
  static async getMetricsOverview(startDate?: number, endDate?: number): Promise<any> {
    let whereClause = '';
    const params: any[] = [];

    if (startDate || endDate) {
      const conditions: string[] = [];
      if (startDate) {
        conditions.push('timestamp >= ?');
        params.push(startDate);
      }
      if (endDate) {
        conditions.push('timestamp <= ?');
        params.push(endDate);
      }
      whereClause = ` WHERE ${conditions.join(' AND ')}`;
    }

    const stmt = db.prepare(`
      SELECT 
        metric_name,
        COUNT(*) as record_count,
        AVG(metric_value) as avg_value,
        MIN(metric_value) as min_value,
        MAX(metric_value) as max_value,
        metric_unit
      FROM performance_metrics${whereClause}
      GROUP BY metric_name, metric_unit
      ORDER BY record_count DESC
    `);

    return stmt.all(...params);
  }

  /**
   * 获取性能趋势数据
   */
  static async getPerformanceTrend(metricName: string, timeWindow: string = 'hour', startDate?: number, endDate?: number): Promise<any[]> {
    let whereClause = ' WHERE metric_name = ?';
    const params: any[] = [metricName];

    if (startDate || endDate) {
      if (startDate) {
        whereClause += ' AND timestamp >= ?';
        params.push(startDate);
      }
      if (endDate) {
        whereClause += ' AND timestamp <= ?';
        params.push(endDate);
      }
    }

    let timeFormat = '';
    switch (timeWindow) {
      case 'minute':
        timeFormat = "strftime('%Y-%m-%d %H:%M', datetime(timestamp/1000, 'unixepoch'))";
        break;
      case 'hour':
        timeFormat = "strftime('%Y-%m-%d %H', datetime(timestamp/1000, 'unixepoch'))";
        break;
      case 'day':
        timeFormat = "strftime('%Y-%m-%d', datetime(timestamp/1000, 'unixepoch'))";
        break;
      default:
        timeFormat = "strftime('%Y-%m-%d %H', datetime(timestamp/1000, 'unixepoch'))";
    }

    const stmt = db.prepare(`
      SELECT 
        ${timeFormat} as time_period,
        AVG(metric_value) as avg_value,
        MIN(metric_value) as min_value,
        MAX(metric_value) as max_value,
        COUNT(*) as record_count
      FROM performance_metrics${whereClause}
      GROUP BY ${timeFormat}
      ORDER BY time_period ASC
    `);

    return stmt.all(...params);
  }
}
