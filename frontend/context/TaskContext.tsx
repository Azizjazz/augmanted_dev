'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput, MoveTaskInput } from '../types';
import * as api from '../lib/api';

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
  const [state, setState] = useState<TaskState>({
    tasks: [],
    isLoading: false,
    error: null,
  });

  const fetchTasks = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const tasks = await api.fetchTasks();
      setState({ tasks, isLoading: false, error: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
      }));
    }
  }, []);

  const addTask = useCallback(async (task: CreateTaskInput) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const newTask = await api.createTask(task);
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
  }, []);

  const updateTask = useCallback(async (id: number, task: UpdateTaskInput) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const updatedTask = await api.updateTask(id, task);
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
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await api.deleteTask(id);
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
  }, []);

  const moveTask = useCallback(async (id: number, data: MoveTaskInput) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const updatedTask = await api.moveTask(id, data);
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
  }, []);

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
