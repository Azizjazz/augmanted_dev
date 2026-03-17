'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import KanbanBoard from '@/components/KanbanBoard';
import { motion, AnimatePresence } from 'framer-motion';

function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.div
      key={value}
      initial={{ scale: 1.2, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="text-4xl font-bold text-gray-800"
    >
      {value}
    </motion.div>
  );
}

function StatCard({ label, value, colorClass }: { 
  label: string; 
  value: number; 
  colorClass: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`card-glass bg-gradient-to-br ${colorClass} border backdrop-blur-sm rounded-xl p-6 text-center`}
    >
      <AnimatedNumber value={value} />
      <div className="text-sm text-gray-600 mt-2 font-medium">{label}</div>
    </motion.div>
  );
}

function RefreshButton({ onClick, isLoading }: { onClick: () => void; isLoading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 card-glass rounded-lg hover:bg-white/50 transition-all disabled:opacity-50"
    >
      <svg
        className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <span className="text-sm font-medium text-gray-600">Refresh</span>
    </button>
  );
}

function StatsDashboard() {
  const { token } = useAuth();
  const { stats, fetchTasks, isLoading, tasks } = useTasks();

  useEffect(() => {
    if (token && tasks.length === 0) {
      fetchTasks(token);
    }
  }, [token, fetchTasks, tasks.length]);

  const handleRefresh = () => {
    if (token) {
      fetchTasks(token);
    }
  };

  const statusLabels: Record<string, string> = {
    backlog: 'Backlog',
    in_progress: 'In Progress',
    review: 'Review',
    done: 'Done',
  };

  const statusColors: Record<string, string> = {
    backlog: 'from-slate-500/20 to-slate-600/20 border-slate-400/30',
    in_progress: 'from-blue-500/20 to-blue-600/20 border-blue-400/30',
    review: 'from-amber-500/20 to-amber-600/20 border-amber-400/30',
    done: 'from-emerald-500/20 to-emerald-600/20 border-emerald-400/30',
  };

  const priorityColors: Record<string, string> = {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-blue-500',
  };

  const columns = ['backlog', 'in_progress', 'review', 'done'] as const;

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-end">
        <RefreshButton onClick={handleRefresh} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <AnimatePresence mode="wait">
          {columns.map((col) => (
            <StatCard
              key={col}
              label={statusLabels[col]}
              value={stats.by_status[col]}
              colorClass={statusColors[col]}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="card-glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Priority Breakdown by Status</h3>
        <div className="grid grid-cols-4 gap-6">
          {columns.map((col) => {
            const priorityData = stats.by_priority_per_status[col];
            const total = priorityData.high + priorityData.medium + priorityData.low;
            return (
              <div key={col} className="space-y-3">
                <h4 className="font-medium text-gray-700 text-center">{statusLabels[col]}</h4>
                {(['high', 'medium', 'low'] as const).map((p) => {
                  const count = priorityData[p];
                  const pct = total > 0 ? (count / total) * 100 : 0;
                  return (
                    <div key={p} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize text-gray-600">{p}</span>
                        <span className="font-medium text-gray-800">{count}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${priorityColors[p]}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<'board' | 'dashboard'>('board');
  const { fetchTasks } = useTasks();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [token, isLoading, router]);

  useEffect(() => {
    if (token) {
      fetchTasks(token);
    }
  }, [token, fetchTasks]);

  const handleViewChange = (newView: 'board' | 'dashboard') => {
    setView(newView);
    if (newView === 'dashboard' && token) {
      fetchTasks(token);
    }
  };

  if (isLoading || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <header className="p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">TaskBoard Pro</h1>
          <div className="flex gap-2">
            <button
              onClick={() => handleViewChange('board')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view === 'board'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'card-glass text-gray-600 hover:bg-white/50'
              }`}
            >
              Board View
            </button>
            <button
              onClick={() => handleViewChange('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view === 'dashboard'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'card-glass text-gray-600 hover:bg-white/50'
              }`}
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        {view === 'board' ? <KanbanBoard /> : <StatsDashboard />}
      </main>
    </div>
  );
}
