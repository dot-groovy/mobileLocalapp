<<<<<<< HEAD
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
=======
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
>>>>>>> adf99c4 (atualização)
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import type { DailySummary } from '@/src/types';
import { formatDuration } from '@/src/utils/time';

interface TimeDistributionChartProps {
  summary: DailySummary | null;
<<<<<<< HEAD
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
=======
  delay?: number;
}

export default function TimeDistributionChart({
  summary,
  delay = 0,
}: TimeDistributionChartProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const modes = [
    { key: 'walking', label: 'Walking', value: summary?.walking_min ?? 0, color: AppColors.walking },
    { key: 'driving', label: 'Driving', value: summary?.driving_min ?? 0, color: AppColors.driving },
    { key: 'stationary', label: 'Still', value: summary?.stationary_min ?? 0, color: AppColors.stationary },
  ];

  const total = modes.reduce((a, m) => a + m.value, 0);
  const activeModes = modes.filter(m => m.value > 0);
  const trackColor = isDark ? 'rgba(255,255,255,0.06)' : AppColors.gray100;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: isDark ? 'rgba(255,255,255,0.06)' : theme.cardBorder,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: theme.text }]}>Activity Breakdown</Text>
        {total > 0 && (
          <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>
            {formatDuration(total)}
          </Text>
        )}
      </View>

      {total === 0 ? (
        <View>
          <View style={[styles.barTrack, { backgroundColor: trackColor }]} />
          <Text style={[styles.noData, { color: theme.textSecondary }]}>
            No activity recorded yet
          </Text>
        </View>
      ) : (
        <>
          <View style={[styles.barTrack, { backgroundColor: trackColor }]}>
            {activeModes.map((mode, idx) => (
              <View
                key={mode.key}
                style={[
                  { flex: mode.value, backgroundColor: mode.color },
                  idx === 0 && { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 },
                  idx === activeModes.length - 1 && {
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.legend}>
            {modes.map(mode => {
              const pct = total > 0 ? Math.round((mode.value / total) * 100) : 0;
              return (
                <View
                  key={mode.key}
                  style={[styles.legendItem, { backgroundColor: mode.color + '10' }]}
                >
                  <View style={[styles.legendDot, { backgroundColor: mode.color }]} />
                  <Text style={[styles.legendLabel, { color: theme.text }]}>{mode.label}</Text>
                  <Text style={[styles.legendValue, { color: theme.textSecondary }]}>
                    {mode.value > 0 ? `${formatDuration(mode.value)} \u00B7 ${pct}%` : '\u2014'}
                  </Text>
>>>>>>> adf99c4 (atualização)
                </View>
              );
            })}
          </View>
        </>
      )}
<<<<<<< HEAD
    </View>
=======
    </Animated.View>
>>>>>>> adf99c4 (atualização)
  );
}

const styles = StyleSheet.create({
  card: {
<<<<<<< HEAD
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 12,
=======
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
>>>>>>> adf99c4 (atualização)
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
<<<<<<< HEAD
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
=======
    letterSpacing: 0.2,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  barTrack: {
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  noData: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 18,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  legendValue: {
    fontSize: 11,
    fontWeight: '500',
>>>>>>> adf99c4 (atualização)
  },
});
