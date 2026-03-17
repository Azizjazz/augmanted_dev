'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { Column, Task, Priority } from '@/lib/types';
import { cn } from '@/lib/utils';
import AddTaskModal from './AddTaskModal';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';

const INITIAL_COLUMNS: Column[] = [
  { id: 'col-1', title: 'Backlog', order: 0, tasks: [] },
  { id: 'col-2', title: 'In Progress', order: 1, tasks: [] },
  { id: 'col-3', title: 'Review', order: 2, tasks: [] },
  { id: 'col-4', title: 'Done', order: 3, tasks: [] },
];

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-500/80',
  medium: 'bg-amber-500/80',
  low: 'bg-blue-500/80',
};

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  onDelete?: (taskId: string) => void;
}

function TaskCard({ task, isOverlay, onDelete }: TaskCardProps) {
  return (
    <div
      className={cn(
        'p-4 shadow-sm transition-all',
        isOverlay
          ? 'card-glass scale-105 rotate-2 shadow-xl cursor-grabbing'
          : 'card-glass hover:shadow-md cursor-grab active:cursor-grabbing'
      )}
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-semibold text-gray-800 flex-1">{task.title}</h3>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      {task.description && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{task.description}</p>
      )}
      <span
        className={cn(
          'inline-block mt-3 px-3 py-1 rounded-full text-xs text-white font-medium capitalize',
          priorityColors[task.priority]
        )}
      >
        {task.priority}
      </span>
    </div>
  );
}

interface SortableTaskCardProps {
  task: Task;
  onDelete?: (taskId: string) => void;
}

function SortableTaskCard({ task, onDelete }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <TaskCard task={task} onDelete={onDelete} />
    </div>
  );
}

interface ColumnComponentProps {
  column: Column;
  onDelete?: (taskId: string) => void;
}

function ColumnComponent({ column, onDelete }: ColumnComponentProps) {
  const taskIds = useMemo(() => column.tasks.map((t) => t.id), [column.tasks]);
  
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex-1 min-w-[280px] max-w-[350px]">
      <div className="column-glass p-5 h-full min-h-[500px]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800 tracking-wide">{column.title}</h2>
          <span className="text-sm text-gray-600 bg-white/40 px-3 py-1 rounded-full font-medium">
            {column.tasks.length}
          </span>
        </div>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div ref={setDroppableRef} className="space-y-3 min-h-[400px]">
            {column.tasks.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-12 opacity-50">
                No tasks yet
              </p>
            ) : (
              column.tasks.map((task) => <SortableTaskCard key={task.id} task={task} onDelete={onDelete} />)
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

interface KanbanBoardProps {
  onTaskChange?: () => void;
}

export default function KanbanBoard({ onTaskChange }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token, userEmail, logout } = useAuth();
  const { tasks, fetchTasks, addTask, removeTask, updateTask, syncTasks, isLoading } = useTasks();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (token && tasks.length === 0) {
      fetchTasks(token);
    }
  }, [token, fetchTasks]);

  useEffect(() => {
    const tasksByColumn = tasks.reduce((acc, task) => {
      if (!acc[task.columnId]) {
        acc[task.columnId] = [];
      }
      acc[task.columnId].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: tasksByColumn[col.id] || [],
      }))
    );
  }, [tasks]);

  function findTask(taskId: string): Task | undefined {
    for (const col of columns) {
      const task = col.tasks.find((t) => t.id === taskId);
      if (task) return task;
    }
    return undefined;
  }

  function findColumn(taskId: string): string | undefined {
    for (const col of columns) {
      if (col.tasks.find((t) => t.id === taskId)) {
        return col.id;
      }
    }
    return undefined;
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = findTask(active.id as string);
    if (task) {
      setActiveTask(task);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumnId = findColumn(activeId);
    let overColumnId = findColumn(overId);

    if (!overColumnId) {
      const overColumn = columns.find((col) => col.id === overId);
      if (overColumn) {
        overColumnId = overColumn.id;
      }
    }

    if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) {
      return;
    }

    setColumns((prev) => {
      const newColumns = [...prev];
      const activeCol = newColumns.find((c) => c.id === activeColumnId);
      const overCol = newColumns.find((c) => c.id === overColumnId);

      if (!activeCol || !overCol) return prev;

      const taskIndex = activeCol.tasks.findIndex((t) => t.id === activeId);
      if (taskIndex === -1) return prev;

      const [task] = activeCol.tasks.splice(taskIndex, 1);
      task.columnId = overColumnId;

      const overIndex = overCol.tasks.findIndex((t) => t.id === overId);
      if (overIndex === -1) {
        overCol.tasks.push(task);
      } else {
        overCol.tasks.splice(overIndex, 0, task);
      }

      overCol.tasks.forEach((t, i) => (t.order = i));

      return newColumns;
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumnId = findColumn(activeId);
    let overColumnId = findColumn(overId);

    if (!overColumnId) {
      const overColumn = columns.find((col) => col.id === overId);
      if (overColumn) {
        overColumnId = overColumn.id;
      }
    }

    if (!activeColumnId || !overColumnId) return;

    const overColumn = columns.find((c) => c.id === overColumnId);
    if (!overColumn) return;

    const task = findTask(activeId);
    if (!task) return;

    const newOrder = overColumn.tasks.findIndex((t) => t.id === overId);

    if (!token) return;

    try {
      const res = await fetch(`/api/tasks/${activeId}/reorder`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newColumnId: overColumnId,
          newOrder: newOrder >= 0 ? newOrder : overColumn.tasks.length - 1,
        }),
      });
      
      if (res.ok) {
        const updatedTask = await res.json();
        const taskWithColumn: Task = {
          ...updatedTask,
          columnId: updatedTask.column_id,
        };
        updateTask(taskWithColumn);
        setColumns((prev) => {
          const newColumns = [...prev];
          const activeCol = newColumns.find((c) => c.id === activeColumnId);
          const newOverCol = newColumns.find((c) => c.id === overColumnId);
          
          if (!activeCol || !newOverCol) return prev;
          
          const taskIndex = activeCol.tasks.findIndex((t) => t.id === activeId);
          if (taskIndex === -1) return prev;
          
          const [movedTask] = activeCol.tasks.splice(taskIndex, 1);
          movedTask.columnId = updatedTask.column_id;
          movedTask.order = updatedTask.order;
          
          const targetIndex = newOverCol.tasks.findIndex((t) => t.id === overId);
          if (targetIndex === -1) {
            newOverCol.tasks.push(movedTask);
          } else {
            newOverCol.tasks.splice(targetIndex, 0, movedTask);
          }
          
          newOverCol.tasks.forEach((t, i) => (t.order = i));
          
          return newColumns;
        });
        if (token) {
          syncTasks(token);
        }
        onTaskChange?.();
      }
    } catch (error) {
      console.error('Failed to persist reorder:', error);
    }
  }

  function handleTaskCreated(task: Task) {
    addTask(task);
    onTaskChange?.();
  }

  async function fetchTasksLocal() {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const tasks: Task[] = await res.json();
        const tasksByColumn = tasks.reduce((acc, task) => {
          if (!acc[task.columnId]) {
            acc[task.columnId] = [];
          }
          acc[task.columnId].push(task);
          return acc;
        }, {} as Record<string, Task[]>);

        setColumns((prev) =>
          prev.map((col) => ({
            ...col,
            tasks: tasksByColumn[col.id] || [],
          }))
        );
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!token) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok || res.status === 204) {
        removeTask(taskId);
        syncTasks(token);
        onTaskChange?.();
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }

  const totalTasks = columns.reduce((sum, col) => sum + col.tasks.length, 0);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="p-6 md:p-8 lg:p-10 min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">TaskBoard Pro</h1>
            <span className="text-sm text-gray-600 bg-white/40 px-3 py-1 rounded-full">
              {totalTasks} task{totalTasks !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="text-sm text-gray-600">{userEmail}</span>
            )}
            <button
              onClick={logout}
              className="px-3 py-2 bg-gray-200/50 hover:bg-gray-300/50 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Logout
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-purple-500/80 hover:bg-purple-600/80 text-white font-medium rounded-lg transition-colors shadow-lg"
            >
              + Add Task
            </button>
          </div>
        </div>
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : (
            columns.map((column) => <ColumnComponent key={column.id} column={column} onDelete={handleDeleteTask} />)
          )}
        </div>
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={handleTaskCreated}
        token={token}
      />
    </DndContext>
  );
}
