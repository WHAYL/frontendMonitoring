import { db } from '../../database';

/**
 * 留存分析服务
 */
export class RetentionAnalyticsService {
  /**
   * 获取留存分析数据
   */
  static async getRetentionAnalytics(
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

    // 获取每日新增用户
    const dailyNewUsersQuery = `
      SELECT 
        DATE(datetime(start_time/1000, 'unixepoch')) as date,
        COUNT(DISTINCT fingerprint) as new_users
      FROM user_sessions${whereClause}
      GROUP BY DATE(datetime(start_time/1000, 'unixepoch'))
      ORDER BY date ASC
    `;
    const dailyNewUsersStmt = db.prepare(dailyNewUsersQuery);
    const dailyNewUsers = dailyNewUsersStmt.all(...params);

    // 获取留存率数据（简化版本）
    const retentionQuery = `
      SELECT 
        DATE(datetime(start_time/1000, 'unixepoch')) as cohort_date,
        COUNT(DISTINCT fingerprint) as cohort_size,
        COUNT(DISTINCT CASE WHEN DATE(datetime(start_time/1000, 'unixepoch')) = DATE(datetime(start_time/1000, 'unixepoch')) THEN fingerprint END) as day_0_retained,
        COUNT(DISTINCT CASE WHEN DATE(datetime(start_time/1000, 'unixepoch')) = DATE(datetime(start_time/1000, 'unixepoch'), '+1 day') THEN fingerprint END) as day_1_retained,
        COUNT(DISTINCT CASE WHEN DATE(datetime(start_time/1000, 'unixepoch')) = DATE(datetime(start_time/1000, 'unixepoch'), '+7 days') THEN fingerprint END) as day_7_retained,
        COUNT(DISTINCT CASE WHEN DATE(datetime(start_time/1000, 'unixepoch')) = DATE(datetime(start_time/1000, 'unixepoch'), '+30 days') THEN fingerprint END) as day_30_retained
      FROM user_sessions${whereClause}
      GROUP BY DATE(datetime(start_time/1000, 'unixepoch'))
      ORDER BY cohort_date ASC
    `;
    const retentionStmt = db.prepare(retentionQuery);
    const retentionData = retentionStmt.all(...params);

    return {
      dailyNewUsers,
      retention: retentionData
    };
  }

  /**
   * 获取用户生命周期分析
   */
  static async getUserLifecycleAnalysis(
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

    const lifecycleQuery = `
      SELECT 
        fingerprint,
        COUNT(*) as session_count,
        MIN(start_time) as first_visit,
        MAX(start_time) as last_visit,
        AVG(duration) as avg_session_duration,
        SUM(page_views) as total_page_views,
        SUM(events_count) as total_events
      FROM user_sessions${whereClause}
      GROUP BY fingerprint
      ORDER BY session_count DESC
    `;

    const lifecycleStmt = db.prepare(lifecycleQuery);
    const lifecycleData = lifecycleStmt.all(...params);

    // 分析用户类型
    const userTypes = {
      newUsers: lifecycleData.filter(user => user.session_count === 1).length,
      returningUsers: lifecycleData.filter(user => user.session_count > 1 && user.session_count <= 5).length,
      powerUsers: lifecycleData.filter(user => user.session_count > 5).length
    };

    return {
      userTypes,
      lifecycleData: lifecycleData.slice(0, 100), // 返回前100个用户的数据
      totalUsers: lifecycleData.length,
      avgSessionsPerUser: lifecycleData.reduce((sum, user) => sum + user.session_count, 0) / lifecycleData.length
    };
  }
}
