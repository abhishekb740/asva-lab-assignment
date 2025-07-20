import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import TaskForm from '../../components/forms/TaskForm';
import TaskTable from '../../components/tables/TaskTable';
import { useProjects } from '../../hooks/useProjects';
import { 
  useTasks, 
  useCreateTask, 
  useUpdateTask, 
  useDeleteTask, 
  useUpdateTaskStatus 
} from '../../hooks/useTasks';
import { useAuthStore } from '../../stores/authStore';
import { 
  type Task, 
  type TaskStatus, 
  type CreateTaskRequest, 
  type UpdateTaskRequest,
  TASK_STATUS_LABELS 
} from '../../types/task';
import { ROUTES } from '../../routes/routes';
import './TasksPage.css';

const TasksPage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id || '0');
  const { user } = useAuthStore();

  // State for task form
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // State for filtering and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  // Fetch data
  const { data: projectsData } = useProjects();
  const { data: tasksData, isLoading: isTasksLoading } = useTasks(projectId);
  const createTaskMutation = useCreateTask(projectId);
  const updateTaskMutation = useUpdateTask(projectId);
  const deleteTaskMutation = useDeleteTask(projectId);
  const updateStatusMutation = useUpdateTaskStatus(projectId);

  // Find current project
  const currentProject = projectsData?.projects.find(p => p.id === projectId);

  // Filter tasks based on search and status
  const filteredTasks = React.useMemo(() => {
    if (!tasksData?.tasks) return [];

    return tasksData.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [tasksData?.tasks, searchTerm, statusFilter]);

  // Task counts for stats
  const taskCounts = React.useMemo(() => {
    if (!tasksData?.tasks) return { todo: 0, in_progress: 0, completed: 0, total: 0 };

    return tasksData.tasks.reduce((acc, task) => {
      acc[task.status]++;
      acc.total++;
      return acc;
    }, { todo: 0, in_progress: 0, completed: 0, total: 0 });
  }, [tasksData?.tasks]);

  // Check if user can manage tasks
  const canManageTasks = user && (user.role === 'admin' || currentProject?.user_id === user.id);

  // Handle task form submission
  const handleTaskSubmit = async (data: CreateTaskRequest | UpdateTaskRequest) => {
    try {
      if (editingTask) {
        await updateTaskMutation.mutateAsync({ 
          taskId: editingTask.id, 
          data: data as UpdateTaskRequest 
        });
      } else {
        await createTaskMutation.mutateAsync(data as CreateTaskRequest);
      }
      
      setIsTaskFormOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  // Handle task edit
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  // Handle task delete
  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTaskMutation.mutateAsync(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  // Handle status change
  const handleStatusChange = async (taskId: number, status: TaskStatus, task: Task) => {
    try {
      await updateStatusMutation.mutateAsync({ taskId, status, task });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Handle create new task
  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  // Handle close form
  const handleCloseForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  if (!currentProject) {
    return (
      <Layout>
        <div className="tasks-page">
          <div className="tasks-not-found">
            <h1>Project not found</h1>
            <p>The project you're looking for doesn't exist or you don't have access to it.</p>
            <Link to={ROUTES.PROJECTS}>
              <Button variant="primary">Back to Projects</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="tasks-page">
        {/* Header */}
        <div className="tasks-header">
          <div className="tasks-breadcrumb">
            <Link to={ROUTES.PROJECTS} className="breadcrumb-link">Projects</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{currentProject.name}</span>
          </div>
          
          <div className="tasks-title-section">
            <h1 className="tasks-title">Tasks</h1>
            <p className="tasks-subtitle">Manage tasks for {currentProject.name}</p>
          </div>

          {canManageTasks && (
            <Button
              variant="primary"
              onClick={handleCreateTask}
              className="create-task-btn"
            >
              New Task
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="tasks-stats">
          <div className="stat-card">
            <div className="stat-number">{taskCounts.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{taskCounts.todo}</div>
            <div className="stat-label">To Do</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{taskCounts.in_progress}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{taskCounts.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {/* Filters */}
        <div className="tasks-filters">
          <div className="search-container">
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="tasks-search"
            />
          </div>
          
          <div className="filter-container">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
              className="status-filter"
            >
              <option value="all">All Status</option>
              {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="tasks-content">
          <TaskTable
            tasks={filteredTasks}
            isLoading={isTasksLoading}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            projectOwnerId={currentProject.user_id}
          />
        </div>

        {/* Task Form Modal */}
        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleTaskSubmit}
          isLoading={createTaskMutation.isPending || updateTaskMutation.isPending}
          title={editingTask ? 'Edit Task' : 'Create New Task'}
          initialData={editingTask ? {
            title: editingTask.title,
            description: editingTask.description,
            status: editingTask.status
          } : undefined}
        />
      </div>
    </Layout>
  );
};

export default TasksPage; 
