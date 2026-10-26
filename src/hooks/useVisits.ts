<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '@/src/database/provider';
import { getVisits, getTopVisitedPlaces } from '@/src/database/queries';
import { getDayStart, getDayEnd, getDateString } from '@/src/utils/time';
=======
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDatabase } from '@/src/database/provider';
import { getVisits, getTopVisitedPlaces } from '@/src/database/queries';
import { getDayStart, getDayEnd, getDateString } from '@/src/utils/time';
import { useAutoRefresh } from './useAutoRefresh';
>>>>>>> adf99c4 (atualização)
import type { Visit } from '@/src/types';

export function useVisits(dateString?: string) {
  const { db, isReady } = useDatabase();
  const [visits, setVisits] = useState<Visit[]>([]);
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
      const data = await getVisits(db, start, end);
      setVisits(data);
    } catch (e) {
      console.error('Error fetching visits:', e);
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
  return { visits, loading, refresh };
}

export function useTopPlaces(dateString?: string, limit: number = 5) {
  const { db, isReady } = useDatabase();
  const [places, setPlaces] = useState<{ address: string; total_minutes: number; visit_count: number }[]>([]);
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
      const data = await getTopVisitedPlaces(db, start, end, limit);
      setPlaces(data);
    } catch (e) {
      console.error('Error fetching top places:', e);
    }
<<<<<<< HEAD
    setLoading(false);
  }, [db, isReady, date, limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

=======
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      setLoading(false);
    }
  }, [db, isReady, date, limit]);

  useEffect(() => {
    initialLoadDone.current = false;
    setLoading(true);
    refresh();
  }, [refresh]);

  useAutoRefresh(refresh, 60000);

>>>>>>> adf99c4 (atualização)
  return { places, loading, refresh };
}
