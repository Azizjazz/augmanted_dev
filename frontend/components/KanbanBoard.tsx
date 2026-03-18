'use client';

import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { useTaskContext } from '@/context/TaskContext';
import { COLUMNS } from '@/types';

interface KanbanBoardProps {
  onAddTask: () => void;
}

export default function KanbanBoard({ onAddTask }: KanbanBoardProps) {
  const { tasks, moveTask, deleteTask } = useTaskContext();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (draggedTask && draggedTask.status !== status) {
      await moveTask(draggedTask.id, { status, position: 0 });
    }
    setDraggedTask(null);
  };

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status).sort((a, b) => a.position - b.position);

  const priorityColors: Record<TaskPriority, string> = {
    high: 'from-red-500/20 to-red-600/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    medium: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]',
    low: 'from-blue-500/20 to-blue-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
  };

  const priorityDots: Record<TaskPriority, string> = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((column) => (
        <div
          key={column.id}
          className={`flex-shrink-0 w-72 backdrop-blur-md bg-white/10 rounded-xl p-4 min-h-[500px] transition-colors ${
            dragOverColumn === column.id ? 'bg-white/15' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg">{column.title}</h3>
            <span className="bg-white/20 text-white/80 text-sm px-2 py-0.5 rounded-full">
              {getTasksByStatus(column.id).length}
            </span>
          </div>
          <div className="space-y-3">
            {getTasksByStatus(column.id).map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                className={`glass-card bg-gradient-to-br ${priorityColors[task.priority]} border p-3 rounded-lg cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-transform`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`w-2 h-2 rounded-full mt-1.5 ${priorityDots[task.priority]}`} />
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-white/50 hover:text-red-400 text-sm"
                  >
                    ×
                  </button>
                </div>
                <h4 className="text-white font-medium text-sm mb-1">{task.title}</h4>
                {task.description && (
                  <p className="text-white/60 text-xs line-clamp-2">{task.description}</p>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={onAddTask}
            className="w-full mt-4 py-2 border border-dashed border-white/30 text-white/60 hover:text-white hover:border-white/50 rounded-lg transition-colors text-sm"
          >
            + Add Task
          </button>
        </div>
      ))}
    </div>
  );
}
