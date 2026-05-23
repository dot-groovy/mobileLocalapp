import type { SQLiteDatabase } from 'expo-sqlite';
import type {
  LocationPoint,
  Visit,
  Trip,
  DailySummary,
  TransportMode,
} from '@/src/types';

// ── Location Points ──

export async function insertLocationPoint(
  db: SQLiteDatabase,
  point: Omit<LocationPoint, 'id'>
): Promise<void> {
  await db.runAsync(
    `INSERT INTO location_points (lat, lng, speed, heading, accuracy, altitude, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [point.lat, point.lng, point.speed, point.heading, point.accuracy, point.altitude, point.timestamp]
  );
}

export async function insertLocationPoints(
  db: SQLiteDatabase,
  points: Omit<LocationPoint, 'id'>[]
): Promise<void> {
  for (const point of points) {
    await insertLocationPoint(db, point);
  }
}

export async function getLocationPoints(
  db: SQLiteDatabase,
  startTime: number,
  endTime: number
): Promise<LocationPoint[]> {
  return db.getAllAsync<LocationPoint>(
    `SELECT * FROM location_points WHERE timestamp >= ? AND timestamp <= ? ORDER BY timestamp ASC`,
    [startTime, endTime]
  );
}

export async function getRecentLocationPoints(
  db: SQLiteDatabase,
  limit: number = 10
): Promise<LocationPoint[]> {
  return db.getAllAsync<LocationPoint>(
    `SELECT * FROM location_points ORDER BY timestamp DESC LIMIT ?`,
    [limit]
  );
}

export async function deleteLocationPointsBefore(
  db: SQLiteDatabase,
  timestamp: number
): Promise<void> {
  await db.runAsync(`DELETE FROM location_points WHERE timestamp < ?`, [timestamp]);
}

// ── Visits ──

export async function insertVisit(
  db: SQLiteDatabase,
  visit: Omit<Visit, 'id'>
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO visits (lat, lng, address, arrival_at, departure_at, duration_minutes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [visit.lat, visit.lng, visit.address, visit.arrival_at, visit.departure_at, visit.duration_minutes]
  );
  return result.lastInsertRowId;
}

export async function updateVisitDeparture(
  db: SQLiteDatabase,
  visitId: number,
  departureAt: number,
  durationMinutes: number
): Promise<void> {
  await db.runAsync(
    `UPDATE visits SET departure_at = ?, duration_minutes = ? WHERE id = ?`,
    [departureAt, durationMinutes, visitId]
  );
}

export async function getOpenVisit(db: SQLiteDatabase): Promise<Visit | null> {
  const result = await db.getFirstAsync<Visit>(
    `SELECT * FROM visits WHERE departure_at IS NULL ORDER BY arrival_at DESC LIMIT 1`
  );
  return result ?? null;
}

export async function getVisits(
  db: SQLiteDatabase,
  startTime: number,
  endTime: number
): Promise<Visit[]> {
  return db.getAllAsync<Visit>(
    `SELECT * FROM visits WHERE arrival_at >= ? AND arrival_at <= ? ORDER BY arrival_at ASC`,
    [startTime, endTime]
  );
}

export async function getTopVisitedPlaces(
  db: SQLiteDatabase,
  startTime: number,
  endTime: number,
  limit: number = 5
): Promise<{ address: string; total_minutes: number; visit_count: number }[]> {
  return db.getAllAsync(
    `SELECT
       COALESCE(address, ROUND(lat, 4) || ', ' || ROUND(lng, 4)) as address,
       SUM(duration_minutes) as total_minutes,
       COUNT(*) as visit_count
     FROM visits
     WHERE arrival_at >= ? AND arrival_at <= ? AND departure_at IS NOT NULL
     GROUP BY COALESCE(address, ROUND(lat, 3) || ',' || ROUND(lng, 3))
     ORDER BY total_minutes DESC
     LIMIT ?`,
    [startTime, endTime, limit]
  );
}

// ── Trips ──

export async function insertTrip(
  db: SQLiteDatabase,
  trip: Omit<Trip, 'id'>
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO trips (start_lat, start_lng, end_lat, end_lng, start_at, end_at, transport_mode, distance_km)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [trip.start_lat, trip.start_lng, trip.end_lat, trip.end_lng, trip.start_at, trip.end_at, trip.transport_mode, trip.distance_km]
  );
  return result.lastInsertRowId;
}

export async function getTrips(
  db: SQLiteDatabase,
  startTime: number,
  endTime: number
): Promise<Trip[]> {
  return db.getAllAsync<Trip>(
    `SELECT * FROM trips WHERE start_at >= ? AND start_at <= ? ORDER BY start_at ASC`,
    [startTime, endTime]
  );
}

// ── Daily Summary ──

export async function upsertDailySummary(
  db: SQLiteDatabase,
  summary: Omit<DailySummary, 'id'>
): Promise<void> {
  await db.runAsync(
    `INSERT INTO daily_summary (date, total_distance_km, walking_min, driving_min, stationary_min, places_count)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET
       total_distance_km = excluded.total_distance_km,
       walking_min = excluded.walking_min,
       driving_min = excluded.driving_min,
       stationary_min = excluded.stationary_min,
       places_count = excluded.places_count`,
    [summary.date, summary.total_distance_km, summary.walking_min, summary.driving_min, summary.stationary_min, summary.places_count]
  );
}

export async function getDailySummary(
  db: SQLiteDatabase,
  date: string
): Promise<DailySummary | null> {
  const result = await db.getFirstAsync<DailySummary>(
    `SELECT * FROM daily_summary WHERE date = ?`,
    [date]
  );
  return result ?? null;
}

export async function getDailySummaries(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string
): Promise<DailySummary[]> {
  return db.getAllAsync<DailySummary>(
    `SELECT * FROM daily_summary WHERE date >= ? AND date <= ? ORDER BY date ASC`,
    [startDate, endDate]
  );
}

// ── Cleanup ──

export async function deleteAllData(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`DELETE FROM location_points`);
  await db.execAsync(`DELETE FROM visits`);
  await db.execAsync(`DELETE FROM trips`);
  await db.execAsync(`DELETE FROM daily_summary`);
}

export async function deleteDataBefore(
  db: SQLiteDatabase,
  timestamp: number
): Promise<void> {
  await db.runAsync(`DELETE FROM location_points WHERE timestamp < ?`, [timestamp]);
  await db.runAsync(`DELETE FROM visits WHERE arrival_at < ?`, [timestamp]);
  await db.runAsync(`DELETE FROM trips WHERE start_at < ?`, [timestamp]);
  const dateStr = new Date(timestamp).toISOString().split('T')[0];
  await db.runAsync(`DELETE FROM daily_summary WHERE date < ?`, [dateStr]);
}

// ── Export ──

export async function exportAllData(db: SQLiteDatabase): Promise<{
  location_points: LocationPoint[];
  visits: Visit[];
  trips: Trip[];
  daily_summary: DailySummary[];
}> {
  const [location_points, visits, trips, daily_summary] = await Promise.all([
    db.getAllAsync<LocationPoint>(`SELECT * FROM location_points ORDER BY timestamp ASC`),
    db.getAllAsync<Visit>(`SELECT * FROM visits ORDER BY arrival_at ASC`),
    db.getAllAsync<Trip>(`SELECT * FROM trips ORDER BY start_at ASC`),
    db.getAllAsync<DailySummary>(`SELECT * FROM daily_summary ORDER BY date ASC`),
  ]);
  return { location_points, visits, trips, daily_summary };
}
