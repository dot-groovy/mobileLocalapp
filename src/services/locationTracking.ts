import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
<<<<<<< HEAD
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

=======
import {
  LOCATION_TASK_NAME,
  LOCATION_QUALITY,
  STORAGE_KEYS,
  TRACKING_DEFAULTS,
} from '@/src/utils/constants';
import { haversineDistance } from '@/src/utils/geo';
import { getDatabase } from '@/src/database/instance';

let dbModule: typeof import('@/src/database/queries') | null = null;
let lastSavedTimestamp = 0;
let lastSavedLat = 0;
let lastSavedLng = 0;
let lastActivityRebuild = 0;
let lastCleanup = 0;

async function getDb() {
  if (!dbModule) {
    dbModule = await import('@/src/database/queries');
  }
  const db = await getDatabase();
  return { db, queries: dbModule };
}

function isValidLocation(loc: Location.LocationObject): boolean {
  const { accuracy, speed } = loc.coords;

  if ((accuracy ?? 999) > LOCATION_QUALITY.MAX_RAW_ACCURACY_METERS) return false;

  if ((speed ?? 0) > LOCATION_QUALITY.MAX_SPEED_MPS) return false;

  if (loc.mocked === true) return false;

  if (loc.coords.latitude === 0 && loc.coords.longitude === 0) return false;

  return true;
}

function isImpossibleJump(loc: Location.LocationObject): boolean {
  if (lastSavedTimestamp === 0) return false;

  const timeDiffSec = (loc.timestamp - lastSavedTimestamp) / 1000;
  if (timeDiffSec <= 0) return true;
  if (timeDiffSec < LOCATION_QUALITY.MIN_POINT_INTERVAL_MS / 1000) return true;

  const distKm = haversineDistance(
    lastSavedLat, lastSavedLng,
    loc.coords.latitude, loc.coords.longitude
  );
  const speedMps = (distKm * 1000) / timeDiffSec;

  return speedMps > LOCATION_QUALITY.MAX_JUMP_METERS_PER_SEC;
}

>>>>>>> adf99c4 (atualização)
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
<<<<<<< HEAD
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
=======
          const latest = await queries.getLatestLocationPoint(db);
          if (latest && latest.timestamp > lastSavedTimestamp) {
            lastSavedTimestamp = latest.timestamp;
            lastSavedLat = latest.lat;
            lastSavedLng = latest.lng;
          }

          const validLocations: Location.LocationObject[] = [];
          for (const loc of [...locations].sort((a, b) => a.timestamp - b.timestamp)) {
            if (!isValidLocation(loc) || isImpossibleJump(loc)) continue;
            validLocations.push(loc);
            // Update immediately so every fix in a delivered batch is checked
            // against the previous accepted fix, not an old module value.
            lastSavedTimestamp = loc.timestamp;
            lastSavedLat = loc.coords.latitude;
            lastSavedLng = loc.coords.longitude;
          }

          if (validLocations.length === 0) return;

          const points = validLocations.map((loc) => {
            return {
              lat: loc.coords.latitude,
              lng: loc.coords.longitude,
              // -1 preserves "sensor did not report speed"; zero means the
              // sensor explicitly measured no movement.
              speed: loc.coords.speed == null ? -1 : Math.max(0, loc.coords.speed),
              heading: loc.coords.heading ?? 0,
              accuracy: loc.coords.accuracy ?? 0,
              altitude: loc.coords.altitude ?? 0,
              timestamp: loc.timestamp,
            };
          });
          await queries.insertLocationPoints(db, points);

          const now = Date.now();
          if (now - lastActivityRebuild >= LOCATION_QUALITY.REBUILD_INTERVAL_MS) {
            const [{ rebuildActivityDay }, { recalculateDailySummary }, { getDateString }] =
              await Promise.all([
                import('./activityProcessing'),
                import('./dailySummary'),
                import('@/src/utils/time'),
              ]);
            const dates = new Set(points.map((point) => getDateString(point.timestamp)));
            dates.add(getDateString(now));
            for (const date of dates) {
              await rebuildActivityDay(db, date, now);
              await recalculateDailySummary(db, date);
            }
            lastActivityRebuild = now;
          }

          if (now - lastCleanup >= 6 * 60 * 60 * 1000) {
            const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
            const stored = await AsyncStorage.getItem(STORAGE_KEYS.TRACKING_SETTINGS);
            const retentionDays = stored
              ? { ...TRACKING_DEFAULTS, ...JSON.parse(stored) }.retentionDays
              : TRACKING_DEFAULTS.retentionDays;
            await queries.deleteDataBefore(db, now - retentionDays * 24 * 60 * 60 * 1000);
            lastCleanup = now;
          }
>>>>>>> adf99c4 (atualização)
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
<<<<<<< HEAD
    high: Location.Accuracy.High,
    balanced: Location.Accuracy.Balanced,
    low: Location.Accuracy.Low,
=======
    high: Location.Accuracy.BestForNavigation,
    balanced: Location.Accuracy.High,
    low: Location.Accuracy.Balanced,
  };

  const timeIntervalMap: Record<string, number> = {
    high: 3000,
    balanced: 5000,
    low: 15000,
  };

  const distIntervalMap: Record<string, number> = {
    high: 3,
    balanced: 10,
    low: 30,
>>>>>>> adf99c4 (atualização)
  };

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: accuracyMap[accuracy],
<<<<<<< HEAD
    timeInterval: accuracy === 'high' ? 5000 : accuracy === 'balanced' ? 15000 : 30000,
    distanceInterval: accuracy === 'high' ? 5 : accuracy === 'balanced' ? 20 : 50,
    deferredUpdatesInterval: accuracy === 'high' ? 5000 : 15000,
=======
    timeInterval: timeIntervalMap[accuracy],
    distanceInterval: distIntervalMap[accuracy],
    deferredUpdatesInterval: accuracy === 'high' ? 3000 : 10000,
>>>>>>> adf99c4 (atualização)
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: 'LocalApp',
      notificationBody: 'Tracking your location',
      notificationColor: '#0891B2',
    },
<<<<<<< HEAD
    activityType: Location.ActivityType.AutomotiveNavigation,
=======
    activityType: Location.ActivityType.OtherNavigation,
>>>>>>> adf99c4 (atualização)
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
<<<<<<< HEAD
      accuracy: Location.Accuracy.Balanced,
=======
      accuracy: Location.Accuracy.BestForNavigation,
>>>>>>> adf99c4 (atualização)
    });
  } catch {
    return null;
  }
}
