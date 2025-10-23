import Database from 'better-sqlite3';
import path from 'path';

// 创建 SQLite 数据库连接
const db = new Database(path.join(__dirname, '../database.sqlite'));

// 初始化数据库表
db.exec(`
  CREATE TABLE IF NOT EXISTS error_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level TEXT NOT NULL,
    message TEXT NOT NULL,
    stack TEXT,
    timestamp BIGINT NOT NULL,
    date TEXT NOT NULL,
    url TEXT NOT NULL,
    user_id TEXT,
    plugin_name TEXT,
    fingerprint TEXT,
    user_agent TEXT,
    device_pixel_ratio REAL,
    extra_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 创建索引以提高查询性能
db.exec(`CREATE INDEX IF NOT EXISTS idx_timestamp ON error_info(timestamp)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_level ON error_info(level)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_user_id ON error_info(user_id)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_plugin_name ON error_info(plugin_name)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_fingerprint ON error_info(fingerprint)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_level_timestamp ON error_info(level, timestamp)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_plugin_name_timestamp ON error_info(plugin_name, timestamp)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_fingerprint_timestamp ON error_info(fingerprint, timestamp)`);

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

/**
 * 断开数据库连接
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    db.close();
    console.log('Disconnected from SQLite database');
  } catch (error) {
    console.error('Error disconnecting from SQLite database:', error);
  }
};

// 导出数据库实例供其他模块使用
export { db };