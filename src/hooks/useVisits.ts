import { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '@/src/database/provider';
import { getVisits, getTopVisitedPlaces } from '@/src/database/queries';
import { getDayStart, getDayEnd, getDateString } from '@/src/utils/time';
import type { Visit } from '@/src/types';

export function useVisits(dateString?: string) {
  const { db, isReady } = useDatabase();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  const date = dateString ?? getDateString();

  const refresh = useCallback(async () => {
    if (!db || !isReady) return;
    setLoading(true);
    try {
      const start = getDayStart(date);
      const end = getDayEnd(date);
      const data = await getVisits(db, start, end);
      setVisits(data);
    } catch (e) {
      console.error('Error fetching visits:', e);
    }
    setLoading(false);
  }, [db, isReady, date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { visits, loading, refresh };
}

export function useTopPlaces(dateString?: string, limit: number = 5) {
  const { db, isReady } = useDatabase();
  const [places, setPlaces] = useState<{ address: string; total_minutes: number; visit_count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const date = dateString ?? getDateString();

  const refresh = useCallback(async () => {
    if (!db || !isReady) return;
    setLoading(true);
    try {
      const start = getDayStart(date);
      const end = getDayEnd(date);
      const data = await getTopVisitedPlaces(db, start, end, limit);
      setPlaces(data);
    } catch (e) {
      console.error('Error fetching top places:', e);
    }
    setLoading(false);
  }, [db, isReady, date, limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { places, loading, refresh };
}
