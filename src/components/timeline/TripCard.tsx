import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import type { Trip, TransportMode } from '@/src/types';
import { formatTime, formatDuration } from '@/src/utils/time';

interface TripCardProps {
  trip: Trip;
}

const modeConfig: Record<TransportMode, { icon: React.ComponentProps<typeof FontAwesome>['name']; color: string; label: string }> = {
  walking: { icon: 'male', color: AppColors.walking, label: 'Walking' },
  driving: { icon: 'car', color: AppColors.driving, label: 'Driving' },
  stationary: { icon: 'pause', color: AppColors.stationary, label: 'Stationary' },
  unknown: { icon: 'question', color: AppColors.gray400, label: 'Unknown' },
};

export default function TripCard({ trip }: TripCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const config = modeConfig[trip.transport_mode] ?? modeConfig.unknown;
  const durationMin = (trip.end_at - trip.start_at) / 60000;

  return (
    <View style={styles.row}>
      <View style={styles.timeline}>
        <View style={[styles.iconCircle, { backgroundColor: config.color + '20' }]}>
          <FontAwesome name={config.icon} size={12} color={config.color} />
        </View>
        <View style={[styles.line, { backgroundColor: colorScheme === 'dark' ? AppColors.gray700 : AppColors.gray200 }]} />
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
        <View style={styles.header}>
          <Text style={[styles.modeLabel, { color: config.color }]}>{config.label}</Text>
          <Text style={[styles.time, { color: theme.textSecondary }]}>
            {formatTime(trip.start_at)} - {formatTime(trip.end_at)}
          </Text>
        </View>
        <View style={styles.stats}>
          <Text style={[styles.stat, { color: theme.text }]}>
            {trip.distance_km.toFixed(1)} km
          </Text>
          <Text style={[styles.statDivider, { color: theme.textSecondary }]}> &middot; </Text>
          <Text style={[styles.stat, { color: theme.text }]}>
            {formatDuration(durationMin)}
          </Text>
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
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  line: {
    width: 2,
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    fontSize: 13,
    fontWeight: '500',
  },
  statDivider: {
    fontSize: 13,
  },
});
