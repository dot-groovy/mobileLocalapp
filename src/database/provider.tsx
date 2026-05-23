import React, { createContext, useContext, useEffect, useState } from 'react';
import type { SQLiteDatabase } from 'expo-sqlite';

interface DatabaseContextValue {
  db: SQLiteDatabase | null;
  isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  db: null,
  isReady: false,
});

export function useDatabase() {
  return useContext(DatabaseContext);
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const { openDatabaseAsync } = await import('expo-sqlite');
        const database = await openDatabaseAsync('localapp.db');
        const { initializeDatabase } = await import('./schema');
        await initializeDatabase(database);
        if (!cancelled) {
          setDb(database);
          setIsReady(true);
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
        if (!cancelled) {
          setIsReady(true);
        }
      }
    }

    const timeout = setTimeout(() => {
      if (!cancelled) {
        console.warn('Database init timed out, rendering app without db');
        setIsReady(true);
      }
    }, 10000);

    init().finally(() => clearTimeout(timeout));

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isReady }}>
      {children}
    </DatabaseContext.Provider>
  );
}
