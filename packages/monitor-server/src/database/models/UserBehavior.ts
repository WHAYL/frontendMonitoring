import { db } from '../index';

export interface IUserBehavior {
  id?: number;
  sessionId: string;
  fingerprint: string;
  behaviorType: string;
  targetElement?: string;
  targetSelector?: string;
  coordinatesX?: number;
  coordinatesY?: number;
  scrollPosition?: number;
  viewportSize?: string;
  timestamp: number;
  extraData?: any;
  createdAt?: Date;
}

export class UserBehaviorModel {
  /**
   * 创建用户行为记录
   */
  static async create(behavior: IUserBehavior): Promise<IUserBehavior> {
    const stmt = db.prepare(`
      INSERT INTO user_behaviors (
        session_id, fingerprint, behavior_type, target_element, target_selector,
        coordinates_x, coordinates_y, scroll_position, viewport_size, timestamp, extra_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      behavior.sessionId,
      behavior.fingerprint,
      behavior.behaviorType,
      behavior.targetElement,
      behavior.targetSelector,
      behavior.coordinatesX,
      behavior.coordinatesY,
      behavior.scrollPosition,
      behavior.viewportSize,
      behavior.timestamp,
      behavior.extraData ? JSON.stringify(behavior.extraData) : null
    );

    return {
      ...behavior,
      id: info.lastInsertRowid as number
    };
  }

  /**
   * 批量创建用户行为记录
   */
  static async createBatch(behaviors: IUserBehavior[]): Promise<void> {
    const stmt = db.prepare(`
      INSERT INTO user_behaviors (
        session_id, fingerprint, behavior_type, target_element, target_selector,
        coordinates_x, coordinates_y, scroll_position, viewport_size, timestamp, extra_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((behaviors: IUserBehavior[]) => {
      for (const behavior of behaviors) {
        stmt.run(
          behavior.sessionId,
          behavior.fingerprint,
          behavior.behaviorType,
          behavior.targetElement,
          behavior.targetSelector,
          behavior.coordinatesX,
          behavior.coordinatesY,
          behavior.scrollPosition,
          behavior.viewportSize,
          behavior.timestamp,
          behavior.extraData ? JSON.stringify(behavior.extraData) : null
        );
      }
    });

    insertMany(behaviors);
  }

  /**
   * 根据会话ID获取用户行为
   */
  static async findBySessionId(sessionId: string): Promise<IUserBehavior[]> {
    const stmt = db.prepare(`
      SELECT * FROM user_behaviors 
      WHERE session_id = ? 
      ORDER BY timestamp ASC
    `);
    return stmt.all(sessionId) as IUserBehavior[];
  }

  /**
   * 根据行为类型获取用户行为
   */
  static async findByBehaviorType(behaviorType: string, startDate?: number, endDate?: number): Promise<IUserBehavior[]> {
    let whereClause = ' WHERE behavior_type = ?';
    const params: any[] = [behaviorType];

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
      SELECT * FROM user_behaviors${whereClause}
      ORDER BY timestamp ASC
    `);
    return stmt.all(...params) as IUserBehavior[];
  }

  /**
   * 获取用户行为统计
   */
  static async getBehaviorStats(startDate?: number, endDate?: number): Promise<any> {
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
        behavior_type,
        COUNT(*) as count,
        COUNT(DISTINCT fingerprint) as unique_users,
        COUNT(DISTINCT session_id) as unique_sessions
      FROM user_behaviors${whereClause}
      GROUP BY behavior_type
      ORDER BY count DESC
    `);

    return stmt.all(...params);
  }

  /**
   * 获取热门交互元素
   */
  static async getTopInteractiveElements(limit: number = 10, startDate?: number, endDate?: number): Promise<any[]> {
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
        target_element,
        target_selector,
        behavior_type,
        COUNT(*) as interaction_count,
        COUNT(DISTINCT fingerprint) as unique_users
      FROM user_behaviors${whereClause}
      WHERE target_element IS NOT NULL
      GROUP BY target_element, target_selector, behavior_type
      ORDER BY interaction_count DESC
      LIMIT ?
    `);

    return stmt.all(...params, limit);
  }

  /**
   * 获取用户行为热力图数据
   */
  static async getHeatmapData(startDate?: number, endDate?: number): Promise<any[]> {
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
        coordinates_x,
        coordinates_y,
        COUNT(*) as click_count,
        behavior_type
      FROM user_behaviors${whereClause}
      WHERE coordinates_x IS NOT NULL AND coordinates_y IS NOT NULL
      GROUP BY coordinates_x, coordinates_y, behavior_type
      ORDER BY click_count DESC
    `);

    return stmt.all(...params);
  }

  /**
   * 获取用户行为流程
   */
  static async getUserBehaviorFlow(fingerprint: string, startDate?: number, endDate?: number): Promise<IUserBehavior[]> {
    let whereClause = ' WHERE fingerprint = ?';
    const params: any[] = [fingerprint];

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
      SELECT * FROM user_behaviors${whereClause}
      ORDER BY timestamp ASC
    `);
    return stmt.all(...params) as IUserBehavior[];
  }

  /**
   * 获取行为趋势数据
   */
  static async getBehaviorTrend(behaviorType: string, timeWindow: string = 'hour', startDate?: number, endDate?: number): Promise<any[]> {
    let whereClause = ' WHERE behavior_type = ?';
    const params: any[] = [behaviorType];

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
        COUNT(*) as behavior_count,
        COUNT(DISTINCT fingerprint) as unique_users,
        COUNT(DISTINCT session_id) as unique_sessions
      FROM user_behaviors${whereClause}
      GROUP BY ${timeFormat}
      ORDER BY time_period ASC
    `);

    return stmt.all(...params);
  }
}
