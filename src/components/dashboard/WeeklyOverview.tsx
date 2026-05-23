import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import type { DailySummary } from '@/src/types';

interface WeeklyOverviewProps {
  summaries: DailySummary[];
}

export default function WeeklyOverview({ summaries }: WeeklyOverviewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxDist = Math.max(...summaries.map(s => s.total_distance_km), 0.1);

  const dayData = days.map((label, i) => {
    const dayOfWeek = i + 1;
    const match = summaries.find(s => new Date(s.date).getDay() === (dayOfWeek % 7));
    return {
      label,
      distance: match?.total_distance_km ?? 0,
      places: match?.places_count ?? 0,
    };
  });

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <Text style={[styles.title, { color: theme.text }]}>Last 7 Days</Text>

      {summaries.length === 0 ? (
        <Text style={[styles.noData, { color: theme.textSecondary }]}>
          No data for the past week
        </Text>
      ) : (
        <View style={styles.barsContainer}>
          {dayData.map((day, idx) => (
            <View key={idx} style={styles.barColumn}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${Math.max((day.distance / maxDist) * 100, 4)}%`,
                      backgroundColor: day.distance > 0 ? AppColors.primary : (colorScheme === 'dark' ? AppColors.gray700 : AppColors.gray200),
                    },
                  ]}
                />
              </View>
              <Text style={[styles.dayLabel, { color: theme.textSecondary }]}>{day.label}</Text>
            </View>
          ))}
        </View>
      )}
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
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  noData: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    flex: 1,
    width: '60%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 10,
    marginTop: 6,
    fontWeight: '500',
  },
});
