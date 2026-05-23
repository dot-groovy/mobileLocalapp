import type {
  LocationPoint,
  Visit,
  Trip,
  DailySummary,
} from '@/src/types';

const noop = async () => {};

export async function insertLocationPoint(_db: any, _point: any): Promise<void> {}
export async function insertLocationPoints(_db: any, _points: any[]): Promise<void> {}

export async function getLocationPoints(
  _db: any, _startTime: number, _endTime: number
): Promise<LocationPoint[]> {
  return [];
}

export async function getRecentLocationPoints(
  _db: any, _limit?: number
): Promise<LocationPoint[]> {
  return [];
}

export async function deleteLocationPointsBefore(_db: any, _timestamp: number): Promise<void> {}

export async function insertVisit(_db: any, _visit: any): Promise<number> {
  return 0;
}

export async function updateVisitDeparture(
  _db: any, _visitId: number, _departureAt: number, _durationMinutes: number
): Promise<void> {}

export async function getOpenVisit(_db: any): Promise<Visit | null> {
  return null;
}

export async function getVisits(
  _db: any, _startTime: number, _endTime: number
): Promise<Visit[]> {
  return [];
}

export async function getTopVisitedPlaces(
  _db: any, _startTime: number, _endTime: number, _limit?: number
): Promise<{ address: string; total_minutes: number; visit_count: number }[]> {
  return [];
}

export async function insertTrip(_db: any, _trip: any): Promise<number> {
  return 0;
}

export async function getTrips(
  _db: any, _startTime: number, _endTime: number
): Promise<Trip[]> {
  return [];
}

export async function upsertDailySummary(_db: any, _summary: any): Promise<void> {}

export async function getDailySummary(
  _db: any, _date: string
): Promise<DailySummary | null> {
  return null;
}

export async function getDailySummaries(
  _db: any, _startDate: string, _endDate: string
): Promise<DailySummary[]> {
  return [];
}

export async function deleteAllData(_db: any): Promise<void> {}

export async function deleteDataBefore(_db: any, _timestamp: number): Promise<void> {}

export async function exportAllData(_db: any): Promise<{
  location_points: LocationPoint[];
  visits: Visit[];
  trips: Trip[];
  daily_summary: DailySummary[];
}> {
  return { location_points: [], visits: [], trips: [], daily_summary: [] };
}
