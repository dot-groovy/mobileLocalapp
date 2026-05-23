import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import type { DailySummary } from '@/src/types';
import { formatDuration } from '@/src/utils/time';

interface TimeDistributionChartProps {
  summary: DailySummary | null;
}

interface BarData {
  label: string;
  value: number;
  color: string;
}

export default function TimeDistributionChart({ summary }: TimeDistributionChartProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const bars: BarData[] = [
    { label: 'Walking', value: summary?.walking_min ?? 0, color: AppColors.walking },
    { label: 'Driving', value: summary?.driving_min ?? 0, color: AppColors.driving },
    { label: 'Stationary', value: summary?.stationary_min ?? 0, color: AppColors.stationary },
  ];

  const maxValue = Math.max(...bars.map(b => b.value), 1);
  const total = bars.reduce((a, b) => a + b.value, 0);

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <Text style={[styles.title, { color: theme.text }]}>Time Distribution</Text>

      {total === 0 ? (
        <Text style={[styles.noData, { color: theme.textSecondary }]}>
          No data yet for today
        </Text>
      ) : (
        <>
          <View style={styles.ringContainer}>
            {bars.map((bar) => {
              const pct = total > 0 ? (bar.value / total) * 100 : 0;
              return (
                <View key={bar.label} style={styles.ringSegment}>
                  <View style={styles.barOuter}>
                    <View
                      style={[
                        styles.barInner,
                        {
                          backgroundColor: bar.color,
                          width: `${(bar.value / maxValue) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.barInfo}>
                    <View style={[styles.dot, { backgroundColor: bar.color }]} />
                    <Text style={[styles.barLabel, { color: theme.text }]}>{bar.label}</Text>
                    <Text style={[styles.barValue, { color: theme.textSecondary }]}>
                      {formatDuration(bar.value)} ({pct.toFixed(0)}%)
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </>
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
  ringContainer: {
    gap: 14,
  },
  ringSegment: {
    gap: 6,
  },
  barOuter: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  barInner: {
    height: '100%',
    borderRadius: 6,
  },
  barInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  barLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 8,
  },
  barValue: {
    fontSize: 12,
  },
});
