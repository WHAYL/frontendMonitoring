import { db } from '../index';

export interface IAlertRule {
  id?: number;
  name: string;
  description?: string;
  ruleType: string;
  conditions: string;
  thresholdValue?: number;
  comparisonOperator?: string;
  timeWindow?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AlertRuleModel {
  /**
   * 创建告警规则
   */
  static async create(rule: IAlertRule): Promise<IAlertRule> {
    const stmt = db.prepare(`
      INSERT INTO alert_rules (
        name, description, rule_type, conditions, threshold_value,
        comparison_operator, time_window, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      rule.name,
      rule.description,
      rule.ruleType,
      rule.conditions,
      rule.thresholdValue,
      rule.comparisonOperator,
      rule.timeWindow,
      rule.isActive ? 1 : 0
    );

    return {
      ...rule,
      id: info.lastInsertRowid as number
    };
  }

  /**
   * 更新告警规则
   */
  static async update(id: number, updates: Partial<IAlertRule>): Promise<void> {
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'createdAt');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => {
      const value = updates[field as keyof IAlertRule];
      return field === 'isActive' ? (value ? 1 : 0) : value;
    });

    if (fields.length === 0) {return;}

    const stmt = db.prepare(`UPDATE alert_rules SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    stmt.run(...values, id);
  }

  /**
   * 删除告警规则
   */
  static async delete(id: number): Promise<void> {
    const stmt = db.prepare('DELETE FROM alert_rules WHERE id = ?');
    stmt.run(id);
  }

  /**
   * 根据ID查找告警规则
   */
  static async findById(id: number): Promise<IAlertRule | null> {
    const stmt = db.prepare('SELECT * FROM alert_rules WHERE id = ?');
    const result = stmt.get(id) as IAlertRule | undefined;
    return result || null;
  }

  /**
   * 获取所有告警规则
   */
  static async findAll(): Promise<IAlertRule[]> {
    const stmt = db.prepare('SELECT * FROM alert_rules ORDER BY created_at DESC');
    return stmt.all() as IAlertRule[];
  }

  /**
   * 获取活跃的告警规则
   */
  static async findActive(): Promise<IAlertRule[]> {
    const stmt = db.prepare('SELECT * FROM alert_rules WHERE is_active = 1 ORDER BY created_at DESC');
    return stmt.all() as IAlertRule[];
  }

  /**
   * 根据规则类型查找告警规则
   */
  static async findByType(ruleType: string): Promise<IAlertRule[]> {
    const stmt = db.prepare('SELECT * FROM alert_rules WHERE rule_type = ? ORDER BY created_at DESC');
    return stmt.all(ruleType) as IAlertRule[];
  }

  /**
   * 启用/禁用告警规则
   */
  static async toggleActive(id: number): Promise<void> {
    const stmt = db.prepare('UPDATE alert_rules SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(id);
  }

  /**
   * 获取告警规则统计
   */
  static async getRuleStats(): Promise<any> {
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total_rules,
        COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_rules,
        COUNT(CASE WHEN is_active = 0 THEN 1 END) as inactive_rules,
        COUNT(DISTINCT rule_type) as rule_types_count
      FROM alert_rules
    `);
    return stmt.get();
  }
}
