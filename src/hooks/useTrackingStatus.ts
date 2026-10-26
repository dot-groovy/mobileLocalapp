import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, TRACKING_DEFAULTS } from '@/src/utils/constants';
<<<<<<< HEAD
=======
import { useAutoRefresh } from './useAutoRefresh';
>>>>>>> adf99c4 (atualização)
import type { TrackingSettings } from '@/src/types';
import {
  isTrackingActive,
  startBackgroundTracking,
  stopBackgroundTracking,
} from '@/src/services/locationTracking';

<<<<<<< HEAD
=======
let reconcilePromise: Promise<boolean> | null = null;

async function reconcileTracking(settings: TrackingSettings): Promise<boolean> {
  if (reconcilePromise) return reconcilePromise;
  reconcilePromise = (async () => {
    const active = await isTrackingActive();
    if (settings.enabled && !active) {
      return startBackgroundTracking(settings.accuracy);
    }
    return active;
  })();
  try {
    return await reconcilePromise;
  } finally {
    reconcilePromise = null;
  }
}

>>>>>>> adf99c4 (atualização)
export function useTrackingStatus() {
  const [settings, setSettings] = useState<TrackingSettings>(TRACKING_DEFAULTS);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.TRACKING_SETTINGS);
<<<<<<< HEAD
      if (stored) {
        setSettings(JSON.parse(stored));
      }
      if (Platform.OS !== 'web') {
        const active = await isTrackingActive();
=======
      const resolvedSettings: TrackingSettings = stored
        ? { ...TRACKING_DEFAULTS, ...JSON.parse(stored) }
        : TRACKING_DEFAULTS;
      setSettings(resolvedSettings);
      if (Platform.OS !== 'web') {
        const active = await reconcileTracking(resolvedSettings);
>>>>>>> adf99c4 (atualização)
        setIsActive(active);
      }
    } catch (e) {
      console.error('Error loading tracking settings:', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

<<<<<<< HEAD
=======
  useAutoRefresh(loadSettings, 30000);

>>>>>>> adf99c4 (atualização)
  const updateSettings = useCallback(async (newSettings: Partial<TrackingSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.TRACKING_SETTINGS, JSON.stringify(updated));
<<<<<<< HEAD
  }, [settings]);
=======
    if (
      Platform.OS !== 'web' &&
      isActive &&
      newSettings.accuracy &&
      newSettings.accuracy !== settings.accuracy
    ) {
      await stopBackgroundTracking();
      const restarted = await startBackgroundTracking(newSettings.accuracy);
      setIsActive(restarted);
    }
  }, [isActive, settings]);
>>>>>>> adf99c4 (atualização)

  const toggleTracking = useCallback(async () => {
    if (isActive) {
      await stopBackgroundTracking();
      setIsActive(false);
      await updateSettings({ enabled: false });
    } else {
      const started = await startBackgroundTracking(settings.accuracy);
      setIsActive(started);
      if (started) {
        await updateSettings({ enabled: true });
      }
    }
  }, [isActive, settings.accuracy, updateSettings]);

  return { settings, isActive, loading, updateSettings, toggleTracking, refresh: loadSettings };
}
