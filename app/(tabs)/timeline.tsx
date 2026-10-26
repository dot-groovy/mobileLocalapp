<<<<<<< HEAD
import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl } from 'react-native';
=======
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
>>>>>>> adf99c4 (atualização)
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useVisits } from '@/src/hooks/useVisits';
import { useTrips } from '@/src/hooks/useTrips';
<<<<<<< HEAD
import { getDateString } from '@/src/utils/time';
import DaySelector from '@/src/components/common/DaySelector';
import EmptyState from '@/src/components/common/EmptyState';
import LoadingSpinner from '@/src/components/common/LoadingSpinner';
import VisitCard from '@/src/components/timeline/VisitCard';
import TripCard from '@/src/components/timeline/TripCard';
import type { TimelineEvent } from '@/src/types';
=======
import { useRouteSelection } from '@/src/contexts/RouteSelectionContext';
import { getDateString } from '@/src/utils/time';
import { haptic } from '@/src/utils/haptics';
import DaySelector from '@/src/components/common/DaySelector';
import EmptyState from '@/src/components/common/EmptyState';
import { TimelineSkeleton } from '@/src/components/common/SkeletonLoader';
import VisitCard from '@/src/components/timeline/VisitCard';
import TripCard from '@/src/components/timeline/TripCard';
import GapCard from '@/src/components/timeline/GapCard';
import type { Trip, Visit } from '@/src/types';

interface VisitEvent {
  key: string;
  kind: 'visit';
  data: Visit;
  timestamp: number;
}
interface TripEvent {
  key: string;
  kind: 'trip';
  data: Trip;
  timestamp: number;
}
interface GapEvent {
  key: string;
  kind: 'gap';
  startAt: number;
  endAt: number;
  timestamp: number;
}

type AnyEvent = VisitEvent | TripEvent | GapEvent;

const MIN_GAP_MS = 20 * 60 * 1000;
>>>>>>> adf99c4 (atualização)

export default function TimelineScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
<<<<<<< HEAD
  const [selectedDate, setSelectedDate] = useState(getDateString());
  const [refreshing, setRefreshing] = useState(false);
=======
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(getDateString());
  const [refreshing, setRefreshing] = useState(false);
  const { focusEventId, focusEvent } = useRouteSelection();
  const scrollRef = useRef<ScrollView | null>(null);
  const offsetsRef = useRef<Record<string, number>>({});
>>>>>>> adf99c4 (atualização)

  const { visits, loading: visitsLoading, refresh: refreshVisits } = useVisits(selectedDate);
  const { trips, loading: tripsLoading, refresh: refreshTrips } = useTrips(selectedDate);

  const loading = visitsLoading || tripsLoading;

<<<<<<< HEAD
  const events: TimelineEvent[] = useMemo(() => {
    const all: TimelineEvent[] = [
      ...visits.map(v => ({ type: 'visit' as const, data: v, timestamp: v.arrival_at })),
      ...trips.map(t => ({ type: 'trip' as const, data: t, timestamp: t.start_at })),
    ];
    return all.sort((a, b) => a.timestamp - b.timestamp);
=======
  const events = useMemo<AnyEvent[]>(() => {
    const combined: (VisitEvent | TripEvent)[] = [
      ...visits.map<VisitEvent>(v => ({
        key: `visit-${v.id}`,
        kind: 'visit',
        data: v,
        timestamp: v.arrival_at,
      })),
      ...trips.map<TripEvent>(t => ({
        key: `trip-${t.id}`,
        kind: 'trip',
        data: t,
        timestamp: t.start_at,
      })),
    ].sort((a, b) => a.timestamp - b.timestamp);

    const result: AnyEvent[] = [];
    for (let i = 0; i < combined.length; i++) {
      const current = combined[i];
      if (i > 0) {
        const prev = combined[i - 1];
        const prevEnd =
          prev.kind === 'visit'
            ? prev.data.departure_at ?? prev.data.arrival_at
            : prev.data.end_at;
        const gap = current.timestamp - prevEnd;
        if (gap >= MIN_GAP_MS) {
          result.push({
            key: `gap-${prevEnd}-${current.timestamp}`,
            kind: 'gap',
            startAt: prevEnd,
            endAt: current.timestamp,
            timestamp: prevEnd,
          });
        }
      }
      result.push(current);
    }
    return result;
>>>>>>> adf99c4 (atualização)
  }, [visits, trips]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
<<<<<<< HEAD
    await Promise.all([refreshVisits(), refreshTrips()]);
    setRefreshing(false);
  }, [refreshVisits, refreshTrips]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <DaySelector dateString={selectedDate} onDateChange={setSelectedDate} />

      {loading ? (
        <LoadingSpinner message="Loading timeline..." />
=======
    haptic.light();
    await Promise.all([refreshVisits(), refreshTrips()]);
    haptic.success();
    setRefreshing(false);
  }, [refreshVisits, refreshTrips]);

  useEffect(() => {
    if (!focusEventId) return;
    const offset = offsetsRef.current[focusEventId];
    if (offset != null && scrollRef.current) {
      scrollRef.current.scrollTo({ y: Math.max(0, offset - 24), animated: true });
    }
    const timeout = setTimeout(() => focusEvent(null), 2200);
    return () => clearTimeout(timeout);
  }, [focusEventId, focusEvent, events]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <DaySelector dateString={selectedDate} onDateChange={setSelectedDate} />

      {loading ? (
        <TimelineSkeleton />
>>>>>>> adf99c4 (atualização)
      ) : events.length === 0 ? (
        <EmptyState
          icon="clock-o"
          title="No activity yet"
          subtitle="Your visits and trips will appear here as your day progresses."
        />
      ) : (
        <ScrollView
<<<<<<< HEAD
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
=======
          ref={scrollRef}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />
          }
        >
          {events.map((event, idx) => {
            const highlighted = event.key === focusEventId;
            return (
              <View
                key={event.key}
                onLayout={(e) => {
                  offsetsRef.current[event.key] = e.nativeEvent.layout.y;
                }}
              >
                {event.kind === 'visit' && (
                  <VisitCard visit={event.data} index={idx} highlighted={highlighted} />
                )}
                {event.kind === 'trip' && (
                  <TripCard trip={event.data} index={idx} highlighted={highlighted} />
                )}
                {event.kind === 'gap' && (
                  <GapCard startAt={event.startAt} endAt={event.endAt} index={idx} />
                )}
              </View>
            );
          })}
>>>>>>> adf99c4 (atualização)
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    flex: 1,
  },
=======
  container: { flex: 1 },
>>>>>>> adf99c4 (atualização)
  content: {
    padding: 16,
    paddingLeft: 8,
    paddingBottom: 32,
  },
});
