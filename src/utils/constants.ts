export const LOCATION_TASK_NAME = 'LOCALAPP_BACKGROUND_LOCATION';

export const SPEED_THRESHOLDS = {
<<<<<<< HEAD
  STATIONARY_MAX_KMH: 1,
  WALKING_MAX_KMH: 8,
  DRIVING_MIN_KMH: 15,
=======
  STATIONARY_MAX_KMH: 2,
  WALKING_MAX_KMH: 12,
  DRIVING_MIN_KMH: 25,
};

export const LOCATION_QUALITY = {
  // Keep imperfect fixes as raw evidence, but only let reliable fixes affect
  // distance and activity classification.
  MAX_RAW_ACCURACY_METERS: 100,
  MAX_RELIABLE_ACCURACY_METERS: 50,
  MAX_SPEED_MPS: 70,
  MAX_JUMP_METERS_PER_SEC: 70,
  MIN_POINT_INTERVAL_MS: 1000,
  MAX_ACTIVITY_GAP_MS: 2 * 60 * 1000,
  REBUILD_INTERVAL_MS: 60 * 1000,
>>>>>>> adf99c4 (atualização)
};

export const VISIT_DETECTION = {
  MIN_DURATION_MS: 5 * 60 * 1000,
  CLUSTER_RADIUS_METERS: 50,
};

<<<<<<< HEAD
=======
export const ACTIVITY_DETECTION = {
  STATIONARY_MAX_MPS: 0.4,
  WALKING_MIN_MPS: 0.45,
  WALKING_MAX_MPS: 3.4,
  DRIVING_MIN_MPS: 4.2,
  MIN_STATIONARY_SEGMENT_MS: 30 * 1000,
  MIN_MOVING_SEGMENT_MS: 10 * 1000,
};

>>>>>>> adf99c4 (atualização)
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
