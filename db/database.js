const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/cms.db");

// ساخت جدول User فقط برای بار اول
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT,
    role TEXT,
    note TEXT
  )`);
});

module.exports = db;

// بعد از جدول users همین پایین اضافه کن:
db.run(`CREATE TABLE IF NOT EXISTS video_ideas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  details TEXT,
  why TEXT,
  category TEXT,
  viral_title TEXT,
  thumbnail_desc TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idea_id INTEGER,
  folder_link TEXT,
  long_duration INTEGER,
  short_duration INTEGER,
  en_long_status BOOLEAN,
  fr_long_status BOOLEAN,
  ar_long_status BOOLEAN,
  en_short_status BOOLEAN,
  fr_short_status BOOLEAN,
  ar_short_status BOOLEAN,
  FOREIGN KEY (idea_id) REFERENCES video_ideas(id)
)`);
db.run(`CREATE TABLE IF NOT EXISTS planners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id INTEGER,
  publish_date TEXT,
  publish_status TEXT,
  youtube_long_en TEXT,
  youtube_long_fr TEXT,
  youtube_long_ar TEXT,
  youtube_short_en TEXT,
  youtube_short_fr TEXT,
  youtube_short_ar TEXT,
  extra_note TEXT,
  FOREIGN KEY (video_id) REFERENCES videos(id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT,
  amount REAL,
  note TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  long_price REAL,
  short_price REAL
)`);

// مقدار اولیه (یک بار)
db.get(`SELECT * FROM settings WHERE id = 1`, [], (err, row) => {
  if (!row) {
    db.run(
      `INSERT INTO settings (id, long_price, short_price) VALUES (1, 13, 9)`
    );
  }
});
db.run(`CREATE TABLE IF NOT EXISTS financial_receipts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id INTEGER UNIQUE,
  total_amount REAL,
  FOREIGN KEY (video_id) REFERENCES videos(id)
)`);
