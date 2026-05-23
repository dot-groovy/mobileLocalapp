import React, { useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useLocations } from '@/src/hooks/useLocations';
import { useVisits } from '@/src/hooks/useVisits';
import { getDateString } from '@/src/utils/time';
import DaySelector from '@/src/components/common/DaySelector';
import EmptyState from '@/src/components/common/EmptyState';
import LoadingSpinner from '@/src/components/common/LoadingSpinner';
import NativeMap from '@/src/components/map/NativeMap';

export default function MapScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [selectedDate, setSelectedDate] = useState(getDateString());
  const { locations, loading: locLoading } = useLocations(selectedDate);
  const { visits, loading: visLoading } = useVisits(selectedDate);

  const loading = locLoading || visLoading;

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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
