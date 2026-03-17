export type Priority = 'high' | 'medium' | 'low';

export type ColumnTitle = 'Backlog' | 'In Progress' | 'Review' | 'Done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  columnId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: ColumnTitle;
  order: number;
  tasks: Task[];
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority: Priority;
  columnId: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: Priority;
  columnId?: string;
  order?: number;
}

export interface ReorderTasksPayload {
  taskId: string;
  newColumnId: string;
  newOrder: number;
}
