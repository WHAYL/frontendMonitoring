import { db } from '../index';

export interface INetworkRequest {
  id?: number;
  sessionId: string;
  fingerprint: string;
  url: string;
  method: string;
  statusCode?: number;
  responseTime?: number;
  requestSize?: number;
  responseSize?: number;
  contentType?: string;
  cacheStatus?: string;
  timestamp: number;
  createdAt?: Date;
}

export class NetworkRequestModel {
  /**
   * 创建网络请求记录
   */
  static async create(request: INetworkRequest): Promise<INetworkRequest> {
    const stmt = db.prepare(`
      INSERT INTO network_requests (
        session_id, fingerprint, url, method, status_code, response_time,
        request_size, response_size, content_type, cache_status, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      request.sessionId,
      request.fingerprint,
      request.url,
      request.method,
      request.statusCode,
      request.responseTime,
      request.requestSize,
      request.responseSize,
      request.contentType,
      request.cacheStatus,
      request.timestamp
    );

    return {
      ...request,
      id: info.lastInsertRowid as number
    };
  }

  /**
   * 批量创建网络请求记录
   */
  static async createBatch(requests: INetworkRequest[]): Promise<void> {
    const stmt = db.prepare(`
      INSERT INTO network_requests (
        session_id, fingerprint, url, method, status_code, response_time,
        request_size, response_size, content_type, cache_status, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((requests: INetworkRequest[]) => {
      for (const request of requests) {
        stmt.run(
          request.sessionId,
          request.fingerprint,
          request.url,
          request.method,
          request.statusCode,
          request.responseTime,
          request.requestSize,
          request.responseSize,
          request.contentType,
          request.cacheStatus,
          request.timestamp
        );
      }
    });

    insertMany(requests);
  }

  /**
   * 根据会话ID获取网络请求
   */
  static async findBySessionId(sessionId: string): Promise<INetworkRequest[]> {
    const stmt = db.prepare(`
      SELECT * FROM network_requests 
      WHERE session_id = ? 
      ORDER BY timestamp ASC
    `);
    return stmt.all(sessionId) as INetworkRequest[];
  }

  /**
   * 根据URL获取网络请求
   */
  static async findByUrl(url: string, startDate?: number, endDate?: number): Promise<INetworkRequest[]> {
    let whereClause = ' WHERE url = ?';
    const params: any[] = [url];

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
      SELECT * FROM network_requests${whereClause}
      ORDER BY timestamp ASC
    `);
    return stmt.all(...params) as INetworkRequest[];
  }

  /**
   * 获取网络请求统计
   */
  static async getNetworkStats(startDate?: number, endDate?: number): Promise<any> {
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
        COUNT(*) as total_requests,
        COUNT(DISTINCT url) as unique_urls,
        COUNT(DISTINCT fingerprint) as unique_users,
        AVG(response_time) as avg_response_time,
        AVG(request_size) as avg_request_size,
        AVG(response_size) as avg_response_size,
        COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_requests,
        COUNT(CASE WHEN response_time > 3000 THEN 1 END) as slow_requests
      FROM network_requests${whereClause}
    `);

    return stmt.get(...params);
  }

  /**
   * 获取热门API端点
   */
  static async getTopApiEndpoints(limit: number = 10, startDate?: number, endDate?: number): Promise<any[]> {
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
        url,
        method,
        COUNT(*) as request_count,
        AVG(response_time) as avg_response_time,
        AVG(request_size) as avg_request_size,
        AVG(response_size) as avg_response_size,
        COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_count,
        COUNT(CASE WHEN response_time > 3000 THEN 1 END) as slow_count
      FROM network_requests${whereClause}
      GROUP BY url, method
      ORDER BY request_count DESC
      LIMIT ?
    `);

    return stmt.all(...params, limit);
  }

  /**
   * 获取错误请求分析
   */
  static async getErrorRequests(startDate?: number, endDate?: number): Promise<any[]> {
    let whereClause = ' WHERE status_code >= 400';
    const params: any[] = [];

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
        url,
        method,
        status_code,
        COUNT(*) as error_count,
        AVG(response_time) as avg_response_time,
        COUNT(DISTINCT fingerprint) as affected_users
      FROM network_requests${whereClause}
      GROUP BY url, method, status_code
      ORDER BY error_count DESC
    `);

    return stmt.all(...params);
  }

  /**
   * 获取慢请求分析
   */
  static async getSlowRequests(threshold: number = 3000, startDate?: number, endDate?: number): Promise<any[]> {
    let whereClause = ` WHERE response_time > ${threshold}`;
    const params: any[] = [];

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
        url,
        method,
        COUNT(*) as slow_count,
        AVG(response_time) as avg_response_time,
        MAX(response_time) as max_response_time,
        COUNT(DISTINCT fingerprint) as affected_users
      FROM network_requests${whereClause}
      GROUP BY url, method
      ORDER BY avg_response_time DESC
    `);

    return stmt.all(...params);
  }

  /**
   * 获取网络请求趋势
   */
  static async getRequestTrend(timeWindow: string = 'hour', startDate?: number, endDate?: number): Promise<any[]> {
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
        COUNT(*) as request_count,
        AVG(response_time) as avg_response_time,
        COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_count,
        COUNT(CASE WHEN response_time > 3000 THEN 1 END) as slow_count
      FROM network_requests${whereClause}
      GROUP BY ${timeFormat}
      ORDER BY time_period ASC
    `);

    return stmt.all(...params);
  }

  /**
   * 获取缓存命中率分析
   */
  static async getCacheHitRate(startDate?: number, endDate?: number): Promise<any> {
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
        COUNT(*) as total_requests,
        COUNT(CASE WHEN cache_status = 'hit' THEN 1 END) as cache_hits,
        COUNT(CASE WHEN cache_status = 'miss' THEN 1 END) as cache_misses,
        ROUND(
          (COUNT(CASE WHEN cache_status = 'hit' THEN 1 END) * 100.0 / COUNT(*)), 2
        ) as hit_rate_percentage
      FROM network_requests${whereClause}
      WHERE cache_status IS NOT NULL
    `);

    return stmt.get(...params);
  }
}
