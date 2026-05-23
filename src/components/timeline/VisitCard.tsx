import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import type { Visit } from '@/src/types';
import { formatTime, formatDuration } from '@/src/utils/time';

interface VisitCardProps {
  visit: Visit;
}

export default function VisitCard({ visit }: VisitCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const label = visit.address ?? `${visit.lat.toFixed(4)}, ${visit.lng.toFixed(4)}`;
  const isOngoing = !visit.departure_at;

  return (
    <View style={styles.row}>
      <View style={styles.timeline}>
        <View style={[styles.dot, { backgroundColor: AppColors.stationary }]} />
        <View style={[styles.line, { backgroundColor: colorScheme === 'dark' ? AppColors.gray700 : AppColors.gray200 }]} />
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={styles.header}>
          <FontAwesome name="map-pin" size={14} color={AppColors.stationary} />
          <Text style={[styles.placeName, { color: theme.text }]} numberOfLines={2}>
            {label}
          </Text>
        </View>

        <View style={styles.details}>
          <Text style={[styles.time, { color: theme.textSecondary }]}>
            {formatTime(visit.arrival_at)}
            {visit.departure_at ? ` - ${formatTime(visit.departure_at)}` : ''}
          </Text>
          <View style={[styles.badge, { backgroundColor: isOngoing ? AppColors.success + '20' : AppColors.stationary + '20' }]}>
            <Text style={[styles.badgeText, { color: isOngoing ? AppColors.success : AppColors.stationary }]}>
              {isOngoing ? 'Currently here' : formatDuration(visit.duration_minutes)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  timeline: {
    width: 32,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 16,
  },
  line: {
    width: 2,
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  placeName: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
