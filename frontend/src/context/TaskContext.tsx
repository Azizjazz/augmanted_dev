'use client';

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { Task } from '@/lib/types';

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

interface TaskContextType {
  tasks: Task[];
  stats: Stats;
  isLoading: boolean;
  isStatsLoading: boolean;
  fetchTasks: (token: string) => Promise<void>;
  refreshStats: (token: string) => Promise<void>;
  addTask: (task: Task, token?: string) => void;
  removeTask: (taskId: string, token?: string) => void;
  updateTask: (task: Task, token?: string) => void;
  syncTasks: (token: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function calculateStats(tasks: Task[]): Stats {
  const stats: Stats = {
    total: tasks.length,
    by_status: {
      backlog: 0,
      in_progress: 0,
      review: 0,
      done: 0,
    },
    by_priority_per_status: {
      backlog: { high: 0, medium: 0, low: 0 },
      in_progress: { high: 0, medium: 0, low: 0 },
      review: { high: 0, medium: 0, low: 0 },
      done: { high: 0, medium: 0, low: 0 },
    },
  };

  const columnIdToStatus: Record<string, keyof typeof stats.by_status> = {
    'col-1': 'backlog',
    'col-2': 'in_progress',
    'col-3': 'review',
    'col-4': 'done',
  };

  for (const task of tasks) {
    const status = columnIdToStatus[task.columnId] || 'backlog';
    stats.by_status[status]++;
    stats.by_priority_per_status[status][task.priority]++;
  }

  return stats;
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  const stats = useMemo(() => calculateStats(tasks), [tasks]);

  const fetchTasks = useCallback(async (token: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });
      if (res.ok) {
        const data: Task[] = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshStats = useCallback(async (token: string) => {
    setIsStatsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/stats`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });
      if (res.ok) {
        const data: Task[] = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  const addTask = useCallback((task: Task, token?: string) => {
    setTasks(prev => [...prev, task]);
  }, []);

  const removeTask = useCallback((taskId: string, token?: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  const updateTask = useCallback((task: Task, token?: string) => {
    setTasks(prev => prev.map(t => t.id === task.id ? task : t));
  }, []);

  const syncTasks = useCallback(async (token: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });
      if (res.ok) {
        const data: Task[] = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to sync tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      stats, 
      isLoading, 
      isStatsLoading,
      fetchTasks, 
      refreshStats, 
      addTask, 
      removeTask,
      updateTask,
      syncTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
