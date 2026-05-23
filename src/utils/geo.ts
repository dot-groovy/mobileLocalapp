const DEG_TO_RAD = Math.PI / 180;
const EARTH_RADIUS_KM = 6371;

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = (lat2 - lat1) * DEG_TO_RAD;
  const dLng = (lng2 - lng1) * DEG_TO_RAD;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * DEG_TO_RAD) *
      Math.cos(lat2 * DEG_TO_RAD) *
      Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function metersPerSecToKmh(mps: number): number {
  return mps * 3.6;
}

export function kmhToMetersPerSec(kmh: number): number {
  return kmh / 3.6;
}

export function smoothSpeeds(speeds: number[], windowSize = 3): number[] {
  if (speeds.length <= windowSize) {
    const avg = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    return speeds.map(() => avg);
  }
  const result: number[] = [];
  for (let i = 0; i < speeds.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(speeds.length, i + Math.ceil(windowSize / 2) + 1);
    const window = speeds.slice(start, end);
    result.push(window.reduce((a, b) => a + b, 0) / window.length);
  }
  return result;
}
