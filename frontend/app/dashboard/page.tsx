'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import * as api from '@/lib/api';
import { TaskStats, TaskStatus, TaskPriority, COLUMNS } from '@/types';

const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  backlog: 'from-slate-500/40 to-slate-600/40 border-slate-500/50',
  in_progress: 'from-blue-500/40 to-blue-600/40 border-blue-500/50',
  review: 'from-purple-500/40 to-purple-600/40 border-purple-500/50',
  done: 'from-green-500/40 to-green-600/40 border-green-500/50',
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high: 'from-red-500/40 to-red-600/40 border-red-500/50',
  medium: 'from-yellow-500/40 to-yellow-600/40 border-yellow-500/50',
  low: 'from-blue-500/40 to-blue-600/40 border-blue-500/50',
};

const PRIORITY_HEAT: Record<TaskPriority, string> = {
  high: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]',
  medium: 'shadow-[0_0_20px_rgba(234,179,8,0.4)]',
  low: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
};

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      api.fetchStats()
        .then(setStats)
        .catch(() => setError('Failed to load stats'))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-slate-900">
        <div className="glass-card p-8 rounded-2xl">
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !stats) {
    return null;
  }

  const maxStatusCount = Math.max(...Object.values(stats.status_counts), 1);
  const maxPriorityCount = Math.max(...Object.values(stats.priority_counts), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-slate-900">
      <header className="glass sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">TaskBoard Pro</h1>
          <div className="flex items-center gap-4">
            <nav className="flex gap-2">
              <a href="/board" className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                Board
              </a>
              <span className="px-4 py-2 text-white bg-white/10 rounded-lg">Dashboard</span>
            </nav>
            <span className="text-white/80">Welcome, {user?.username}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Total Tasks: {stats.total_tasks}</h2>

          <section className="mb-8">
            <h3 className="text-lg font-semibold text-white/90 mb-4">Status Distribution</h3>
            <div className="space-y-3">
              {COLUMNS.map((col) => {
                const count = stats.status_counts[col.id] || 0;
                const pct = (count / maxStatusCount) * 100;
                return (
                  <div key={col.id} className="flex items-center gap-4">
                    <span className="w-24 text-white/70 text-sm">{STATUS_LABELS[col.id]}</span>
                    <div className="flex-1 h-8 bg-white/10 rounded-lg overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${STATUS_COLORS[col.id]} border-r transition-all duration-500 flex items-center justify-end pr-3`}
                        style={{ width: `${pct}%` }}
                      >
                        {count > 0 && <span className="text-white text-sm font-medium">{count}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white/90 mb-4">Severity Heatmap</h3>
            <div className="grid grid-cols-3 gap-4">
              {(['high', 'medium', 'low'] as TaskPriority[]).map((priority) => {
                const count = stats.priority_counts[priority] || 0;
                return (
                  <div
                    key={priority}
                    className={`glass-card rounded-xl p-6 text-center bg-gradient-to-br ${PRIORITY_COLORS[priority]} border ${PRIORITY_HEAT[priority]} transition-all hover:scale-105`}
                  >
                    <div className="text-4xl font-bold text-white mb-2">{count}</div>
                    <div className="text-white/70 uppercase text-sm tracking-wide">
                      {PRIORITY_LABELS[priority]}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
