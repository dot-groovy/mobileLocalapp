import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import { LOCATION_TASK_NAME } from '@/src/utils/constants';

let dbModule: typeof import('@/src/database/queries') | null = null;
let openDbFn: typeof import('expo-sqlite').openDatabaseAsync | null = null;

async function getDb() {
  if (!openDbFn) {
    const sqlite = await import('expo-sqlite');
    openDbFn = sqlite.openDatabaseAsync;
  }
  if (!dbModule) {
    dbModule = await import('@/src/database/queries');
  }
  const db = await openDbFn('localapp.db');
  return { db, queries: dbModule };
}

if (Platform.OS !== 'web') {
  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error('Background location error:', error);
      return;
    }
    if (data) {
      const { locations } = data as { locations: Location.LocationObject[] };
      if (locations && locations.length > 0) {
        try {
          const { db, queries } = await getDb();
          const points = locations.map((loc) => ({
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            speed: loc.coords.speed ?? 0,
            heading: loc.coords.heading ?? 0,
            accuracy: loc.coords.accuracy ?? 0,
            altitude: loc.coords.altitude ?? 0,
            timestamp: loc.timestamp,
          }));
          await queries.insertLocationPoints(db, points);

          const { processVisitDetection } = await import('./visitDetection');
          const recentPoints = await queries.getRecentLocationPoints(db, 10);
          await processVisitDetection(db, recentPoints);

          const { recalculateDailySummary } = await import('./dailySummary');
          await recalculateDailySummary(db);
        } catch (e) {
          console.error('Error processing background locations:', e);
        }
      }
    }
  });
}

export async function requestLocationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return true;
  }

  const { status: foreground } = await Location.requestForegroundPermissionsAsync();
  if (foreground !== 'granted') return false;

  const { status: background } = await Location.requestBackgroundPermissionsAsync();
  return background === 'granted';
}

export async function startBackgroundTracking(
  accuracy: 'high' | 'balanced' | 'low' = 'balanced'
): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const hasPermission = await requestLocationPermissions();
  if (!hasPermission) return false;

  const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME).catch(() => false);
  if (isRunning) return true;

  const accuracyMap: Record<string, Location.Accuracy> = {
    high: Location.Accuracy.High,
    balanced: Location.Accuracy.Balanced,
    low: Location.Accuracy.Low,
  };

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: accuracyMap[accuracy],
    timeInterval: accuracy === 'high' ? 5000 : accuracy === 'balanced' ? 15000 : 30000,
    distanceInterval: accuracy === 'high' ? 5 : accuracy === 'balanced' ? 20 : 50,
    deferredUpdatesInterval: accuracy === 'high' ? 5000 : 15000,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: 'LocalApp',
      notificationBody: 'Tracking your location',
      notificationColor: '#0891B2',
    },
    activityType: Location.ActivityType.AutomotiveNavigation,
  });

  return true;
}

export async function stopBackgroundTracking(): Promise<void> {
  if (Platform.OS === 'web') return;

  const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME).catch(() => false);
  if (isRunning) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
}

export async function isTrackingActive(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  return Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME).catch(() => false);
}

export async function getCurrentLocation(): Promise<Location.LocationObject | null> {
  try {
    if (Platform.OS === 'web') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return null;
    }
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
  } catch {
    return null;
  }
}
