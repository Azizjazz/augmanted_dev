import { Task, CreateTaskInput, UpdateTaskInput, MoveTaskInput } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_URL = `${API_BASE}/api/v1`;

function getAuthHeader(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
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

export async function fetchTasks(token: string): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeader(token) },
  });
  return handleResponse<Task[]>(response);
}

export async function fetchTask(token: string, id: number): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeader(token) },
  });
  return handleResponse<Task>(response);
}

export async function createTask(token: string, data: CreateTaskInput): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader(token) },
    body: JSON.stringify(data),
  });
  return handleResponse<Task>(response);
}

export async function updateTask(token: string, id: number, data: UpdateTaskInput): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader(token) },
    body: JSON.stringify(data),
  });
  return handleResponse<Task>(response);
}

export async function deleteTask(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader(token) },
  });
  return handleResponse<void>(response);
}

export async function moveTask(token: string, id: number, data: MoveTaskInput): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}/move`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader(token) },
    body: JSON.stringify(data),
  });
  return handleResponse<Task>(response);
}
