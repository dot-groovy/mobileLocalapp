<<<<<<< HEAD
export default function NativeMap() {
  return null;
}
=======
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { LocationPoint, Visit } from '@/src/types';
import { metersPerSecToKmh } from '@/src/utils/geo';
import { SPEED_THRESHOLDS } from '@/src/utils/constants';
import { formatTime, formatDuration } from '@/src/utils/time';

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

const COLORS = {
  walking: '#10B981',
  driving: '#F59E0B',
  stationary: '#8B5CF6',
  primary: '#0891B2',
};

interface NativeMapProps {
  locations: LocationPoint[];
  visits: Visit[];
  theme: { textSecondary: string };
  showUserLocation?: boolean;
}

function getSegmentColor(speed: number): string {
  const kmh = metersPerSecToKmh(speed);
  if (kmh < SPEED_THRESHOLDS.STATIONARY_MAX_KMH) return COLORS.stationary;
  if (kmh <= SPEED_THRESHOLDS.WALKING_MAX_KMH) return COLORS.walking;
  return COLORS.driving;
}

function loadLeaflet(): Promise<any> {
  return new Promise((resolve) => {
    if ((window as any).L) {
      resolve((window as any).L);
      return;
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    if (document.getElementById('leaflet-js')) {
      const check = setInterval(() => {
        if ((window as any).L) {
          clearInterval(check);
          resolve((window as any).L);
        }
      }, 50);
      return;
    }

    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = LEAFLET_JS;
    script.onload = () => resolve((window as any).L);
    document.head.appendChild(script);
  });
}

export default function NativeMap({ locations, visits, theme }: NativeMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<any[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  const initMap = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      const L = await loadLeaflet();

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const defaultLat = locations[0]?.lat ?? 38.7;
      const defaultLng = locations[0]?.lng ?? -9.1;
      const defaultZoom = locations.length > 0 ? 14 : 6;

      const map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([defaultLat, defaultLng], defaultZoom);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      setReady(true);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    initMap();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initMap]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !ready) return;
    const L = (window as any).L;
    if (!L) return;

    layersRef.current.forEach(layer => {
      try { map.removeLayer(layer); } catch {}
    });
    layersRef.current = [];

    if (locations.length > 1) {
      let currentColor = getSegmentColor(locations[0].speed);
      let currentCoords: [number, number][] = [[locations[0].lat, locations[0].lng]];

      for (let i = 1; i < locations.length; i++) {
        const color = getSegmentColor(locations[i].speed);
        const coord: [number, number] = [locations[i].lat, locations[i].lng];

        if (color !== currentColor) {
          currentCoords.push(coord);
          const polyline = L.polyline(currentCoords, {
            color: currentColor,
            weight: 5,
            opacity: 0.85,
            dashArray: currentColor === COLORS.stationary ? '6, 8' : undefined,
          }).addTo(map);
          layersRef.current.push(polyline);
          currentColor = color;
          currentCoords = [coord];
        } else {
          currentCoords.push(coord);
        }
      }

      if (currentCoords.length > 1) {
        const polyline = L.polyline(currentCoords, {
          color: currentColor,
          weight: 5,
          opacity: 0.85,
          dashArray: currentColor === COLORS.stationary ? '6, 8' : undefined,
        }).addTo(map);
        layersRef.current.push(polyline);
      }

      if (locations.length > 0) {
        const startIcon = L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;border-radius:50%;background:${COLORS.primary};border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        const endIcon = L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;border-radius:50%;background:#EF4444;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        const startMarker = L.marker([locations[0].lat, locations[0].lng], { icon: startIcon })
          .bindPopup('Start')
          .addTo(map);
        const endMarker = L.marker(
          [locations[locations.length - 1].lat, locations[locations.length - 1].lng],
          { icon: endIcon }
        ).bindPopup('End').addTo(map);
        layersRef.current.push(startMarker, endMarker);
      }
    }

    visits.forEach(visit => {
      const label = visit.address ?? `${visit.lat.toFixed(4)}, ${visit.lng.toFixed(4)}`;
      const timeStr = formatTime(visit.arrival_at);
      const depStr = visit.departure_at && visit.departure_at > visit.arrival_at
        ? ` - ${formatTime(visit.departure_at)}`
        : '';
      const dur = formatDuration(Math.max(0, visit.duration_minutes));

      const visitIcon = L.divIcon({
        className: '',
        html: `<div style="width:18px;height:18px;border-radius:50%;background:${COLORS.stationary};border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
          <div style="width:6px;height:6px;border-radius:50%;background:white;"></div>
        </div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const marker = L.marker([visit.lat, visit.lng], { icon: visitIcon })
        .bindPopup(
          `<div style="font-family:system-ui,sans-serif;">
            <strong style="font-size:13px;">${label}</strong><br/>
            <span style="color:#6B7280;font-size:12px;">${timeStr}${depStr}</span><br/>
            <span style="color:${COLORS.primary};font-weight:600;font-size:12px;">${dur}</span>
          </div>`,
          { maxWidth: 220 }
        )
        .addTo(map);
      layersRef.current.push(marker);
    });

    if (locations.length > 1) {
      const bounds = L.latLngBounds(locations.map((l: LocationPoint) => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 17 });
    } else if (visits.length > 0) {
      map.setView([visits[0].lat, visits[0].lng], 16);
    }
  }, [locations, visits, ready]);

  if (error) {
    return (
      <View style={webStyles.fallback}>
        <Text style={[webStyles.fallbackText, { color: theme.textSecondary }]}>
          Could not load the map. Check your internet connection.
        </Text>
      </View>
    );
  }

  return (
    <View style={webStyles.container}>
      {!ready && (
        <View style={webStyles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
      <div
        ref={containerRef as any}
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          minHeight: 300,
          borderRadius: 8,
          overflow: 'hidden',
        }}
      />
      {locations.length > 0 && (
        <View style={webStyles.legend}>
          <View style={webStyles.legendRow}>
            <View style={[webStyles.legendDot, { backgroundColor: COLORS.walking }]} />
            <Text style={[webStyles.legendLabel, { color: theme.textSecondary }]}>Walking</Text>
            <View style={[webStyles.legendDot, { backgroundColor: COLORS.driving }]} />
            <Text style={[webStyles.legendLabel, { color: theme.textSecondary }]}>Driving</Text>
            <View style={[webStyles.legendDot, { backgroundColor: COLORS.stationary }]} />
            <Text style={[webStyles.legendLabel, { color: theme.textSecondary }]}>Stationary</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const webStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  fallbackText: {
    fontSize: 14,
    textAlign: 'center',
  },
  legend: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'center',
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
  legendLabel: {
    fontSize: 11,
    marginRight: 12,
  },
});
>>>>>>> adf99c4 (atualização)
