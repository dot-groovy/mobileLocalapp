import type { SQLiteDatabase } from 'expo-sqlite';
import type { LocationPoint } from '@/src/types';
import { VISIT_DETECTION } from '@/src/utils/constants';
import { haversineDistance } from '@/src/utils/geo';
import { getOpenVisit, insertVisit, updateVisitDeparture } from '@/src/database/queries';
import { classifyTransportMode } from './transportDetection';

export async function processVisitDetection(
  db: SQLiteDatabase,
  points: LocationPoint[]
): Promise<void> {
  if (points.length === 0) return;

<<<<<<< HEAD
  const openVisit = await getOpenVisit(db);

  for (const point of points) {
=======
  const sortedPoints = [...points].sort((a, b) => a.timestamp - b.timestamp);
  let openVisit = await getOpenVisit(db);

  for (const point of sortedPoints) {
>>>>>>> adf99c4 (atualização)
    const mode = classifyTransportMode(point.speed);

    if (mode === 'stationary') {
      if (openVisit) {
        const distFromVisit = haversineDistance(
          openVisit.lat,
          openVisit.lng,
          point.lat,
          point.lng
        ) * 1000;

        if (distFromVisit <= VISIT_DETECTION.CLUSTER_RADIUS_METERS) {
<<<<<<< HEAD
          const durationMs = point.timestamp - openVisit.arrival_at;
          await updateVisitDeparture(db, openVisit.id, point.timestamp, durationMs / 60000);
        } else {
          const durationMs = point.timestamp - openVisit.arrival_at;
          if (durationMs >= VISIT_DETECTION.MIN_DURATION_MS) {
            await updateVisitDeparture(db, openVisit.id, point.timestamp, durationMs / 60000);
          }
          await insertVisit(db, {
=======
          if (point.timestamp > openVisit.arrival_at) {
            const durationMs = point.timestamp - openVisit.arrival_at;
            await updateVisitDeparture(db, openVisit.id, point.timestamp, durationMs / 60000);
          }
        } else {
          const durationMs = point.timestamp - openVisit.arrival_at;
          if (durationMs >= VISIT_DETECTION.MIN_DURATION_MS && point.timestamp > openVisit.arrival_at) {
            await updateVisitDeparture(db, openVisit.id, point.timestamp, durationMs / 60000);
          }
          const newId = await insertVisit(db, {
>>>>>>> adf99c4 (atualização)
            lat: point.lat,
            lng: point.lng,
            address: null,
            arrival_at: point.timestamp,
            departure_at: null,
            duration_minutes: 0,
          });
<<<<<<< HEAD
        }
      } else {
        await insertVisit(db, {
=======
          openVisit = {
            id: newId,
            lat: point.lat,
            lng: point.lng,
            address: null,
            arrival_at: point.timestamp,
            departure_at: null,
            duration_minutes: 0,
          };
        }
      } else {
        const newId = await insertVisit(db, {
>>>>>>> adf99c4 (atualização)
          lat: point.lat,
          lng: point.lng,
          address: null,
          arrival_at: point.timestamp,
          departure_at: null,
          duration_minutes: 0,
        });
<<<<<<< HEAD
      }
    } else if (openVisit) {
      const durationMs = point.timestamp - openVisit.arrival_at;
      await updateVisitDeparture(db, openVisit.id, point.timestamp, durationMs / 60000);
=======
        openVisit = {
          id: newId,
          lat: point.lat,
          lng: point.lng,
          address: null,
          arrival_at: point.timestamp,
          departure_at: null,
          duration_minutes: 0,
        };
      }
    } else if (openVisit) {
      if (point.timestamp > openVisit.arrival_at) {
        const durationMs = point.timestamp - openVisit.arrival_at;
        await updateVisitDeparture(db, openVisit.id, point.timestamp, Math.max(0, durationMs / 60000));
      }
      openVisit = null;
>>>>>>> adf99c4 (atualização)
    }
  }
}
