import api from './api';
import { 
  type Task, 
  type CreateTaskRequest, 
  type UpdateTaskRequest,
  type TasksResponse 
} from '../types/task';

export const taskService = {
  // Get all tasks for a specific project
  async getTasksByProject(projectId: number): Promise<TasksResponse> {
    const response = await api.get<TasksResponse>(`/projects/${projectId}/tasks`);
    return response.data;
  },

  // Get a specific task by ID
  async getTask(projectId: number, taskId: number): Promise<{ task: Task }> {
    const response = await api.get<{ task: Task }>(`/projects/${projectId}/tasks/${taskId}`);
    return response.data;
  },

  // Create a new task
  async createTask(projectId: number, data: CreateTaskRequest): Promise<{ message: string; task: Task }> {
    const response = await api.post<{ message: string; task: Task }>(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  // Update an existing task
  async updateTask(projectId: number, taskId: number, data: UpdateTaskRequest): Promise<{ message: string; task: Task }> {
    const response = await api.put<{ message: string; task: Task }>(`/projects/${projectId}/tasks/${taskId}`, data);
    return response.data;
  },

  // Delete a task
  async deleteTask(projectId: number, taskId: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/projects/${projectId}/tasks/${taskId}`);
    return response.data;
  },
}; 
