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
    high: 'bg-devoteam-red',
    medium: 'bg-devoteam-dark',
    low: 'bg-gray-400',
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {COLUMNS.map((column) => (
        <div
          key={column.id}
          className={`flex-shrink-0 w-80 rounded-lg bg-white border border-gray-200 p-4 min-h-[600px] transition-colors ${
            dragOverColumn === column.id ? 'border-devoteam-red/50 bg-gray-50' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-devoteam-dark font-bold text-base">{column.title}</h3>
            <span className="bg-devoteam-grey text-devoteam-dark text-xs font-semibold px-2.5 py-1 rounded">
              {getTasksByStatus(column.id).length}
            </span>
          </div>
          <div className="space-y-3">
            {getTasksByStatus(column.id).map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                className="group bg-white border border-gray-200 rounded shadow-card hover:shadow-md transition-all cursor-grab active:cursor-grabbing overflow-hidden"
              >
                {/* Priority Color Bar - Left Side */}
                <div className={`w-1 h-full absolute left-0 ${priorityColors[task.priority]}`} />
                
                <div className="pl-3 pr-3 pt-3 pb-2">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-2 h-2 rounded-sm ${priorityColors[task.priority]}`} />
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-400 hover:text-devoteam-red text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                  <h4 className="text-devoteam-dark font-semibold text-sm mb-1">{task.title}</h4>
                  {task.description && (
                    <p className="text-gray-500 text-xs line-clamp-2">{task.description}</p>
                  )}
                  <div className={`mt-2 inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    task.priority === 'high' ? 'bg-devoteam-red/10 text-devoteam-red' :
                    task.priority === 'medium' ? 'bg-devoteam-dark/10 text-devoteam-dark' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={onAddTask}
            className="btn-primary w-full mt-4"
          >
            + Add Task
          </button>
        </div>
      ))}
    </div>
  );
}
