<<<<<<< HEAD
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { SQLiteDatabase } from 'expo-sqlite';
=======
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import type { SQLiteDatabase } from 'expo-sqlite';
import { getDatabase, getCachedDatabase } from './instance';
>>>>>>> adf99c4 (atualização)

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
<<<<<<< HEAD
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
=======
  const [db, setDb] = useState<SQLiteDatabase | null>(() => getCachedDatabase());
  const [isReady, setIsReady] = useState(() => getCachedDatabase() !== null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const cached = getCachedDatabase();
    if (cached) {
      setDb(cached);
      setIsReady(true);
      return;
    }

    let retryTimeout: ReturnType<typeof setTimeout>;

    async function init(attempt = 1) {
      try {
        const database = await getDatabase();
        if (mountedRef.current) {
>>>>>>> adf99c4 (atualização)
          setDb(database);
          setIsReady(true);
        }
      } catch (error) {
<<<<<<< HEAD
        console.error('Failed to initialize database:', error);
        if (!cancelled) {
=======
        console.error(`Database init attempt ${attempt} failed:`, error);
        if (mountedRef.current && attempt < 5) {
          retryTimeout = setTimeout(() => init(attempt + 1), 1000 * attempt);
        } else if (mountedRef.current) {
          console.error('All database init attempts failed');
>>>>>>> adf99c4 (atualização)
          setIsReady(true);
        }
      }
    }

<<<<<<< HEAD
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
=======
    init();

    return () => {
      mountedRef.current = false;
      clearTimeout(retryTimeout);
>>>>>>> adf99c4 (atualização)
    };
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isReady }}>
      {children}
    </DatabaseContext.Provider>
  );
}
