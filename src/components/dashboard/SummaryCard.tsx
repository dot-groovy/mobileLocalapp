import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import type { DailySummary } from '@/src/types';
import { formatDuration } from '@/src/utils/time';

interface SummaryCardProps {
  summary: DailySummary | null;
}

interface StatItemProps {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  value: string;
  color: string;
  textColor: string;
  secondaryColor: string;
}

function StatItem({ icon, label, value, color, textColor, secondaryColor }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <FontAwesome name={icon} size={18} color={color} />
      <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: secondaryColor }]}>{label}</Text>
    </View>
  );
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const totalTime = summary
    ? summary.walking_min + summary.driving_min + summary.stationary_min
    : 0;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <Text style={[styles.title, { color: theme.text }]}>Today's Summary</Text>

      <View style={styles.statsRow}>
        <StatItem
          icon="map-marker"
          label="Places"
          value={summary ? `${summary.places_count}` : '0'}
          color={AppColors.stationary}
          textColor={theme.text}
          secondaryColor={theme.textSecondary}
        />
        <StatItem
          icon="road"
          label="Distance"
          value={summary ? `${summary.total_distance_km.toFixed(1)} km` : '0 km'}
          color={AppColors.primary}
          textColor={theme.text}
          secondaryColor={theme.textSecondary}
        />
        <StatItem
          icon="clock-o"
          label="Active"
          value={formatDuration(totalTime)}
          color={AppColors.walking}
          textColor={theme.text}
          secondaryColor={theme.textSecondary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
