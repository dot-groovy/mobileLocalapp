import type { SQLiteDatabase } from 'expo-sqlite';
import { getLocationPoints, getVisits, getTrips, upsertDailySummary } from '@/src/database/queries';
import { getDayStart, getDayEnd, getDateString } from '@/src/utils/time';
import { metersPerSecToKmh, haversineDistance } from '@/src/utils/geo';
import { SPEED_THRESHOLDS } from '@/src/utils/constants';

export async function recalculateDailySummary(
  db: SQLiteDatabase,
  dateString?: string
): Promise<void> {
  const date = dateString ?? getDateString();
  const start = getDayStart(date);
  const end = getDayEnd(date);

  const points = await getLocationPoints(db, start, end);
  const visits = await getVisits(db, start, end);
  const trips = await getTrips(db, start, end);

  let totalDistanceKm = 0;
  let walkingMin = 0;
  let drivingMin = 0;
  let stationaryMin = 0;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const segmentDist = haversineDistance(prev.lat, prev.lng, curr.lat, curr.lng);
    totalDistanceKm += segmentDist;

    const timeDiffMin = (curr.timestamp - prev.timestamp) / 60000;
    const avgSpeed = metersPerSecToKmh((prev.speed + curr.speed) / 2);

    if (avgSpeed < SPEED_THRESHOLDS.STATIONARY_MAX_KMH) {
      stationaryMin += timeDiffMin;
    } else if (avgSpeed <= SPEED_THRESHOLDS.WALKING_MAX_KMH) {
      walkingMin += timeDiffMin;
    } else {
      drivingMin += timeDiffMin;
    }
  }

  for (const trip of trips) {
    if (trip.distance_km > 0) {
      totalDistanceKm = Math.max(totalDistanceKm, trip.distance_km);
    }
  }

  const completedVisits = visits.filter(v => v.departure_at !== null);

  await upsertDailySummary(db, {
    date,
    total_distance_km: Math.round(totalDistanceKm * 100) / 100,
    walking_min: Math.round(walkingMin),
    driving_min: Math.round(drivingMin),
    stationary_min: Math.round(stationaryMin),
    places_count: completedVisits.length,
  });
}
