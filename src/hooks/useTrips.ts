import { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '@/src/database/provider';
import { getTrips } from '@/src/database/queries';
import { getDayStart, getDayEnd, getDateString } from '@/src/utils/time';
import type { Trip } from '@/src/types';

export function useTrips(dateString?: string) {
  const { db, isReady } = useDatabase();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const date = dateString ?? getDateString();

  const refresh = useCallback(async () => {
    if (!db || !isReady) return;
    setLoading(true);
    try {
      const start = getDayStart(date);
      const end = getDayEnd(date);
      const data = await getTrips(db, start, end);
      setTrips(data);
    } catch (e) {
      console.error('Error fetching trips:', e);
    }
    setLoading(false);
  }, [db, isReady, date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { trips, loading, refresh };
}
