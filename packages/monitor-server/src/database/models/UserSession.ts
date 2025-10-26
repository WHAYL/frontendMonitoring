import { db } from '../index';

export interface IUserSession {
  id?: number;
  sessionId: string;
  fingerprint: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  pageViews: number;
  eventsCount: number;
  errorsCount: number;
  platform?: string;
  os?: string;
  browser?: string;
  deviceType?: string;
  screenResolution?: string;
  networkType?: string;
  referrer?: string;
  entryUrl?: string;
  exitUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserSessionModel {
  /**
   * 创建用户会话
   */
  static async create(session: IUserSession): Promise<IUserSession> {
    const stmt = db.prepare(`
      INSERT INTO user_sessions (
        session_id, fingerprint, user_id, start_time, end_time, duration,
        page_views, events_count, errors_count, platform, os, browser,
        device_type, screen_resolution, network_type, referrer, entry_url, exit_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      session.sessionId,
      session.fingerprint,
      session.userId,
      session.startTime,
      session.endTime,
      session.duration,
      session.pageViews,
      session.eventsCount,
      session.errorsCount,
      session.platform,
      session.os,
      session.browser,
      session.deviceType,
      session.screenResolution,
      session.networkType,
      session.referrer,
      session.entryUrl,
      session.exitUrl
    );

    return {
      ...session,
      id: info.lastInsertRowid as number
    };
  }

  /**
   * 更新用户会话
   */
  static async update(sessionId: string, updates: Partial<IUserSession>): Promise<void> {
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'sessionId');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field as keyof IUserSession]);

    if (fields.length === 0) {return;}

    const stmt = db.prepare(`UPDATE user_sessions SET ${setClause} WHERE session_id = ?`);
    stmt.run(...values, sessionId);
  }

  /**
   * 根据会话ID查找会话
   */
  static async findBySessionId(sessionId: string): Promise<IUserSession | null> {
    const stmt = db.prepare('SELECT * FROM user_sessions WHERE session_id = ?');
    const result = stmt.get(sessionId) as IUserSession | undefined;
    return result || null;
  }

  /**
   * 根据指纹查找会话
   */
  static async findByFingerprint(fingerprint: string, limit: number = 100): Promise<IUserSession[]> {
    const stmt = db.prepare(`
      SELECT * FROM user_sessions 
      WHERE fingerprint = ? 
      ORDER BY start_time DESC 
      LIMIT ?
    `);
    return stmt.all(fingerprint, limit) as IUserSession[];
  }

  /**
   * 获取活跃会话
   */
  static async getActiveSessions(): Promise<IUserSession[]> {
    const stmt = db.prepare(`
      SELECT * FROM user_sessions 
      WHERE end_time IS NULL 
      ORDER BY start_time DESC
    `);
    return stmt.all() as IUserSession[];
  }

  /**
   * 统计会话数据
   */
  static async getSessionStats(startDate?: number, endDate?: number): Promise<any> {
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

    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(DISTINCT fingerprint) as unique_users,
        AVG(duration) as avg_duration,
        AVG(page_views) as avg_page_views,
        AVG(events_count) as avg_events,
        AVG(errors_count) as avg_errors
      FROM user_sessions${whereClause}
    `);

    return stmt.get(...params);
  }
}
