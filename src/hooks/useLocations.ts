import { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '@/src/database/provider';
import { getLocationPoints } from '@/src/database/queries';
import { getDayStart, getDayEnd, getDateString } from '@/src/utils/time';
import type { LocationPoint } from '@/src/types';

export function useLocations(dateString?: string) {
  const { db, isReady } = useDatabase();
  const [locations, setLocations] = useState<LocationPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const date = dateString ?? getDateString();

  const refresh = useCallback(async () => {
    if (!db || !isReady) return;
    setLoading(true);
    try {
      const start = getDayStart(date);
      const end = getDayEnd(date);
      const points = await getLocationPoints(db, start, end);
      setLocations(points);
    } catch (e) {
      console.error('Error fetching locations:', e);
    }
    setLoading(false);
  }, [db, isReady, date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { locations, loading, refresh };
}
