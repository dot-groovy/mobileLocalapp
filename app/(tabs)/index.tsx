<<<<<<< HEAD
import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useDailySummary, useWeeklySummaries } from '@/src/hooks/useDailySummary';
import { useTopPlaces } from '@/src/hooks/useVisits';
=======
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, RefreshControl, View, Text, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import { useDailySummary, useWeeklySummaries } from '@/src/hooks/useDailySummary';
import { useTopPlaces } from '@/src/hooks/useVisits';
import { useTrackingStatus } from '@/src/hooks/useTrackingStatus';
import { haptic } from '@/src/utils/haptics';
>>>>>>> adf99c4 (atualização)
import SummaryCard from '@/src/components/dashboard/SummaryCard';
import TimeDistributionChart from '@/src/components/dashboard/TimeDistributionChart';
import TopPlacesChart from '@/src/components/dashboard/TopPlacesChart';
import WeeklyOverview from '@/src/components/dashboard/WeeklyOverview';

<<<<<<< HEAD
export default function DashboardScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [refreshing, setRefreshing] = useState(false);
=======
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

function getDateLabel(): string {
  return new Date().toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export default function DashboardScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(12)).current;
>>>>>>> adf99c4 (atualização)

  const { summary, refresh: refreshSummary } = useDailySummary();
  const { places, refresh: refreshPlaces } = useTopPlaces();
  const { summaries, refresh: refreshWeekly } = useWeeklySummaries();
<<<<<<< HEAD

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshSummary(), refreshPlaces(), refreshWeekly()]);
=======
  const { isActive } = useTrackingStatus();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(headerSlide, {
        toValue: 0,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    haptic.light();
    await Promise.all([refreshSummary(), refreshPlaces(), refreshWeekly()]);
    haptic.success();
>>>>>>> adf99c4 (atualização)
    setRefreshing(false);
  }, [refreshSummary, refreshPlaces, refreshWeekly]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
<<<<<<< HEAD
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />
      }>
      <SummaryCard summary={summary} />
      <TimeDistributionChart summary={summary} />
      <TopPlacesChart places={places} />
      <WeeklyOverview summaries={summaries} />
=======
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />
      }
    >
      <Animated.View
        style={[
          styles.header,
          { opacity: headerFade, transform: [{ translateY: headerSlide }] },
        ]}
      >
        <View>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>{getGreeting()}</Text>
          <Text style={[styles.dateLabel, { color: theme.text }]}>{getDateLabel()}</Text>
        </View>
        {!isActive && (
          <View style={[styles.pausedPill, { backgroundColor: AppColors.warning + '15' }]}>
            <FontAwesome name="pause-circle" size={12} color={AppColors.warning} />
            <Text style={[styles.pausedText, { color: AppColors.warning }]}>Paused</Text>
          </View>
        )}
      </Animated.View>

      <SummaryCard summary={summary} delay={80} />
      <TimeDistributionChart summary={summary} delay={160} />
      <TopPlacesChart places={places} delay={240} />
      <WeeklyOverview summaries={summaries} delay={320} />
>>>>>>> adf99c4 (atualização)
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
<<<<<<< HEAD
    padding: 16,
    paddingBottom: 32,
  },
=======
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 2,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  dateLabel: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  pausedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  pausedText: {
    fontSize: 12,
    fontWeight: '600',
  },
>>>>>>> adf99c4 (atualização)
});
