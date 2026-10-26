<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '@/src/database/provider';
import { getTrips } from '@/src/database/queries';
import { getDayStart, getDayEnd, getDateString } from '@/src/utils/time';
=======
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDatabase } from '@/src/database/provider';
import { getTrips } from '@/src/database/queries';
import { getDayStart, getDayEnd, getDateString } from '@/src/utils/time';
import { useAutoRefresh } from './useAutoRefresh';
>>>>>>> adf99c4 (atualização)
import type { Trip } from '@/src/types';

export function useTrips(dateString?: string) {
  const { db, isReady } = useDatabase();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
=======
  const initialLoadDone = useRef(false);
>>>>>>> adf99c4 (atualização)

  const date = dateString ?? getDateString();

  const refresh = useCallback(async () => {
    if (!db || !isReady) return;
<<<<<<< HEAD
    setLoading(true);
=======
    if (!initialLoadDone.current) setLoading(true);
>>>>>>> adf99c4 (atualização)
    try {
      const start = getDayStart(date);
      const end = getDayEnd(date);
      const data = await getTrips(db, start, end);
      setTrips(data);
    } catch (e) {
      console.error('Error fetching trips:', e);
    }
<<<<<<< HEAD
    setLoading(false);
  }, [db, isReady, date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

=======
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      setLoading(false);
    }
  }, [db, isReady, date]);

  useEffect(() => {
    initialLoadDone.current = false;
    setLoading(true);
    refresh();
  }, [refresh]);

  useAutoRefresh(refresh, 30000);

>>>>>>> adf99c4 (atualização)
  return { trips, loading, refresh };
}
