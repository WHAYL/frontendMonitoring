import Database from 'better-sqlite3';
import path from 'path';
import initTable from './initTable';

// 创建 SQLite 数据库连接
const db = new Database(path.join(__dirname, '../database.sqlite'));

// 初始化数据库表
initTable(db);

/**
 * 连接数据库
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    // 测试连接
    const stmt = db.prepare('SELECT sqlite_version() as version');
    const result = stmt.get();
    console.log('Connected to SQLite database, version:', (result as any).version);
  } catch (error) {
    console.error('SQLite connection error:', error);
    process.exit(1);
  }
};

// 导出数据库实例供其他模块使用
export { db };