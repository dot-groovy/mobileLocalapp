import type { SQLiteDatabase } from 'expo-sqlite';

let _db: SQLiteDatabase | null = null;
let _initPromise: Promise<SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLiteDatabase> {
  if (_db) return _db;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    const { openDatabaseAsync } = await import('expo-sqlite');
    const database = await openDatabaseAsync('localapp.db');

    const { initializeDatabase } = await import('./schema');
    await initializeDatabase(database);

    _db = database;
    _initPromise = null;
    return database;
  })();

  return _initPromise;
}

export function getCachedDatabase(): SQLiteDatabase | null {
  return _db;
}
