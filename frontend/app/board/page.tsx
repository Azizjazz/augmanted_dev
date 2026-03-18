'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTaskContext } from '@/context/TaskContext';
import KanbanBoard from '@/components/KanbanBoard';
import TaskModal from '@/components/TaskModal';
import { useState } from 'react';

export default function BoardPage() {
  const { isAuthenticated, isLoading, user, logout, token } = useAuth();
  const { tasks, fetchTasks, isLoading: tasksLoading, error } = useTaskContext();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchTasks();
    }
  }, [isAuthenticated, token, fetchTasks]);

  if (isLoading || tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
          <p className="text-white text-lg">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-slate-900">
      <header className="glass sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">TaskBoard Pro</h1>
          <div className="flex items-center gap-4">
            <nav className="flex gap-2">
              <span className="px-4 py-2 text-white bg-white/10 rounded-lg">Board</span>
              <a href="/dashboard" className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                Dashboard
              </a>
            </nav>
            <span className="text-white/80">Welcome, {user?.username}</span>
            <span className="bg-white/20 text-white/80 text-xs px-2 py-1 rounded-full">
              {tasks.length} tasks
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="p-6">
        {error && (
          <div className="max-w-7xl mx-auto mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
            {error}
          </div>
        )}
        <KanbanBoard onAddTask={() => setShowModal(true)} />
      </main>

      <TaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
