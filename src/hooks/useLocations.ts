<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '@/src/database/provider';
import { getLocationPoints } from '@/src/database/queries';
import { getDayStart, getDayEnd, getDateString } from '@/src/utils/time';
=======
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDatabase } from '@/src/database/provider';
import { getLocationPoints } from '@/src/database/queries';
import { getDayStart, getDayEnd, getDateString } from '@/src/utils/time';
import { useAutoRefresh } from './useAutoRefresh';
>>>>>>> adf99c4 (atualização)
import type { LocationPoint } from '@/src/types';

export function useLocations(dateString?: string) {
  const { db, isReady } = useDatabase();
  const [locations, setLocations] = useState<LocationPoint[]>([]);
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
      const points = await getLocationPoints(db, start, end);
      setLocations(points);
    } catch (e) {
      console.error('Error fetching locations:', e);
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

  useAutoRefresh(refresh, 15000);

>>>>>>> adf99c4 (atualização)
  return { locations, loading, refresh };
}
