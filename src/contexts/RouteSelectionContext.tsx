import React, { createContext, useContext, useState, useCallback } from 'react';
import type { RouteSelection } from '@/src/types';

interface RouteSelectionContextValue {
  selection: RouteSelection | null;
  focusEventId: string | null;
  selectRoute: (selection: RouteSelection) => void;
  focusEvent: (eventId: string | null) => void;
  clearSelection: () => void;
}

const RouteSelectionContext = createContext<RouteSelectionContextValue>({
  selection: null,
  focusEventId: null,
  selectRoute: () => {},
  focusEvent: () => {},
  clearSelection: () => {},
});

export function useRouteSelection() {
  return useContext(RouteSelectionContext);
}

export function RouteSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<RouteSelection | null>(null);
  const [focusEventId, setFocusEventId] = useState<string | null>(null);

  const selectRoute = useCallback((sel: RouteSelection) => {
    setSelection(sel);
  }, []);

  const focusEvent = useCallback((eventId: string | null) => {
    setFocusEventId(eventId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelection(null);
  }, []);

  return (
    <RouteSelectionContext.Provider
      value={{ selection, focusEventId, selectRoute, focusEvent, clearSelection }}
    >
      {children}
    </RouteSelectionContext.Provider>
  );
}
