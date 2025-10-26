import { db } from '../../database';

/**
 * 设备分析服务
 */
export class DeviceAnalyticsService {
  /**
   * 获取设备分析数据
   */
  static async getDeviceAnalytics(
    startDate?: number,
    endDate?: number
  ): Promise<any> {
    let whereClause = '';
    const params: any[] = [];

    if (startDate || endDate) {
      const conditions: string[] = [];
      if (startDate) {
        conditions.push('start_time >= ?');
        params.push(startDate);
      }
      if (endDate) {
        conditions.push('start_time <= ?');
        params.push(endDate);
      }
      whereClause = ` WHERE ${conditions.join(' AND ')}`;
    }

    // 浏览器分析
    const browserQuery = `
      SELECT 
        browser, 
        COUNT(*) as count,
        COUNT(DISTINCT fingerprint) as unique_users,
        AVG(duration) as avg_duration
      FROM user_sessions${whereClause}
      WHERE browser IS NOT NULL
      GROUP BY browser
      ORDER BY count DESC
    `;
    const browserStmt = db.prepare(browserQuery);
    const browsers = browserStmt.all(...params);

    // 操作系统分析
    const osQuery = `
      SELECT 
        os, 
        COUNT(*) as count,
        COUNT(DISTINCT fingerprint) as unique_users,
        AVG(duration) as avg_duration
      FROM user_sessions${whereClause}
      WHERE os IS NOT NULL
      GROUP BY os
      ORDER BY count DESC
    `;
    const osStmt = db.prepare(osQuery);
    const osList = osStmt.all(...params);

    // 平台分析
    const platformQuery = `
      SELECT 
        platform, 
        COUNT(*) as count,
        COUNT(DISTINCT fingerprint) as unique_users,
        AVG(duration) as avg_duration
      FROM user_sessions${whereClause}
      WHERE platform IS NOT NULL
      GROUP BY platform
      ORDER BY count DESC
    `;
    const platformStmt = db.prepare(platformQuery);
    const platforms = platformStmt.all(...params);

    // 设备类型分析
    const deviceQuery = `
      SELECT 
        device_type, 
        COUNT(*) as count,
        COUNT(DISTINCT fingerprint) as unique_users,
        AVG(duration) as avg_duration
      FROM user_sessions${whereClause}
      WHERE device_type IS NOT NULL
      GROUP BY device_type
      ORDER BY count DESC
    `;
    const deviceStmt = db.prepare(deviceQuery);
    const devices = deviceStmt.all(...params);

    // 屏幕分辨率分析
    const resolutionQuery = `
      SELECT 
        screen_resolution, 
        COUNT(*) as count,
        COUNT(DISTINCT fingerprint) as unique_users
      FROM user_sessions${whereClause}
      WHERE screen_resolution IS NOT NULL
      GROUP BY screen_resolution
      ORDER BY count DESC
      LIMIT 20
    `;
    const resolutionStmt = db.prepare(resolutionQuery);
    const resolutions = resolutionStmt.all(...params);

    return {
      browsers,
      os: osList,
      platforms,
      devices,
      resolutions
    };
  }

  /**
   * 获取设备性能对比
   */
  static async getDevicePerformanceComparison(
    startDate?: number,
    endDate?: number
  ): Promise<any> {
    let whereClause = '';
    const params: any[] = [];

    if (startDate || endDate) {
      const conditions: string[] = [];
      if (startDate) {
        conditions.push('visit_time >= ?');
        params.push(startDate);
      }
      if (endDate) {
        conditions.push('visit_time <= ?');
        params.push(endDate);
      }
      whereClause = ` WHERE ${conditions.join(' AND ')}`;
    }

    const query = `
      SELECT 
        s.device_type,
        s.browser,
        s.os,
        AVG(p.load_time) as avg_load_time,
        AVG(p.first_paint_time) as avg_fp,
        AVG(p.first_contentful_paint_time) as avg_fcp,
        AVG(p.largest_contentful_paint_time) as avg_lcp,
        COUNT(*) as page_views
      FROM page_visits p
      JOIN user_sessions s ON p.session_id = s.session_id
      ${whereClause}
      GROUP BY s.device_type, s.browser, s.os
      ORDER BY avg_load_time DESC
    `;

    const stmt = db.prepare(query);
    return stmt.all(...params);
  }
}
