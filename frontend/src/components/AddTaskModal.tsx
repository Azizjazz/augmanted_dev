'use client';

import { useState, useEffect, useRef } from 'react';
import { Priority, CreateTaskPayload, Task } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
  defaultColumnId?: string;
  token?: string | null;
}

const INITIAL_COLUMNS = [
  { id: 'col-1', title: 'Backlog' },
  { id: 'col-2', title: 'In Progress' },
  { id: 'col-3', title: 'Review' },
  { id: 'col-4', title: 'Done' },
];

export default function AddTaskModal({ isOpen, onClose, onTaskCreated, defaultColumnId = 'col-1', token }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [columnId, setColumnId] = useState(defaultColumnId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setColumnId(defaultColumnId);
  }, [defaultColumnId, isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title, description, priority, column_id: columnId }),
      });

      if (res.ok) {
        const taskFromApi = await res.json();
        // Convert snake_case from API to camelCase for frontend
        const task: Task = {
          id: taskFromApi.id,
          title: taskFromApi.title,
          description: taskFromApi.description,
          priority: taskFromApi.priority,
          columnId: taskFromApi.column_id,
          order: taskFromApi.order,
          createdAt: taskFromApi.created_at,
          updatedAt: taskFromApi.updated_at,
        };
        onTaskCreated(task);
        setTitle('');
        setDescription('');
        setPriority('medium');
        onClose();
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center modal-glass"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="glass w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none"
              rows={3}
              placeholder="Enter task description (optional)"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-4 py-2 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label htmlFor="column" className="block text-sm font-medium text-gray-700 mb-1">
              Column
            </label>
            <select
              id="column"
              value={columnId}
              onChange={(e) => setColumnId(e.target.value)}
              className="w-full px-4 py-2 bg-white/50 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            >
              {INITIAL_COLUMNS.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200/50 hover:bg-gray-300/50 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className={cn(
                'flex-1 px-4 py-2 bg-purple-500/80 hover:bg-purple-600/80 text-white font-medium rounded-lg transition-colors',
                (isSubmitting || !title.trim()) && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
