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
      <div className="min-h-screen bg-devoteam-grey flex items-center justify-center">
        <div className="bg-white shadow-card rounded-lg p-8">
          <p className="text-devoteam-dark text-lg font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-devoteam-grey">
      {/* Devoteam Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Devoteam Logo */}
          <div className="flex items-center gap-2">
            <span className="text-devoteam-dark font-bold text-xl tracking-tight">devoteam</span>
            <span className="text-devoteam-red font-bold text-xl">.</span>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-6">
            <nav className="flex gap-1">
              <span className="px-4 py-2 bg-devoteam-red text-white font-semibold text-sm rounded">Board</span>
              <a href="/dashboard" className="px-4 py-2 text-devoteam-dark/60 hover:text-devoteam-dark hover:bg-devoteam-grey font-medium text-sm rounded transition-all">
                Dashboard
              </a>
            </nav>
            
            <div className="h-6 w-px bg-gray-200" />
            
            <span className="text-devoteam-dark/70 text-sm">Welcome, <span className="font-semibold">{user?.username}</span></span>
            <span className="bg-devoteam-grey text-devoteam-dark text-xs font-semibold px-3 py-1 rounded">
              {tasks.length} tasks
            </span>
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
      <main className="p-6">
        {error && (
          <div className="max-w-7xl mx-auto mb-4 p-4 bg-red-50 border border-devoteam-red/30 rounded text-devoteam-red text-sm">
            {error}
          </div>
        )}
        <KanbanBoard onAddTask={() => setShowModal(true)} />
      </main>

      <TaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
