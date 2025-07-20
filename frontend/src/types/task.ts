export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  project_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'completed';
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
}

export interface TasksResponse {
  tasks: Task[];
  count: number;
}

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed'
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  todo: '#6b7280',
  in_progress: '#3b82f6', 
  completed: '#10b981'
}; 
