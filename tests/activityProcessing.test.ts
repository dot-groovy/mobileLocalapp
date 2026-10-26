import assert from 'node:assert/strict';
import { buildActivitySegments } from '../src/services/activityProcessing';
import type { LocationPoint } from '../src/types';

const METERS_PER_DEGREE = 111_320;

function point(
  id: number,
  metersNorth: number,
  timestamp: number,
  accuracy = 5,
  speed = -1
): LocationPoint {
  return {
    id,
    lat: 38.7 + metersNorth / METERS_PER_DEGREE,
    lng: -9.1,
    speed,
    heading: 0,
    accuracy,
    altitude: 0,
    timestamp,
  };
}

function testStationaryNoise(): void {
  const start = 1_700_000_000_000;
  const points = Array.from({ length: 25 }, (_, index) =>
    point(index, index % 2 === 0 ? 0.4 : -0.4, start + index * 5_000)
  );
  const segments = buildActivitySegments(points);
  assert.equal(segments.length, 1);
  assert.equal(segments[0].mode, 'stationary');
  assert.equal(segments[0].distance_km, 0);
}

function testWalkingDistance(): void {
  const start = 1_700_000_000_000;
  const points = Array.from({ length: 25 }, (_, index) =>
    point(index, index * 7, start + index * 5_000)
  );
  const segments = buildActivitySegments(points);
  const walkedKm = segments
    .filter((segment) => segment.mode === 'walking')
    .reduce((total, segment) => total + segment.distance_km, 0);
  assert.ok(walkedKm > 0.13 && walkedKm < 0.18, `unexpected walking distance: ${walkedKm}`);
}

function testMissingDataIsUnknown(): void {
  const start = 1_700_000_000_000;
  const points = [
    point(1, 0, start),
    point(2, 0, start + 5_000),
    point(3, 0, start + 5 * 60_000),
  ];
  const segments = buildActivitySegments(points);
  assert.ok(segments.some((segment) => segment.mode === 'unknown'));
}

function testPoorAccuracyIsUnknown(): void {
  const start = 1_700_000_000_000;
  const points = [
    point(1, 0, start, 70),
    point(2, 7, start + 5_000, 70),
    point(3, 14, start + 10_000, 70),
  ];
  const segments = buildActivitySegments(points);
  assert.ok(segments.every((segment) => segment.mode === 'unknown'));
}

testStationaryNoise();
testWalkingDistance();
testMissingDataIsUnknown();
testPoorAccuracyIsUnknown();
console.log('activityProcessing tests passed');
