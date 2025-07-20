import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { taskService } from '../services/taskService';
import { 
  type Task, 
  type CreateTaskRequest, 
  type UpdateTaskRequest,
  type TasksResponse 
} from '../types/task';

export const useTasks = (projectId: number) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => taskService.getTasksByProject(projectId),
    enabled: !!projectId,
  });
};

export const useTask = (projectId: number, taskId: number) => {
  return useQuery({
    queryKey: ['task', projectId, taskId],
    queryFn: () => taskService.getTask(projectId, taskId),
    enabled: !!projectId && !!taskId,
  });
};

export const useCreateTask = (projectId: number) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => taskService.createTask(projectId, data),
    onSuccess: (response) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      
      // Also invalidate projects to update task counts
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      enqueueSnackbar(`Task "${response.task.title}" created successfully!`, { 
        variant: 'success' 
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to create task';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });
};

export const useUpdateTask = (projectId: number) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: number; data: UpdateTaskRequest }) => 
      taskService.updateTask(projectId, taskId, data),
    onSuccess: (response) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      
      // Invalidate specific task
      queryClient.invalidateQueries({ queryKey: ['task', projectId, response.task.id] });
      
      // Also invalidate projects to update task counts
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      enqueueSnackbar(`Task "${response.task.title}" updated successfully!`, { 
        variant: 'success' 
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to update task';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });
};

export const useDeleteTask = (projectId: number) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (taskId: number) => taskService.deleteTask(projectId, taskId),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      
      // Also invalidate projects to update task counts
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      enqueueSnackbar('Task deleted successfully!', { 
        variant: 'success' 
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to delete task';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });
};

// Hook for quick status updates
export const useUpdateTaskStatus = (projectId: number) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ taskId, status, task }: { taskId: number; status: 'todo' | 'in_progress' | 'completed'; task: Task }) => 
      taskService.updateTask(projectId, taskId, {
        title: task.title,
        description: task.description,
        status
      }),
    onSuccess: (response) => {
      // Optimistic update
      queryClient.setQueryData(['tasks', projectId], (old: TasksResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.map(task => 
            task.id === response.task.id ? response.task : task
          )
        };
      });
      
      enqueueSnackbar(`Task status updated to "${response.task.status.replace('_', ' ')}"`, { 
        variant: 'success' 
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to update task status';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });
}; 
