import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GameContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userRole: 'superadmin' | 'admin' | null;
  setUserRole: (role: 'superadmin' | 'admin' | null) => void;
  establishmentId: string | null;
  setEstablishmentId: (id: string | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'superadmin' | 'admin' | null>(null);
  const [establishmentId, setEstablishmentId] = useState<string | null>(null);

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    userRole,
    setUserRole,
    establishmentId,
    setEstablishmentId
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}