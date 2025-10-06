const Database = require('better-sqlite3');
const path = require('path');

// Создаём БД в папке db
const dbPath = path.join(__dirname, 'analytics.db');
const db = new Database(dbPath);

// Включаем WAL режим для лучшей производительности
db.pragma('journal_mode = WAL');

// Создаём таблицу событий
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    user_id TEXT,
    session_id TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    properties TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE INDEX IF NOT EXISTS idx_event_type ON events(event_type);
  CREATE INDEX IF NOT EXISTS idx_timestamp ON events(timestamp);
  CREATE INDEX IF NOT EXISTS idx_user_id ON events(user_id);
  CREATE INDEX IF NOT EXISTS idx_session_id ON events(session_id);
`);

console.log('Analytics database initialized at:', dbPath);

module.exports = db;