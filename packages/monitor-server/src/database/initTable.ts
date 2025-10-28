export default function initTable(db) {
  db.exec(`
  CREATE TABLE IF NOT EXISTS report_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT,
    plugin_name TEXT,
    message TEXT,
    url TEXT,
    timestamp INTEGER,
    date TEXT,
    level TEXT,
    device_width INTEGER,
    device_height INTEGER,
    device_pixel_ratio REAL,
    fingerprint TEXT,
    old_fingerprint TEXT,
    ip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

  db.exec(`
  CREATE TABLE IF NOT EXISTS error_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT,
    plugin_name TEXT,
    message TEXT,
    url TEXT,
    timestamp INTEGER,
    date TEXT,
    level TEXT,
    device_width INTEGER,
    device_height INTEGER,
    device_pixel_ratio REAL,
    fingerprint TEXT,
    old_fingerprint TEXT,
    ip TEXT,
    stack TEXT,
    error_info TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
}