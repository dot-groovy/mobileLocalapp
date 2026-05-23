import React, { createContext, useContext } from 'react';

interface DatabaseContextValue {
  db: null;
  isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  db: null,
  isReady: true,
});

export function useDatabase() {
  return useContext(DatabaseContext);
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <DatabaseContext.Provider value={{ db: null, isReady: true }}>
      {children}
    </DatabaseContext.Provider>
  );
}
