import React from 'react';
import { Polyline } from 'react-native-maps';
import type { LocationPoint } from '@/src/types';
import { metersPerSecToKmh } from '@/src/utils/geo';
import { SPEED_THRESHOLDS } from '@/src/utils/constants';
import { AppColors } from '@/constants/Colors';

interface RoutePolylineProps {
  points: LocationPoint[];
}

interface Segment {
  coords: { latitude: number; longitude: number }[];
  color: string;
}

function getSegmentColor(speed: number): string {
  const kmh = metersPerSecToKmh(speed);
  if (kmh < SPEED_THRESHOLDS.STATIONARY_MAX_KMH) return AppColors.stationary;
  if (kmh <= SPEED_THRESHOLDS.WALKING_MAX_KMH) return AppColors.walking;
  return AppColors.driving;
}

export default function RoutePolyline({ points }: RoutePolylineProps) {
  if (points.length < 2) return null;

  const segments: Segment[] = [];
  let currentColor = getSegmentColor(points[0].speed);
  let currentCoords = [{ latitude: points[0].lat, longitude: points[0].lng }];

  for (let i = 1; i < points.length; i++) {
    const color = getSegmentColor(points[i].speed);
    const coord = { latitude: points[i].lat, longitude: points[i].lng };

    if (color !== currentColor) {
      currentCoords.push(coord);
      segments.push({ coords: currentCoords, color: currentColor });
      currentColor = color;
      currentCoords = [coord];
    } else {
      currentCoords.push(coord);
    }
  }

  if (currentCoords.length > 1) {
    segments.push({ coords: currentCoords, color: currentColor });
  }

  return (
    <>
      {segments.map((seg, idx) => (
        <Polyline
          key={idx}
          coordinates={seg.coords}
          strokeColor={seg.color}
          strokeWidth={4}
          lineDashPattern={seg.color === AppColors.stationary ? [5, 5] : undefined}
        />
      ))}
    </>
  );
}
