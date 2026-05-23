import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useDailySummary, useWeeklySummaries } from '@/src/hooks/useDailySummary';
import { useTopPlaces } from '@/src/hooks/useVisits';
import SummaryCard from '@/src/components/dashboard/SummaryCard';
import TimeDistributionChart from '@/src/components/dashboard/TimeDistributionChart';
import TopPlacesChart from '@/src/components/dashboard/TopPlacesChart';
import WeeklyOverview from '@/src/components/dashboard/WeeklyOverview';

export default function DashboardScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [refreshing, setRefreshing] = useState(false);

  const { summary, refresh: refreshSummary } = useDailySummary();
  const { places, refresh: refreshPlaces } = useTopPlaces();
  const { summaries, refresh: refreshWeekly } = useWeeklySummaries();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshSummary(), refreshPlaces(), refreshWeekly()]);
    setRefreshing(false);
  }, [refreshSummary, refreshPlaces, refreshWeekly]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />
      }>
      <SummaryCard summary={summary} />
      <TimeDistributionChart summary={summary} />
      <TopPlacesChart places={places} />
      <WeeklyOverview summaries={summaries} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
});
