import type { SQLiteDatabase } from 'expo-sqlite';
<<<<<<< HEAD
import { getLocationPoints, getVisits, getTrips, upsertDailySummary } from '@/src/database/queries';
import { getDayStart, getDayEnd, getDateString } from '@/src/utils/time';
import { metersPerSecToKmh, haversineDistance } from '@/src/utils/geo';
import { SPEED_THRESHOLDS } from '@/src/utils/constants';
=======
import { getActivitySegments, getVisits, upsertDailySummary } from '@/src/database/queries';
import { getDayStart, getDayEnd, getDateString } from '@/src/utils/time';
>>>>>>> adf99c4 (atualização)

export async function recalculateDailySummary(
  db: SQLiteDatabase,
  dateString?: string
): Promise<void> {
  const date = dateString ?? getDateString();
  const start = getDayStart(date);
  const end = getDayEnd(date);

<<<<<<< HEAD
  const points = await getLocationPoints(db, start, end);
  const visits = await getVisits(db, start, end);
  const trips = await getTrips(db, start, end);

  let totalDistanceKm = 0;
=======
  const visits = await getVisits(db, start, end);
  const segments = await getActivitySegments(db, start, end);

  let walkingDistanceKm = 0;
>>>>>>> adf99c4 (atualização)
  let walkingMin = 0;
  let drivingMin = 0;
  let stationaryMin = 0;

<<<<<<< HEAD
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
=======
  for (const segment of segments) {
    const overlapStart = Math.max(start, segment.start_at);
    const overlapEnd = Math.min(end, segment.end_at);
    const overlapMs = Math.max(0, overlapEnd - overlapStart);
    const fullDurationMs = segment.end_at - segment.start_at;
    if (overlapMs === 0 || fullDurationMs <= 0) continue;

    const durationMin = overlapMs / 60000;
    const fraction = overlapMs / fullDurationMs;
    if (segment.mode === 'walking') {
      walkingMin += durationMin;
      walkingDistanceKm += segment.distance_km * fraction;
    } else if (segment.mode === 'driving') {
      drivingMin += durationMin;
    } else if (segment.mode === 'stationary') {
      stationaryMin += durationMin;
>>>>>>> adf99c4 (atualização)
    }
  }

  const completedVisits = visits.filter(v => v.departure_at !== null);

  await upsertDailySummary(db, {
    date,
<<<<<<< HEAD
    total_distance_km: Math.round(totalDistanceKm * 100) / 100,
    walking_min: Math.round(walkingMin),
    driving_min: Math.round(drivingMin),
    stationary_min: Math.round(stationaryMin),
=======
    // This field is kept for UI compatibility; it now intentionally means
    // distance walked, which is the primary metric of the application.
    total_distance_km: Math.round(walkingDistanceKm * 100) / 100,
    walking_min: Math.round(walkingMin * 100) / 100,
    driving_min: Math.round(drivingMin * 100) / 100,
    stationary_min: Math.round(stationaryMin * 100) / 100,
>>>>>>> adf99c4 (atualização)
    places_count: completedVisits.length,
  });
}
