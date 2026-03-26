import { Task, CreateTaskInput, UpdateTaskInput, MoveTaskInput, TaskStats } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_URL = `${API_BASE}/api/v1`;
const TOKEN_KEY = 'taskboard_token';

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

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

export async function register(data: RegisterInput): Promise<User> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<User>(response);
}

export async function login(data: LoginInput): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<AuthResponse>(response);
}

export async function getMe(): Promise<User> {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
  });
  return handleResponse<User>(response);
}

export async function verifyToken(): Promise<{ valid: boolean; user_id: string; username: string }> {
  const response = await fetch(`${API_URL}/auth/verify`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
  });
  return handleResponse<{ valid: boolean; user_id: string; username: string }>(response);
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
  const response = await fetch(`${API_URL}/analytics/stats`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
  });
  return handleResponse<TaskStats>(response);
}
