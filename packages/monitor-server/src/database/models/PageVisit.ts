import { db } from '../index';

export interface IPageVisit {
  id?: number;
  sessionId: string;
  fingerprint: string;
  url: string;
  title?: string;
  referrer?: string;
  visitTime: number;
  stayTime?: number;
  loadTime?: number;
  domReadyTime?: number;
  firstPaintTime?: number;
  firstContentfulPaintTime?: number;
  largestContentfulPaintTime?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
  bounceRate?: number;
  exitRate?: number;
  createdAt?: Date;
}

export class PageVisitModel {
  /**
   * 创建页面访问记录
   */
  static async create(visit: IPageVisit): Promise<IPageVisit> {
    const stmt = db.prepare(`
      INSERT INTO page_visits (
        session_id, fingerprint, url, title, referrer, visit_time, stay_time,
        load_time, dom_ready_time, first_paint_time, first_contentful_paint_time,
        largest_contentful_paint_time, first_input_delay, cumulative_layout_shift,
        bounce_rate, exit_rate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      visit.sessionId,
      visit.fingerprint,
      visit.url,
      visit.title,
      visit.referrer,
      visit.visitTime,
      visit.stayTime,
      visit.loadTime,
      visit.domReadyTime,
      visit.firstPaintTime,
      visit.firstContentfulPaintTime,
      visit.largestContentfulPaintTime,
      visit.firstInputDelay,
      visit.cumulativeLayoutShift,
      visit.bounceRate,
      visit.exitRate
    );

    return {
      ...visit,
      id: info.lastInsertRowid as number
    };
  }

  /**
   * 批量创建页面访问记录
   */
  static async createBatch(visits: IPageVisit[]): Promise<void> {
    const stmt = db.prepare(`
      INSERT INTO page_visits (
        session_id, fingerprint, url, title, referrer, visit_time, stay_time,
        load_time, dom_ready_time, first_paint_time, first_contentful_paint_time,
        largest_contentful_paint_time, first_input_delay, cumulative_layout_shift,
        bounce_rate, exit_rate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((visits: IPageVisit[]) => {
      for (const visit of visits) {
        stmt.run(
          visit.sessionId,
          visit.fingerprint,
          visit.url,
          visit.title,
          visit.referrer,
          visit.visitTime,
          visit.stayTime,
          visit.loadTime,
          visit.domReadyTime,
          visit.firstPaintTime,
          visit.firstContentfulPaintTime,
          visit.largestContentfulPaintTime,
          visit.firstInputDelay,
          visit.cumulativeLayoutShift,
          visit.bounceRate,
          visit.exitRate
        );
      }
    });

    insertMany(visits);
  }

  /**
   * 根据会话ID获取页面访问记录
   */
  static async findBySessionId(sessionId: string): Promise<IPageVisit[]> {
    const stmt = db.prepare(`
      SELECT * FROM page_visits 
      WHERE session_id = ? 
      ORDER BY visit_time ASC
    `);
    return stmt.all(sessionId) as IPageVisit[];
  }

  /**
   * 获取页面访问统计
   */
  static async getPageStats(startDate?: number, endDate?: number): Promise<any> {
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

    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total_visits,
        COUNT(DISTINCT url) as unique_pages,
        COUNT(DISTINCT fingerprint) as unique_visitors,
        AVG(stay_time) as avg_stay_time,
        AVG(load_time) as avg_load_time,
        AVG(first_paint_time) as avg_fp,
        AVG(first_contentful_paint_time) as avg_fcp,
        AVG(largest_contentful_paint_time) as avg_lcp,
        AVG(first_input_delay) as avg_fid,
        AVG(cumulative_layout_shift) as avg_cls
      FROM page_visits${whereClause}
    `);

    return stmt.get(...params);
  }

  /**
   * 获取热门页面
   */
  static async getTopPages(limit: number = 10, startDate?: number, endDate?: number): Promise<any[]> {
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

    const stmt = db.prepare(`
      SELECT 
        url,
        title,
        COUNT(*) as visits,
        COUNT(DISTINCT fingerprint) as unique_visitors,
        AVG(stay_time) as avg_stay_time,
        AVG(load_time) as avg_load_time
      FROM page_visits${whereClause}
      GROUP BY url, title
      ORDER BY visits DESC
      LIMIT ?
    `);

    return stmt.all(...params, limit);
  }

  /**
   * 获取页面性能分析
   */
  static async getPerformanceAnalysis(startDate?: number, endDate?: number): Promise<any> {
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

    const stmt = db.prepare(`
      SELECT 
        AVG(load_time) as avg_load_time,
        AVG(dom_ready_time) as avg_dom_ready,
        AVG(first_paint_time) as avg_fp,
        AVG(first_contentful_paint_time) as avg_fcp,
        AVG(largest_contentful_paint_time) as avg_lcp,
        AVG(first_input_delay) as avg_fid,
        AVG(cumulative_layout_shift) as avg_cls,
        COUNT(CASE WHEN load_time > 3000 THEN 1 END) as slow_pages,
        COUNT(CASE WHEN first_contentful_paint_time > 2500 THEN 1 END) as poor_fcp,
        COUNT(CASE WHEN largest_contentful_paint_time > 4000 THEN 1 END) as poor_lcp,
        COUNT(CASE WHEN first_input_delay > 300 THEN 1 END) as poor_fid,
        COUNT(CASE WHEN cumulative_layout_shift > 0.25 THEN 1 END) as poor_cls
      FROM page_visits${whereClause}
    `);

    return stmt.get(...params);
  }
}
