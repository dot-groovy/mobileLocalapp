import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useVisits } from '@/src/hooks/useVisits';
import { useTrips } from '@/src/hooks/useTrips';
import { getDateString } from '@/src/utils/time';
import DaySelector from '@/src/components/common/DaySelector';
import EmptyState from '@/src/components/common/EmptyState';
import LoadingSpinner from '@/src/components/common/LoadingSpinner';
import VisitCard from '@/src/components/timeline/VisitCard';
import TripCard from '@/src/components/timeline/TripCard';
import type { TimelineEvent } from '@/src/types';

export default function TimelineScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [selectedDate, setSelectedDate] = useState(getDateString());
  const [refreshing, setRefreshing] = useState(false);

  const { visits, loading: visitsLoading, refresh: refreshVisits } = useVisits(selectedDate);
  const { trips, loading: tripsLoading, refresh: refreshTrips } = useTrips(selectedDate);

  const loading = visitsLoading || tripsLoading;

  const events: TimelineEvent[] = useMemo(() => {
    const all: TimelineEvent[] = [
      ...visits.map(v => ({ type: 'visit' as const, data: v, timestamp: v.arrival_at })),
      ...trips.map(t => ({ type: 'trip' as const, data: t, timestamp: t.start_at })),
    ];
    return all.sort((a, b) => a.timestamp - b.timestamp);
  }, [visits, trips]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshVisits(), refreshTrips()]);
    setRefreshing(false);
  }, [refreshVisits, refreshTrips]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <DaySelector dateString={selectedDate} onDateChange={setSelectedDate} />

      {loading ? (
        <LoadingSpinner message="Loading timeline..." />
      ) : events.length === 0 ? (
        <EmptyState
          icon="clock-o"
          title="No activity yet"
          subtitle="Your visits and trips will appear here as your day progresses."
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />
          }>
          {events.map((event, idx) =>
            event.type === 'visit' ? (
              <VisitCard key={`visit-${event.data.id}`} visit={event.data as any} />
            ) : (
              <TripCard key={`trip-${event.data.id}`} trip={event.data as any} />
            )
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingLeft: 8,
    paddingBottom: 32,
  },
});
