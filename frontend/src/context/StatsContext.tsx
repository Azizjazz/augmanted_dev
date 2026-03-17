'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Stats {
  total: number;
  by_status: {
    backlog: number;
    in_progress: number;
    review: number;
    done: number;
  };
  by_priority_per_status: {
    backlog: { high: number; medium: number; low: number };
    in_progress: { high: number; medium: number; low: number };
    review: { high: number; medium: number; low: number };
    done: { high: number; medium: number; low: number };
  };
}

interface StatsContextType {
  stats: Stats | null;
  setStats: (stats: Stats | null) => void;
  refreshStats: (token: string) => Promise<void>;
  invalidateStats: () => void;
}

const StatsContext = createContext<StatsContextType | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<Stats | null>(null);

  const refreshStats = useCallback(async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/stats`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    }
  }, []);

  const invalidateStats = useCallback(() => {
    setStats(null);
  }, []);

  return (
    <StatsContext.Provider value={{ stats, setStats, refreshStats, invalidateStats }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}
