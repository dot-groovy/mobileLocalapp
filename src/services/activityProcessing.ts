import type { SQLiteDatabase } from 'expo-sqlite';
import type { ActivitySegment, LocationPoint, TransportMode, Trip, Visit } from '@/src/types';
import { ACTIVITY_DETECTION, LOCATION_QUALITY, VISIT_DETECTION } from '@/src/utils/constants';
import { haversineDistance } from '@/src/utils/geo';
import { getDayEnd, getDayStart, getDateString } from '@/src/utils/time';
import {
  getLocationPoints,
  replaceActivitySegments,
  replaceDerivedTimeline,
} from '@/src/database/queries';

interface TrackInterval {
  startAt: number;
  endAt: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  distanceKm: number;
  speedMps: number;
  accuracy: number;
  mode: TransportMode;
  confidence: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function modeForSpeed(speedMps: number, previous: TransportMode): TransportMode {
  if (speedMps <= ACTIVITY_DETECTION.STATIONARY_MAX_MPS) return 'stationary';
  if (speedMps >= ACTIVITY_DETECTION.DRIVING_MIN_MPS) return 'driving';
  if (
    speedMps >= ACTIVITY_DETECTION.WALKING_MIN_MPS &&
    speedMps <= ACTIVITY_DETECTION.WALKING_MAX_MPS
  ) {
    return 'walking';
  }
  // The transition bands deliberately keep the previous state. This
  // hysteresis prevents one noisy fix from changing the whole timeline.
  return previous === 'unknown' ? 'walking' : previous;
}

function makeIntervals(points: LocationPoint[]): TrackInterval[] {
  const sorted = [...points]
    .filter((point) =>
      Number.isFinite(point.lat) &&
      Number.isFinite(point.lng) &&
      point.lat >= -90 &&
      point.lat <= 90 &&
      point.lng >= -180 &&
      point.lng <= 180
    )
    .sort((a, b) => a.timestamp - b.timestamp)
    .filter((point, index, all) => index === 0 || point.timestamp > all[index - 1].timestamp);

  if (sorted.length < 2) return [];

  const intervals: TrackInterval[] = [];
  let filteredLat = sorted[0].lat;
  let filteredLng = sorted[0].lng;
  let previousMode: TransportMode = 'unknown';

  for (let index = 1; index < sorted.length; index++) {
    const previous = sorted[index - 1];
    const current = sorted[index];
    const elapsedMs = current.timestamp - previous.timestamp;
    if (elapsedMs <= 0) continue;

    const previousFilteredLat = filteredLat;
    const previousFilteredLng = filteredLng;
    const accuracy = Math.max(previous.accuracy || 999, current.accuracy || 999);

    if (elapsedMs > LOCATION_QUALITY.MAX_ACTIVITY_GAP_MS) {
      intervals.push({
        startAt: previous.timestamp,
        endAt: current.timestamp,
        startLat: previousFilteredLat,
        startLng: previousFilteredLng,
        endLat: current.lat,
        endLng: current.lng,
        distanceKm: 0,
        speedMps: 0,
        accuracy,
        mode: 'unknown',
        confidence: 0,
      });
      filteredLat = current.lat;
      filteredLng = current.lng;
      previousMode = 'unknown';
      continue;
    }

    // Accuracy-aware low-pass filter. Accurate fixes react quickly; uncertain
    // fixes move the track slowly, reducing stationary GPS drift.
    const quality = clamp(12 / Math.max(current.accuracy || 999, 3), 0.15, 1);
    const alpha = clamp(0.25 + quality * 0.6, 0.3, 0.85);
    filteredLat += (current.lat - filteredLat) * alpha;
    filteredLng += (current.lng - filteredLng) * alpha;

    const rawDistanceM =
      haversineDistance(previousFilteredLat, previousFilteredLng, filteredLat, filteredLng) * 1000;
    const noiseFloorM = clamp(
      Math.min(previous.accuracy || 999, current.accuracy || 999) * 0.2,
      1.5,
      8
    );
    const distanceM = rawDistanceM >= noiseFloorM ? rawDistanceM : 0;
    const elapsedSec = elapsedMs / 1000;
    const derivedSpeed = distanceM / elapsedSec;
    const reportedSpeed =
      current.speed >= 0 && current.speed <= LOCATION_QUALITY.MAX_SPEED_MPS
        ? current.speed
        : null;
    const speedMps =
      reportedSpeed === null ? derivedSpeed : derivedSpeed * 0.55 + reportedSpeed * 0.45;

    const recentSpeeds = intervals
      .slice(-4)
      .filter((item) => item.mode !== 'unknown')
      .map((item) => item.speedMps);
    recentSpeeds.push(speedMps);
    const smoothedSpeed = median(recentSpeeds);
    const reliable = accuracy <= LOCATION_QUALITY.MAX_RELIABLE_ACCURACY_METERS;
    const mode: TransportMode = reliable
      ? modeForSpeed(smoothedSpeed, previousMode)
      : 'unknown';
    const speedConsistency = clamp(1 - Math.abs(speedMps - smoothedSpeed) / 5, 0, 1);
    const confidence = reliable
      ? clamp((1 - accuracy / LOCATION_QUALITY.MAX_RELIABLE_ACCURACY_METERS) * 0.7 +
          speedConsistency * 0.3, 0.1, 1)
      : 0;

    intervals.push({
      startAt: previous.timestamp,
      endAt: current.timestamp,
      startLat: previousFilteredLat,
      startLng: previousFilteredLng,
      endLat: filteredLat,
      endLng: filteredLng,
      distanceKm: distanceM / 1000,
      speedMps,
      accuracy,
      mode,
      confidence,
    });
    previousMode = mode;
  }

  return intervals;
}

function stabilizeModes(intervals: TrackInterval[]): void {
  let changed = true;
  while (changed) {
    changed = false;
    let start = 0;
    while (start < intervals.length) {
      let end = start + 1;
      while (end < intervals.length && intervals[end].mode === intervals[start].mode) end++;

      const mode = intervals[start].mode;
      const duration = intervals[end - 1].endAt - intervals[start].startAt;
      const minimum =
        mode === 'stationary'
          ? ACTIVITY_DETECTION.MIN_STATIONARY_SEGMENT_MS
          : ACTIVITY_DETECTION.MIN_MOVING_SEGMENT_MS;
      const previousMode = start > 0 ? intervals[start - 1].mode : null;
      const nextMode = end < intervals.length ? intervals[end].mode : null;

      if (
        mode !== 'unknown' &&
        duration < minimum &&
        previousMode &&
        previousMode === nextMode &&
        previousMode !== 'unknown'
      ) {
        for (let index = start; index < end; index++) intervals[index].mode = previousMode;
        changed = true;
      }
      start = end;
    }
  }
}

export function buildActivitySegments(points: LocationPoint[]): ActivitySegment[] {
  const intervals = makeIntervals(points);
  stabilizeModes(intervals);
  if (intervals.length === 0) return [];

  const segments: ActivitySegment[] = [];
  for (const interval of intervals) {
    const current = segments[segments.length - 1];
    const distanceKm =
      interval.mode === 'walking' || interval.mode === 'driving' ? interval.distanceKm : 0;

    if (current && current.mode === interval.mode && current.end_at === interval.startAt) {
      const previousDuration = current.end_at - current.start_at;
      const addedDuration = interval.endAt - interval.startAt;
      const totalDuration = previousDuration + addedDuration;
      current.end_at = interval.endAt;
      current.end_lat = interval.endLat;
      current.end_lng = interval.endLng;
      current.distance_km += distanceKm;
      current.confidence =
        totalDuration > 0
          ? (current.confidence * previousDuration + interval.confidence * addedDuration) /
            totalDuration
          : interval.confidence;
    } else {
      segments.push({
        mode: interval.mode,
        start_at: interval.startAt,
        end_at: interval.endAt,
        start_lat: interval.startLat,
        start_lng: interval.startLng,
        end_lat: interval.endLat,
        end_lng: interval.endLng,
        distance_km: distanceKm,
        confidence: interval.confidence,
      });
    }
  }

  return segments;
}

export async function rebuildActivityDay(
  db: SQLiteDatabase,
  dateString = getDateString(),
  now = Date.now()
): Promise<ActivitySegment[]> {
  const start = getDayStart(dateString);
  const end = getDayEnd(dateString);
  const points = await getLocationPoints(db, start, end);
  const segments = buildActivitySegments(points);
  await replaceActivitySegments(db, start, end, segments);

  const visits: Omit<Visit, 'id'>[] = [];
  const trips: Omit<Trip, 'id'>[] = [];
  const lastSegment = segments[segments.length - 1];

  for (const segment of segments) {
    const durationMs = segment.end_at - segment.start_at;
    if (segment.mode === 'stationary' && durationMs >= VISIT_DETECTION.MIN_DURATION_MS) {
      const ongoing =
        segment === lastSegment &&
        dateString === getDateString(now) &&
        now - segment.end_at <= LOCATION_QUALITY.MAX_ACTIVITY_GAP_MS;
      visits.push({
        lat: (segment.start_lat + segment.end_lat) / 2,
        lng: (segment.start_lng + segment.end_lng) / 2,
        address: null,
        arrival_at: segment.start_at,
        departure_at: ongoing ? null : segment.end_at,
        duration_minutes: durationMs / 60000,
      });
    } else if (
      (segment.mode === 'walking' || segment.mode === 'driving') &&
      durationMs >= ACTIVITY_DETECTION.MIN_MOVING_SEGMENT_MS &&
      segment.distance_km >= 0.005
    ) {
      trips.push({
        start_lat: segment.start_lat,
        start_lng: segment.start_lng,
        end_lat: segment.end_lat,
        end_lng: segment.end_lng,
        start_at: segment.start_at,
        end_at: segment.end_at,
        transport_mode: segment.mode,
        distance_km: segment.distance_km,
      });
    }
  }

  await replaceDerivedTimeline(db, start, end, visits, trips);
  return segments;
}
