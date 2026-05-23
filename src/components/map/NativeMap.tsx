import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import RoutePolyline from './RoutePolyline';
import VisitMarker from './VisitMarker';
import type { LocationPoint, Visit } from '@/src/types';

interface NativeMapProps {
  locations: LocationPoint[];
  visits: Visit[];
  theme: { textSecondary: string };
}

export default function NativeMap({ locations, visits, theme }: NativeMapProps) {
  const mapRef = useRef<MapView>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (locations.length > 0 && mapRef.current) {
      const coords = locations.map(l => ({ latitude: l.lat, longitude: l.lng }));
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
        animated: true,
      });
    }
  }, [locations]);

  if (mapError) {
    return (
      <View style={[styles.mapContainer, styles.errorContainer]}>
        <Text style={[styles.legendText, { color: theme.textSecondary, fontSize: 14 }]}>
          Could not load map. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation
          showsMyLocationButton
          onMapReady={() => setMapError(false)}
          initialRegion={{
            latitude: locations[0]?.lat ?? 0,
            longitude: locations[0]?.lng ?? 0,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}>
          <RoutePolyline points={locations} />

          {visits.map(visit => (
            <VisitMarker key={visit.id} visit={visit} />
          ))}
        </MapView>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>Walking</Text>
          <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>Driving</Text>
          <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>Stationary</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  legend: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    fontSize: 11,
    marginRight: 12,
  },
});
