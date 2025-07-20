import React from 'react';
import Button from '../common/Button/Button';
import { useAuthStore } from '../../stores/authStore';
import { 
  type Task, 
  type TaskStatus, 
  TASK_STATUS_LABELS, 
  TASK_STATUS_COLORS 
} from '../../types/task';
import './TaskTable.css';

interface TaskTableProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onStatusChange: (taskId: number, status: TaskStatus, task: Task) => void;
  projectOwnerId?: number;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
  projectOwnerId,
}) => {
  const { user } = useAuthStore();

  // Check if user can modify tasks (admin or project owner)
  const canModifyTask = (task: Task): boolean => {
    if (!user) return false;
    return user.role === 'admin' || projectOwnerId === user.id;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: TaskStatus) => {
    return (
      <span 
        className={`task-status-badge task-status-${status}`}
        style={{ 
          backgroundColor: `${TASK_STATUS_COLORS[status]}20`,
          color: TASK_STATUS_COLORS[status],
          border: `1px solid ${TASK_STATUS_COLORS[status]}40`
        }}
      >
        {TASK_STATUS_LABELS[status]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="task-table-loading">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-table-empty">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No tasks yet</h3>
          <p>Create your first task to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-table-container">
      <div className="task-table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="task-row">
                <td>
                  <div className="task-title">
                    <span className="task-title-text">{task.title}</span>
                  </div>
                </td>
                <td>
                  <div className="task-description">
                    {task.description ? (
                      <span className="task-description-text">
                        {task.description.length > 100 
                          ? `${task.description.substring(0, 100)}...` 
                          : task.description}
                      </span>
                    ) : (
                      <span className="task-description-empty">No description</span>
                    )}
                  </div>
                </td>
                <td>
                  {canModifyTask(task) ? (
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus, task)}
                      className="task-status-select"
                      style={{ borderColor: TASK_STATUS_COLORS[task.status] }}
                    >
                      {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    getStatusBadge(task.status)
                  )}
                </td>
                <td>
                  <span className="task-date">{formatDate(task.created_at)}</span>
                </td>
                <td>
                  <div className="task-actions">
                    {canModifyTask(task) && (
                      <>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => onEdit(task)}
                          className="task-action-btn"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => onDelete(task.id)}
                          className="task-action-btn task-delete-btn"
                        >
                          Delete
                        </Button>
                      </>
                    )}
                    {!canModifyTask(task) && (
                      <span className="task-no-access">View only</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
