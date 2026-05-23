import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import type { Visit } from '@/src/types';
import { formatDuration, formatTime } from '@/src/utils/time';
import { AppColors } from '@/constants/Colors';

interface VisitMarkerProps {
  visit: Visit;
}

export default function VisitMarker({ visit }: VisitMarkerProps) {
  const label = visit.address ?? `${visit.lat.toFixed(4)}, ${visit.lng.toFixed(4)}`;

  return (
    <Marker
      coordinate={{ latitude: visit.lat, longitude: visit.lng }}
      pinColor={AppColors.stationary}>
      <Callout>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle} numberOfLines={2}>{label}</Text>
          <Text style={styles.calloutTime}>
            {formatTime(visit.arrival_at)}
            {visit.departure_at ? ` - ${formatTime(visit.departure_at)}` : ' - now'}
          </Text>
          <Text style={styles.calloutDuration}>{formatDuration(visit.duration_minutes)}</Text>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  callout: {
    padding: 8,
    minWidth: 150,
    maxWidth: 220,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray900,
    marginBottom: 4,
  },
  calloutTime: {
    fontSize: 12,
    color: AppColors.gray600,
  },
  calloutDuration: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.primary,
    marginTop: 4,
  },
});
