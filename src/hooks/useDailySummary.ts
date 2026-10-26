<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '@/src/database/provider';
import { getDailySummary, getDailySummaries } from '@/src/database/queries';
import { getDateString, addDays } from '@/src/utils/time';
=======
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDatabase } from '@/src/database/provider';
import { getDailySummary, getDailySummaries } from '@/src/database/queries';
import { getDateString, addDays } from '@/src/utils/time';
import { useAutoRefresh } from './useAutoRefresh';
>>>>>>> adf99c4 (atualização)
import type { DailySummary } from '@/src/types';

export function useDailySummary(dateString?: string) {
  const { db, isReady } = useDatabase();
  const [summary, setSummary] = useState<DailySummary | null>(null);
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
      const data = await getDailySummary(db, date);
      setSummary(data);
    } catch (e) {
      console.error('Error fetching daily summary:', e);
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
  return { summary, loading, refresh };
}

export function useWeeklySummaries() {
  const { db, isReady } = useDatabase();
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD

  const refresh = useCallback(async () => {
    if (!db || !isReady) return;
    setLoading(true);
=======
  const initialLoadDone = useRef(false);

  const refresh = useCallback(async () => {
    if (!db || !isReady) return;
    if (!initialLoadDone.current) setLoading(true);
>>>>>>> adf99c4 (atualização)
    try {
      const today = getDateString();
      const weekAgo = addDays(today, -6);
      const data = await getDailySummaries(db, weekAgo, today);
      setSummaries(data);
    } catch (e) {
      console.error('Error fetching weekly summaries:', e);
    }
<<<<<<< HEAD
    setLoading(false);
  }, [db, isReady]);

  useEffect(() => {
    refresh();
  }, [refresh]);

=======
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      setLoading(false);
    }
  }, [db, isReady]);

  useEffect(() => {
    initialLoadDone.current = false;
    setLoading(true);
    refresh();
  }, [refresh]);

  useAutoRefresh(refresh, 60000);

>>>>>>> adf99c4 (atualização)
  return { summaries, loading, refresh };
}
