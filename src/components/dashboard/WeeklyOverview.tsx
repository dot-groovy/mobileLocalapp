<<<<<<< HEAD
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
=======
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import { haptic } from '@/src/utils/haptics';
>>>>>>> adf99c4 (atualização)
import type { DailySummary } from '@/src/types';

interface WeeklyOverviewProps {
  summaries: DailySummary[];
<<<<<<< HEAD
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
=======
  delay?: number;
}

export default function WeeklyOverview({ summaries, delay = 0 }: WeeklyOverviewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxDist = Math.max(...summaries.map(s => s.total_distance_km), 0.1);
  const totalWeekDist = summaries.reduce((a, s) => a + s.total_distance_km, 0);

  const dayData = days.map((label, i) => {
    const dayOfWeek = i + 1;
    const match = summaries.find(s => new Date(s.date).getDay() === dayOfWeek % 7);
    return {
      label,
      distance: match?.total_distance_km ?? 0,
    };
  });

  const emptyColor = isDark ? 'rgba(255,255,255,0.06)' : AppColors.gray200;

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
        <Text style={[styles.title, { color: theme.text }]}>This Week</Text>
        {totalWeekDist > 0 && (
          <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>
            {totalWeekDist.toFixed(1)} km
          </Text>
        )}
      </View>
>>>>>>> adf99c4 (atualização)

      {summaries.length === 0 ? (
        <Text style={[styles.noData, { color: theme.textSecondary }]}>
          No data for the past week
        </Text>
      ) : (
        <View style={styles.barsContainer}>
<<<<<<< HEAD
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
=======
          {dayData.map((day, idx) => {
            const heightPct = day.distance > 0
              ? Math.max((day.distance / maxDist) * 80, 8)
              : 8;
            const hasData = day.distance > 0;
            const isToday = idx === (new Date().getDay() + 6) % 7;
            return (
              <TouchableOpacity
                key={idx}
                style={styles.barColumn}
                activeOpacity={0.7}
                onPress={() => {
                  if (hasData) haptic.light();
                }}
              >
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: heightPct,
                        backgroundColor: hasData
                          ? isToday
                            ? AppColors.primaryLight
                            : AppColors.primaryLight + '50'
                          : emptyColor,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.dayLabel,
                    {
                      color: isToday ? AppColors.primaryLight : theme.textSecondary,
                      fontWeight: isToday ? '700' : '500',
                    },
                  ]}
                >
                  {day.label}
                </Text>
                {hasData && (
                  <Text style={[styles.distLabel, { color: theme.textSecondary }]}>
                    {day.distance.toFixed(1)}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
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
=======
    letterSpacing: 0.2,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  noData: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 22,
>>>>>>> adf99c4 (atualização)
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
<<<<<<< HEAD
    height: 100,
=======
    height: 110,
>>>>>>> adf99c4 (atualização)
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    flex: 1,
<<<<<<< HEAD
    width: '60%',
=======
    width: '55%',
>>>>>>> adf99c4 (atualização)
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
<<<<<<< HEAD
    borderRadius: 4,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 10,
    marginTop: 6,
=======
    minHeight: 8,
    borderRadius: 5,
  },
  dayLabel: {
    fontSize: 10,
    marginTop: 8,
    letterSpacing: 0.2,
  },
  distLabel: {
    fontSize: 8,
    marginTop: 2,
>>>>>>> adf99c4 (atualização)
    fontWeight: '500',
  },
});
