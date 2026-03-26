'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTaskContext } from '@/context/TaskContext';
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
  backlog: 'bg-gray-400',
  in_progress: 'bg-blue-500',
  review: 'bg-purple-500',
  done: 'bg-green-500',
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high: 'border-l-devoteam-red',
  medium: 'border-l-devoteam-dark',
  low: 'border-l-gray-400',
};

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const { tasks } = useTaskContext();
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-devoteam-grey flex items-center justify-center">
        <div className="bg-white shadow-card rounded-lg p-8">
          <p className="text-devoteam-dark font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const stats: TaskStats = {
    total_tasks: tasks.length,
    status_counts: {
      backlog: tasks.filter(t => t.status === 'backlog').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length,
    },
    priority_counts: {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    },
  };

  const maxStatusCount = Math.max(...Object.values(stats.status_counts), 1);

  return (
    <div className="min-h-screen bg-devoteam-grey">
      {/* Devoteam Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Devoteam Logo */}
          <div className="pl-2">
            <a href="/board">
              <img 
                src="/assets/devoteam-logo.png" 
                alt="Devoteam" 
                className="h-12 w-auto"
              />
            </a>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-6">
            <nav className="flex gap-1">
              <a href="/board" className="px-4 py-2 text-devoteam-dark/60 hover:text-devoteam-dark hover:bg-devoteam-grey font-medium text-sm rounded transition-all">
                Board
              </a>
              <span className="px-4 py-2 bg-devoteam-red text-white font-semibold text-sm rounded">Dashboard</span>
            </nav>
            
            <div className="h-6 w-px bg-gray-200" />
            
            <span className="text-devoteam-dark/70 text-sm">Welcome, <span className="font-semibold">{user?.username}</span></span>
            <button
              onClick={logout}
              className="px-4 py-2 text-devoteam-dark/70 hover:text-devoteam-dark hover:bg-devoteam-grey font-medium text-sm rounded transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-devoteam-red/30 rounded text-devoteam-red text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-xl font-bold text-devoteam-dark mb-6">Total Tasks: {stats.total_tasks}</h2>

          <section className="mb-8">
            <h3 className="text-lg font-semibold text-devoteam-dark mb-4">Status Distribution</h3>
            <div className="space-y-3">
              {COLUMNS.map((col) => {
                const count = stats.status_counts[col.id] || 0;
                const pct = (count / maxStatusCount) * 100;
                return (
                  <div key={col.id} className="flex items-center gap-4">
                    <span className="w-24 text-gray-600 text-sm font-medium">{STATUS_LABELS[col.id]}</span>
                    <div className="flex-1 h-8 bg-devoteam-grey rounded overflow-hidden">
                      <div
                        className={`h-full ${STATUS_COLORS[col.id]} transition-all duration-500 flex items-center justify-end pr-3`}
                        style={{ width: `${pct}%` }}
                      >
                        {count > 0 && <span className="text-white text-sm font-semibold">{count}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-devoteam-dark mb-4">Severity Heatmap</h3>
            <div className="grid grid-cols-3 gap-4">
              {(['high', 'medium', 'low'] as TaskPriority[]).map((priority) => {
                const count = stats.priority_counts[priority] || 0;
                return (
                  <div
                    key={priority}
                    className={`rounded-lg p-6 text-center bg-devoteam-grey border-l-4 ${
                      priority === 'high' ? 'border-l-devoteam-red' : 
                      priority === 'medium' ? 'border-l-devoteam-dark' : 
                      'border-l-gray-400'
                    }`}
                  >
                    <div className="text-4xl font-bold text-devoteam-dark mb-2">{count}</div>
                    <div className="text-gray-500 uppercase text-sm tracking-wide font-medium">
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
