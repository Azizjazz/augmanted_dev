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
      <header className="sticky top-0 z-40" style={{ backgroundColor: '#F9F9F9', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Devoteam Logo - Larger and further left */}
          <div className="pl-2">
            <a href="/board">
              <img 
                src="/assets/devoteam-logo.png" 
                alt="Devoteam" 
                className="h-16 w-auto"
              />
            </a>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-6">
            <nav className="flex gap-1">
              <span className="px-4 py-2 bg-[#F22F46] text-white font-semibold text-sm rounded">Board</span>
              <a href="/dashboard" className="px-4 py-2 font-semibold text-sm rounded transition-all" style={{ color: '#F22F46' }}>
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
              className="px-4 py-2 font-semibold text-sm rounded transition-all"
              style={{ color: '#F22F46' }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="p-6">
        {error && (
          <div className="max-w-7xl mx-auto mb-4 p-4 bg-red-50 border rounded" style={{ borderColor: '#F22F46' }}>
            <p className="text-sm font-medium" style={{ color: '#F22F46' }}>{error}</p>
          </div>
        )}
        <KanbanBoard onAddTask={() => setShowModal(true)} />
      </main>

      <TaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
