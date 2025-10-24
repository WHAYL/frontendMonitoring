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
    -- 新增用于分析的字段
    platform TEXT,              -- 平台信息 (web, uniapp, etc.)
    os TEXT,                    -- 操作系统
    browser TEXT,               -- 浏览器
    viewport_width INTEGER,     -- 视口宽度
    viewport_height INTEGER,    -- 视口高度
    screen_width INTEGER,       -- 屏幕宽度
    screen_height INTEGER,      -- 屏幕高度
    network_type TEXT,          -- 网络类型
    page_stay_time INTEGER,     -- 页面停留时间
    route_from TEXT,            -- 来源路由
    route_to TEXT,              -- 目标路由
    event_type TEXT,            -- 事件类型
    event_target TEXT,          -- 事件目标
    resource_url TEXT,          -- 资源URL
    resource_type TEXT,         -- 资源类型
    load_time INTEGER,          -- 加载时间
    http_status INTEGER,        -- HTTP状态码
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
// 新增索引
db.exec(`CREATE INDEX IF NOT EXISTS idx_platform ON error_info(platform)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_os ON error_info(os)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_browser ON error_info(browser)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_page_stay_time ON error_info(page_stay_time)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_route_from ON error_info(route_from)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_route_to ON error_info(route_to)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_event_type ON error_info(event_type)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_resource_type ON error_info(resource_type)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_network_type ON error_info(network_type)`);

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