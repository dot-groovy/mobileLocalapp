import type { TransportMode } from '@/src/types';
import { SPEED_THRESHOLDS } from '@/src/utils/constants';
import { metersPerSecToKmh, smoothSpeeds } from '@/src/utils/geo';

export function classifyTransportMode(speedMps: number): TransportMode {
  const kmh = metersPerSecToKmh(Math.max(0, speedMps));
  if (kmh < SPEED_THRESHOLDS.STATIONARY_MAX_KMH) return 'stationary';
  if (kmh <= SPEED_THRESHOLDS.WALKING_MAX_KMH) return 'walking';
  if (kmh >= SPEED_THRESHOLDS.DRIVING_MIN_KMH) return 'driving';
  return 'unknown';
}

export function classifyTransportModeSmoothed(
  recentSpeedsMps: number[]
): TransportMode {
  if (recentSpeedsMps.length === 0) return 'unknown';
  const smoothed = smoothSpeeds(recentSpeedsMps.map(metersPerSecToKmh));
  const avgKmh = smoothed.reduce((a, b) => a + b, 0) / smoothed.length;

  if (avgKmh < SPEED_THRESHOLDS.STATIONARY_MAX_KMH) return 'stationary';
  if (avgKmh <= SPEED_THRESHOLDS.WALKING_MAX_KMH) return 'walking';
  if (avgKmh >= SPEED_THRESHOLDS.DRIVING_MIN_KMH) return 'driving';

  const counts: Record<TransportMode, number> = {
    stationary: 0,
    walking: 0,
    driving: 0,
    unknown: 0,
  };
  for (const s of smoothed) {
    counts[classifySingleKmh(s)]++;
  }

  let best: TransportMode = 'unknown';
  let bestCount = 0;
  for (const [mode, count] of Object.entries(counts) as [TransportMode, number][]) {
    if (count > bestCount) {
      bestCount = count;
      best = mode;
    }
  }
  return best;
}

function classifySingleKmh(kmh: number): TransportMode {
  if (kmh < SPEED_THRESHOLDS.STATIONARY_MAX_KMH) return 'stationary';
  if (kmh <= SPEED_THRESHOLDS.WALKING_MAX_KMH) return 'walking';
  if (kmh >= SPEED_THRESHOLDS.DRIVING_MIN_KMH) return 'driving';
  return 'unknown';
}
