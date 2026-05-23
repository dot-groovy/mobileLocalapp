export type TransportMode = 'stationary' | 'walking' | 'driving' | 'unknown';

export interface LocationPoint {
  id: number;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  accuracy: number;
  altitude: number;
  timestamp: number;
}

export interface Visit {
  id: number;
  lat: number;
  lng: number;
  address: string | null;
  arrival_at: number;
  departure_at: number | null;
  duration_minutes: number;
}

export interface Trip {
  id: number;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  start_at: number;
  end_at: number;
  transport_mode: TransportMode;
  distance_km: number;
}

export interface DailySummary {
  id: number;
  date: string;
  total_distance_km: number;
  walking_min: number;
  driving_min: number;
  stationary_min: number;
  places_count: number;
}

export interface TrackingSettings {
  enabled: boolean;
  accuracy: 'high' | 'balanced' | 'low';
  retentionDays: number;
}

export interface TimelineEvent {
  type: 'visit' | 'trip';
  data: Visit | Trip;
  timestamp: number;
}
