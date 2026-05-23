import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, TRACKING_DEFAULTS } from '@/src/utils/constants';
import type { TrackingSettings } from '@/src/types';
import {
  isTrackingActive,
  startBackgroundTracking,
  stopBackgroundTracking,
} from '@/src/services/locationTracking';

export function useTrackingStatus() {
  const [settings, setSettings] = useState<TrackingSettings>(TRACKING_DEFAULTS);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.TRACKING_SETTINGS);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
      if (Platform.OS !== 'web') {
        const active = await isTrackingActive();
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

  const updateSettings = useCallback(async (newSettings: Partial<TrackingSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.TRACKING_SETTINGS, JSON.stringify(updated));
  }, [settings]);

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
