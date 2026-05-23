export const LOCATION_TASK_NAME = 'LOCALAPP_BACKGROUND_LOCATION';

export const SPEED_THRESHOLDS = {
  STATIONARY_MAX_KMH: 1,
  WALKING_MAX_KMH: 8,
  DRIVING_MIN_KMH: 15,
};

export const VISIT_DETECTION = {
  MIN_DURATION_MS: 5 * 60 * 1000,
  CLUSTER_RADIUS_METERS: 50,
};

export const TRACKING_DEFAULTS: {
  enabled: boolean;
  accuracy: 'high' | 'balanced' | 'low';
  retentionDays: number;
} = {
  enabled: true,
  accuracy: 'balanced',
  retentionDays: 90,
};

export const STORAGE_KEYS = {
  TRACKING_SETTINGS: '@localapp/tracking_settings',
};
