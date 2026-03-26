'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput, MoveTaskInput } from '../types';
import { 
  fetchTasks as fetchTasksService, 
  createTask as createTaskService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
  moveTask as moveTaskService
} from '../services/taskService';
import { useAuth } from './AuthContext';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

interface TaskContextValue extends TaskState {
  fetchTasks: () => Promise<void>;
  addTask: (task: CreateTaskInput) => Promise<void>;
  updateTask: (id: number, task: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  moveTask: (id: number, data: MoveTaskInput) => Promise<void>;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [state, setState] = useState<TaskState>({
    tasks: [],
    isLoading: false,
    error: null,
  });

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const tasks = await fetchTasksService(token);
      setState({ tasks, isLoading: false, error: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
      }));
    }
  }, [token]);

  const addTask = useCallback(async (task: CreateTaskInput) => {
    if (!token) return;
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const newTask = await createTaskService(token, task);
      setState(prev => ({
        ...prev,
        tasks: [...prev.tasks, newTask],
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to add task',
      }));
      throw error;
    }
  }, [token]);

  const updateTask = useCallback(async (id: number, task: UpdateTaskInput) => {
    if (!token) return;
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const updatedTask = await updateTaskService(token, id, task);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => (t.id === id ? updatedTask : t)),
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update task',
      }));
      throw error;
    }
  }, [token]);

  const deleteTask = useCallback(async (id: number) => {
    if (!token) return;
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await deleteTaskService(token, id);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete task',
      }));
      throw error;
    }
  }, [token]);

  const moveTask = useCallback(async (id: number, data: MoveTaskInput) => {
    if (!token) return;
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const updatedTask = await moveTaskService(token, id, data);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => (t.id === id ? updatedTask : t)),
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to move task',
      }));
      throw error;
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <TaskContext.Provider
      value={{
        ...state,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
