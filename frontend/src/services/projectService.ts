import api from './api';
import { 
  type Project, 
  type CreateProjectRequest, 
  type UpdateProjectRequest,
  type ProjectsResponse 
} from '../types/project';

export const projectService = {
  // Get all projects (admin sees all, user sees only their own)
  async getAllProjects(): Promise<ProjectsResponse> {
    const response = await api.get<ProjectsResponse>('/projects');
    return response.data;
  },

  // Get a specific project by ID
  async getProject(id: number): Promise<{ project: Project }> {
    const response = await api.get<{ project: Project }>(`/projects/${id}`);
    return response.data;
  },

  // Create a new project
  async createProject(data: CreateProjectRequest): Promise<{ message: string; project: Project }> {
    const response = await api.post<{ message: string; project: Project }>('/projects', data);
    return response.data;
  },

  // Update an existing project
  async updateProject(id: number, data: UpdateProjectRequest): Promise<{ message: string; project: Project }> {
    const response = await api.put<{ message: string; project: Project }>(`/projects/${id}`, data);
    return response.data;
  },

  // Delete a project
  async deleteProject(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/projects/${id}`);
    return response.data;
  },
}; 
