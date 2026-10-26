<<<<<<< HEAD
import React, { useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useLocations } from '@/src/hooks/useLocations';
import { useVisits } from '@/src/hooks/useVisits';
import { getDateString } from '@/src/utils/time';
import DaySelector from '@/src/components/common/DaySelector';
import EmptyState from '@/src/components/common/EmptyState';
=======
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { AppColors } from '@/constants/Colors';
import { useLocations } from '@/src/hooks/useLocations';
import { useVisits } from '@/src/hooks/useVisits';
import { useRouteSelection } from '@/src/contexts/RouteSelectionContext';
import { getDateString, formatTime, formatDuration } from '@/src/utils/time';
import { getCurrentLocation } from '@/src/services/locationTracking';
import { useLiveLocation } from '@/src/hooks/useLiveLocation';
import { haptic } from '@/src/utils/haptics';
import DaySelector from '@/src/components/common/DaySelector';
>>>>>>> adf99c4 (atualização)
import LoadingSpinner from '@/src/components/common/LoadingSpinner';
import NativeMap from '@/src/components/map/NativeMap';

export default function MapScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
<<<<<<< HEAD
  const [selectedDate, setSelectedDate] = useState(getDateString());
=======
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { selection, clearSelection, selectRoute, focusEvent } = useRouteSelection();
  const [selectedDate, setSelectedDate] = useState(getDateString());

  const liveLocation = useLiveLocation(!selection, 15000);
  const userLat = liveLocation?.latitude ?? null;
  const userLng = liveLocation?.longitude ?? null;

  useEffect(() => {
    if (selection) {
      setSelectedDate(selection.dateString);
    }
  }, [selection]);

  const handleDateChange = (date: string) => {
    clearSelection();
    setSelectedDate(date);
  };

  const handleRequestLocation = useCallback(async () => {
    await getCurrentLocation();
  }, []);

  const handleRefreshLocation = useCallback(async (): Promise<{ lat: number; lng: number } | null> => {
    const loc = await getCurrentLocation();
    if (loc) {
      return { lat: loc.coords.latitude, lng: loc.coords.longitude };
    }
    return null;
  }, []);

>>>>>>> adf99c4 (atualização)
  const { locations, loading: locLoading } = useLocations(selectedDate);
  const { visits, loading: visLoading } = useVisits(selectedDate);

  const loading = locLoading || visLoading;

<<<<<<< HEAD
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <DaySelector dateString={selectedDate} onDateChange={setSelectedDate} />
        <EmptyState
          icon="map"
          title="Map View"
          subtitle="The interactive map is available on Android and iOS. Use the Dashboard and Timeline tabs to view your data on desktop."
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <DaySelector dateString={selectedDate} onDateChange={setSelectedDate} />

      {loading ? (
        <LoadingSpinner message="Loading map data..." />
      ) : locations.length === 0 ? (
        <EmptyState
          icon="map-marker"
          title="No location data"
          subtitle="Start tracking to see your routes and visits on the map."
        />
      ) : (
        <NativeMap locations={locations} visits={visits} theme={theme} />
=======
  const filteredLocations = useMemo(() => {
    if (!selection) return locations;

    if (selection.type === 'trip' && selection.trip) {
      const trip = selection.trip;
      const margin = 30000;
      return locations.filter(
        l => l.timestamp >= trip.start_at - margin && l.timestamp <= trip.end_at + margin
      );
    }

    if (selection.type === 'visit' && selection.visit) {
      const visit = selection.visit;
      const margin = 60000;
      const end = visit.departure_at ?? visit.arrival_at + 5 * 60000;
      return locations.filter(
        l => l.timestamp >= visit.arrival_at - margin && l.timestamp <= end + margin
      );
    }

    return locations;
  }, [locations, selection]);

  const filteredVisits = useMemo(() => {
    if (!selection) return visits;
    if (selection.type === 'visit' && selection.visit) {
      return visits.filter(v => v.id === selection.visit!.id);
    }
    if (selection.type === 'trip' && selection.trip) {
      const trip = selection.trip;
      return visits.filter(
        v => v.arrival_at >= trip.start_at && v.arrival_at <= trip.end_at
      );
    }
    return visits;
  }, [visits, selection]);

  // Changes to focusVersion trigger an animated fitBounds inside the map,
  // without ever rebuilding the HTML (which would reset the user's zoom).
  const focusVersion = useMemo(() => {
    if (!selection) return 0;
    if (selection.type === 'visit' && selection.visit) return selection.visit.id * 2 + 1;
    if (selection.type === 'trip' && selection.trip) return selection.trip.id * 2;
    return 0;
  }, [selection]);

  const handleVisitTap = useCallback(
    (visitId: number) => {
      const visit = visits.find(v => v.id === visitId);
      if (!visit) return;
      haptic.light();
      selectRoute({
        type: 'visit',
        visit,
        dateString: getDateString(visit.arrival_at),
      });
      focusEvent(`visit-${visit.id}`);
      router.navigate('/(tabs)/timeline');
    },
    [visits, selectRoute, focusEvent, router]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      {!selection && <DaySelector dateString={selectedDate} onDateChange={handleDateChange} />}
      {selection && <SelectionBanner selection={selection} onClear={clearSelection} theme={theme} />}

      {loading ? (
        <LoadingSpinner message="Loading map data..." />
      ) : (
        <NativeMap
          locations={filteredLocations}
          visits={filteredVisits}
          theme={theme}
          showUserLocation={!selection}
          onRequestLocation={handleRequestLocation}
          onRefreshLocation={handleRefreshLocation}
          userLat={userLat}
          userLng={userLng}
          focusVersion={focusVersion}
          onVisitTap={handleVisitTap}
        />
>>>>>>> adf99c4 (atualização)
      )}
    </View>
  );
}

<<<<<<< HEAD
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
=======
function SelectionBanner({
  selection,
  onClear,
  theme,
}: {
  selection: NonNullable<ReturnType<typeof useRouteSelection>['selection']>;
  onClear: () => void;
  theme: (typeof Colors)['light'];
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  let title = '';
  let subtitle = '';
  let iconName: React.ComponentProps<typeof FontAwesome>['name'] = 'map-marker';
  let accentColor = AppColors.primary;

  if (selection.type === 'trip' && selection.trip) {
    const trip = selection.trip;
    const durationMin = (trip.end_at - trip.start_at) / 60000;
    const modeLabels: Record<string, string> = {
      walking: 'Walking',
      driving: 'Driving',
      stationary: 'Stationary',
      unknown: 'Trip',
    };
    const modeIcons: Record<string, React.ComponentProps<typeof FontAwesome>['name']> = {
      walking: 'street-view',
      driving: 'car',
      stationary: 'pause-circle',
      unknown: 'exchange',
    };
    const modeColors: Record<string, string> = {
      walking: AppColors.walking,
      driving: AppColors.driving,
      stationary: AppColors.stationary,
      unknown: AppColors.gray400,
    };
    const distanceLabel =
      trip.distance_km < 1
        ? `${Math.round(trip.distance_km * 1000)} m`
        : `${trip.distance_km.toFixed(2)} km`;
    title = modeLabels[trip.transport_mode] ?? 'Trip';
    subtitle = `${formatTime(trip.start_at)} - ${formatTime(trip.end_at)}  ·  ${distanceLabel}  ·  ${formatDuration(durationMin)}`;
    iconName = modeIcons[trip.transport_mode] ?? 'exchange';
    accentColor = modeColors[trip.transport_mode] ?? AppColors.primary;
  } else if (selection.type === 'visit' && selection.visit) {
    const visit = selection.visit;
    title = visit.address ?? `${visit.lat.toFixed(4)}, ${visit.lng.toFixed(4)}`;
    const timeStr = formatTime(visit.arrival_at);
    const depStr =
      visit.departure_at && visit.departure_at > visit.arrival_at
        ? ` - ${formatTime(visit.departure_at)}`
        : ' · Still here';
    subtitle = `${timeStr}${depStr}  ·  ${formatDuration(Math.max(0, visit.duration_minutes))}`;
    iconName = 'map-pin';
    accentColor = AppColors.stationary;
  }

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.bannerAccent, { backgroundColor: accentColor }]} />
      <View style={[styles.bannerIconCircle, { backgroundColor: accentColor + '18' }]}>
        <FontAwesome name={iconName} size={14} color={accentColor} />
      </View>
      <View style={styles.bannerContent}>
        <Text style={[styles.bannerTitle, { color: theme.text }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.bannerSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onClear}
        style={styles.bannerClose}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <FontAwesome name="times-circle" size={20} color={theme.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  bannerAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  bannerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    marginRight: 10,
  },
  bannerContent: { flex: 1 },
  bannerTitle: { fontSize: 14, fontWeight: '600' },
  bannerSubtitle: { fontSize: 11, marginTop: 2 },
  bannerClose: { padding: 4, marginLeft: 8 },
>>>>>>> adf99c4 (atualização)
});
