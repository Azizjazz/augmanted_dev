import { Task, CreateTaskInput, UpdateTaskInput, MoveTaskInput, TaskStats } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_URL = `${API_BASE}/api/v1`;
const TOKEN_KEY = 'taskboard_token';

function getAuthHeader(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `HTTP error ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
  });
  return handleResponse<Task[]>(response);
}

export async function fetchTask(id: number): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
  });
  return handleResponse<Task>(response);
}

export async function createTask(data: CreateTaskInput): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  return handleResponse<Task>(response);
}

export async function updateTask(id: number, data: UpdateTaskInput): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  return handleResponse<Task>(response);
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  return handleResponse<void>(response);
}

export async function moveTask(id: number, data: MoveTaskInput): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}/move`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  return handleResponse<Task>(response);
}

export async function fetchStats(): Promise<TaskStats> {
  const response = await fetch(`${API_URL}/tasks/stats`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
  });
  return handleResponse<TaskStats>(response);
}
