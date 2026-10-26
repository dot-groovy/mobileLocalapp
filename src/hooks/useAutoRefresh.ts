import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

/**
 * Periodic refresh that only runs while the app is foregrounded, to save
 * battery. It also triggers a single refresh when the app comes back to
 * foreground.
 */
export function useAutoRefresh(
  refresh: () => void | Promise<void>,
  intervalMs: number = 30000
) {
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    function start() {
      if (intervalId) return;
      intervalId = setInterval(() => refreshRef.current(), intervalMs);
    }
    function stop() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        refreshRef.current();
        start();
      } else {
        stop();
      }
    };

    if (AppState.currentState === 'active') start();
    const subscription = AppState.addEventListener('change', handleAppState);

    return () => {
      stop();
      subscription.remove();
    };
  }, [intervalMs]);
}
