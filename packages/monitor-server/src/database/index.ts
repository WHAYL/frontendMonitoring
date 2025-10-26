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

// 创建用户会话表
db.exec(`
  CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT UNIQUE NOT NULL,
    fingerprint TEXT NOT NULL,
    user_id TEXT,
    start_time BIGINT NOT NULL,
    end_time BIGINT,
    duration INTEGER,
    page_views INTEGER DEFAULT 0,
    events_count INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    platform TEXT,
    os TEXT,
    browser TEXT,
    device_type TEXT,
    screen_resolution TEXT,
    network_type TEXT,
    referrer TEXT,
    entry_url TEXT,
    exit_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 创建页面访问表
db.exec(`
  CREATE TABLE IF NOT EXISTS page_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    fingerprint TEXT NOT NULL,
    url TEXT NOT NULL,
    title TEXT,
    referrer TEXT,
    visit_time BIGINT NOT NULL,
    stay_time INTEGER,
    load_time INTEGER,
    dom_ready_time INTEGER,
    first_paint_time INTEGER,
    first_contentful_paint_time INTEGER,
    largest_contentful_paint_time INTEGER,
    first_input_delay INTEGER,
    cumulative_layout_shift REAL,
    bounce_rate REAL,
    exit_rate REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
  )
`);

// 创建性能指标表
db.exec(`
  CREATE TABLE IF NOT EXISTS performance_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    fingerprint TEXT NOT NULL,
    url TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value REAL NOT NULL,
    metric_unit TEXT,
    timestamp BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
  )
`);

// 创建用户行为表
db.exec(`
  CREATE TABLE IF NOT EXISTS user_behaviors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    fingerprint TEXT NOT NULL,
    behavior_type TEXT NOT NULL,
    target_element TEXT,
    target_selector TEXT,
    coordinates_x INTEGER,
    coordinates_y INTEGER,
    scroll_position INTEGER,
    viewport_size TEXT,
    timestamp BIGINT NOT NULL,
    extra_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
  )
`);

// 创建网络请求表
db.exec(`
  CREATE TABLE IF NOT EXISTS network_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    fingerprint TEXT NOT NULL,
    url TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER,
    response_time INTEGER,
    request_size INTEGER,
    response_size INTEGER,
    content_type TEXT,
    cache_status TEXT,
    timestamp BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
  )
`);

// 创建告警规则表
db.exec(`
  CREATE TABLE IF NOT EXISTS alert_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    rule_type TEXT NOT NULL,
    conditions TEXT NOT NULL,
    threshold_value REAL,
    comparison_operator TEXT,
    time_window INTEGER,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 创建告警记录表
db.exec(`
  CREATE TABLE IF NOT EXISTS alert_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rule_id INTEGER NOT NULL,
    alert_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    message TEXT NOT NULL,
    data TEXT,
    is_resolved BOOLEAN DEFAULT 0,
    resolved_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rule_id) REFERENCES alert_rules(id)
  )
`);

// 创建索引以提高查询性能
// error_info 表索引
db.exec(`CREATE INDEX IF NOT EXISTS idx_timestamp ON error_info(timestamp)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_level ON error_info(level)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_user_id ON error_info(user_id)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_plugin_name ON error_info(plugin_name)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_fingerprint ON error_info(fingerprint)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_level_timestamp ON error_info(level, timestamp)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_plugin_name_timestamp ON error_info(plugin_name, timestamp)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_fingerprint_timestamp ON error_info(fingerprint, timestamp)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_platform ON error_info(platform)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_os ON error_info(os)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_browser ON error_info(browser)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_page_stay_time ON error_info(page_stay_time)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_route_from ON error_info(route_from)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_route_to ON error_info(route_to)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_event_type ON error_info(event_type)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_resource_type ON error_info(resource_type)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_network_type ON error_info(network_type)`);

// user_sessions 表索引
db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_fingerprint ON user_sessions(fingerprint)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON user_sessions(start_time)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_platform ON user_sessions(platform)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_os ON user_sessions(os)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_browser ON user_sessions(browser)`);

// page_visits 表索引
db.exec(`CREATE INDEX IF NOT EXISTS idx_page_visits_session_id ON page_visits(session_id)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_page_visits_fingerprint ON page_visits(fingerprint)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_page_visits_url ON page_visits(url)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_page_visits_visit_time ON page_visits(visit_time)`);

// performance_metrics 表索引
db.exec(`CREATE INDEX IF NOT EXISTS idx_performance_session_id ON performance_metrics(session_id)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_performance_fingerprint ON performance_metrics(fingerprint)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_performance_metric_name ON performance_metrics(metric_name)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_performance_timestamp ON performance_metrics(timestamp)`);

// user_behaviors 表索引
db.exec(`CREATE INDEX IF NOT EXISTS idx_behaviors_session_id ON user_behaviors(session_id)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_behaviors_fingerprint ON user_behaviors(fingerprint)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_behaviors_type ON user_behaviors(behavior_type)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_behaviors_timestamp ON user_behaviors(timestamp)`);

// network_requests 表索引
db.exec(`CREATE INDEX IF NOT EXISTS idx_network_session_id ON network_requests(session_id)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_network_fingerprint ON network_requests(fingerprint)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_network_url ON network_requests(url)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_network_status_code ON network_requests(status_code)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_network_timestamp ON network_requests(timestamp)`);

// alert_rules 表索引
db.exec(`CREATE INDEX IF NOT EXISTS idx_alert_rules_type ON alert_rules(rule_type)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_alert_rules_active ON alert_rules(is_active)`);

// alert_records 表索引
db.exec(`CREATE INDEX IF NOT EXISTS idx_alert_records_rule_id ON alert_records(rule_id)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_alert_records_type ON alert_records(alert_type)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_alert_records_severity ON alert_records(severity)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_alert_records_resolved ON alert_records(is_resolved)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_alert_records_created_at ON alert_records(created_at)`);

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