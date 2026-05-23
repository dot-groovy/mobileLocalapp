import type { SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS location_points (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      speed REAL NOT NULL DEFAULT 0,
      heading REAL NOT NULL DEFAULT 0,
      accuracy REAL NOT NULL DEFAULT 0,
      altitude REAL NOT NULL DEFAULT 0,
      timestamp INTEGER NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      address TEXT,
      arrival_at INTEGER NOT NULL,
      departure_at INTEGER,
      duration_minutes REAL NOT NULL DEFAULT 0
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start_lat REAL NOT NULL,
      start_lng REAL NOT NULL,
      end_lat REAL NOT NULL,
      end_lng REAL NOT NULL,
      start_at INTEGER NOT NULL,
      end_at INTEGER NOT NULL,
      transport_mode TEXT NOT NULL DEFAULT 'unknown',
      distance_km REAL NOT NULL DEFAULT 0
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS daily_summary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      total_distance_km REAL NOT NULL DEFAULT 0,
      walking_min REAL NOT NULL DEFAULT 0,
      driving_min REAL NOT NULL DEFAULT 0,
      stationary_min REAL NOT NULL DEFAULT 0,
      places_count INTEGER NOT NULL DEFAULT 0
    );
  `);

  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_location_points_timestamp ON location_points(timestamp);
  `);
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_visits_arrival ON visits(arrival_at);
  `);
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_trips_start ON trips(start_at);
  `);
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_daily_summary_date ON daily_summary(date);
  `);
}
