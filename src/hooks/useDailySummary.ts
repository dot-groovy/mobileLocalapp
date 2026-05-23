import { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '@/src/database/provider';
import { getDailySummary, getDailySummaries } from '@/src/database/queries';
import { getDateString, addDays } from '@/src/utils/time';
import type { DailySummary } from '@/src/types';

export function useDailySummary(dateString?: string) {
  const { db, isReady } = useDatabase();
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);

  const date = dateString ?? getDateString();

  const refresh = useCallback(async () => {
    if (!db || !isReady) return;
    setLoading(true);
    try {
      const data = await getDailySummary(db, date);
      setSummary(data);
    } catch (e) {
      console.error('Error fetching daily summary:', e);
    }
    setLoading(false);
  }, [db, isReady, date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { summary, loading, refresh };
}

export function useWeeklySummaries() {
  const { db, isReady } = useDatabase();
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!db || !isReady) return;
    setLoading(true);
    try {
      const today = getDateString();
      const weekAgo = addDays(today, -6);
      const data = await getDailySummaries(db, weekAgo, today);
      setSummaries(data);
    } catch (e) {
      console.error('Error fetching weekly summaries:', e);
    }
    setLoading(false);
  }, [db, isReady]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { summaries, loading, refresh };
}
