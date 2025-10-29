export default function initTable(db) {
  db.exec(`
  CREATE TABLE IF NOT EXISTS error_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT,
    plugin_name TEXT,
    message TEXT,
    page TEXT,
    timestamp INTEGER,
    date TEXT,
    level TEXT,
    device_width INTEGER,
    device_height INTEGER,
    device_pixel_ratio REAL,
    fingerprint TEXT,
    old_fingerprint TEXT,
    ip TEXT,
    error_info TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
  db.exec(`
  CREATE TABLE IF NOT EXISTS request_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT,
    plugin_name TEXT,
    message TEXT,
    page TEXT,
    timestamp INTEGER,
    date TEXT,
    level TEXT,
    device_width INTEGER,
    device_height INTEGER,
    device_pixel_ratio REAL,
    fingerprint TEXT,
    old_fingerprint TEXT,
    ip TEXT,
    url TEXT,
    method TEXT,
    start_time INTEGER,
    end_time INTEGER,
    duration INTEGER,
    error_info TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
  db.exec(`
  CREATE TABLE IF NOT EXISTS page_lifecycle (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT,
    plugin_name TEXT,
    message TEXT,
    page TEXT,
    timestamp INTEGER,
    date TEXT,
    level TEXT,
    device_width INTEGER,
    device_height INTEGER,
    device_pixel_ratio REAL,
    fingerprint TEXT,
    old_fingerprint TEXT,
    ip TEXT,
    change_type TEXT,
    enter_time INTEGER,
    leave_time INTEGER,
    current_route TEXT,
    previous_route TEXT,
    route TEXT,
    target TEXT,
    duration INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
}