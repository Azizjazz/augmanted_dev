'use client';

import React, { useState, useEffect } from 'react';
import { CreateTaskInput, TaskStatus, TaskPriority, COLUMNS } from '@/types';
import { useTaskContext } from '@/context/TaskContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskModal({ isOpen, onClose }: TaskModalProps) {
  const { addTask } = useTaskContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('backlog');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('backlog');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const taskData: CreateTaskInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
      };
      await addTask(taskData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Create New Task</h2>
          <button
            onClick={onClose}
            className="transition-colors"
            style={{ color: '#6B7280' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A1A' }}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border rounded text-sm focus:ring-2 focus:ring-[#F22F46] focus:border-[#F22F46] outline-none"
              style={{ borderColor: '#E5E7EB', color: '#1A1A1A' }}
              placeholder="Enter task title"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A1A' }}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border rounded text-sm resize-none focus:ring-2 focus:ring-[#F22F46] focus:border-[#F22F46] outline-none"
              style={{ borderColor: '#E5E7EB', color: '#1A1A1A' }}
              placeholder="Enter task description (optional)"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A1A' }}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-4 py-2.5 border rounded text-sm focus:ring-2 focus:ring-[#F22F46] focus:border-[#F22F46] outline-none"
                style={{ borderColor: '#E5E7EB', color: '#1A1A1A' }}
                disabled={isSubmitting}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1A1A1A' }}>Column</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-4 py-2.5 border rounded text-sm focus:ring-2 focus:ring-[#F22F46] focus:border-[#F22F46] outline-none"
                style={{ borderColor: '#E5E7EB', color: '#1A1A1A' }}
                disabled={isSubmitting}
              >
                {COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-sm font-medium" style={{ color: '#F22F46' }}>{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border font-semibold rounded transition-colors"
              style={{ borderColor: '#E5E7EB', color: '#1A1A1A' }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 font-bold rounded transition-colors"
              style={{ backgroundColor: '#F22F46', color: 'white' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
