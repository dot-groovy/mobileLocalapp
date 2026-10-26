import { useEffect, useRef, useState } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';

interface LiveLocation {
  latitude: number;
  longitude: number;
}

/**
 * Lightweight live location hook, optimized for battery:
 * - Reads from the SQLite cache when background tracking is active
 *   (no extra GPS fix needed).
 * - Falls back to a single Balanced-accuracy foreground fix when it isn't.
 * - Pauses polling automatically when the app goes to background.
 */
export function useLiveLocation(enabled: boolean = true, intervalMs: number = 15000) {
  const [location, setLocation] = useState<LiveLocation | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (!enabled || Platform.OS === 'web') return;

    let active = true;

    async function fetchLocation() {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      try {
        const { isTrackingActive } = await import('@/src/services/locationTracking');
        if (await isTrackingActive()) {
          const [{ getDatabase }, { getLatestLocationPoint }] = await Promise.all([
            import('@/src/database/instance'),
            import('@/src/database/queries'),
          ]);
          const latest = await getLatestLocationPoint(await getDatabase());
          if (active && latest) {
            setLocation({ latitude: latest.lat, longitude: latest.lng });
          }
          return;
        }
        const Location = await import('expo-location');
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (active) {
          setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        }
      } catch {
        // ignore – stale value stays visible
      } finally {
        inFlightRef.current = false;
      }
    }

    function startPolling() {
      stopPolling();
      fetchLocation();
      intervalRef.current = setInterval(fetchLocation, intervalMs);
    }

    function stopPolling() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    const handleAppState = (state: AppStateStatus) => {
      if (!active) return;
      if (state === 'active') startPolling();
      else stopPolling();
    };

    if (AppState.currentState === 'active') startPolling();
    const subscription = AppState.addEventListener('change', handleAppState);

    return () => {
      active = false;
      stopPolling();
      subscription.remove();
    };
  }, [enabled, intervalMs]);

  return location;
}
