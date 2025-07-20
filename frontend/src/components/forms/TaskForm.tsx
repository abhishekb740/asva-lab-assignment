import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import { TASK_STATUS_LABELS, type TaskStatus } from '../../types/task';
import './TaskForm.css';

interface TaskFormData {
  title: string;
  description?: string;
  status: TaskStatus;
}

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  isLoading: boolean;
  title: string;
  initialData?: Partial<TaskFormData>;
}

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  title,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<TaskFormData>({
    defaultValues: initialData || { title: '', description: '', status: 'todo' },
  });

  const validateForm = (data: TaskFormData): boolean => {
    clearErrors();
    let isValid = true;

    // Validate title (matches backend: min 1, max 255, required)
    if (!data.title || data.title.trim().length === 0) {
      setError('title', { message: 'Task title is required' });
      isValid = false;
    } else if (data.title.trim().length > 255) {
      setError('title', { message: 'Task title must be less than 255 characters' });
      isValid = false;
    }

    // Validate description (matches backend: max 1000, optional)
    if (data.description && data.description.length > 1000) {
      setError('description', { message: 'Description must be less than 1000 characters' });
      isValid = false;
    }

    return isValid;
  };

  const handleFormSubmit = async (data: TaskFormData) => {
    if (!validateForm(data)) {
      return;
    }

    await onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Reset form when initialData changes (for edit mode)
  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="task-form-overlay">
      <div className="task-form-modal">
        <div className="task-form-header">
          <h2>{title}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="task-form-close"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="task-form">
          <Input
            label="Task Title"
            type="text"
            placeholder="Enter task title"
            {...register('title')}
            error={errors.title?.message}
            required
            disabled={isLoading}
          />

          <div className="textarea-container">
            <label htmlFor="task-description" className="textarea-label">
              Description <span className="optional">(optional)</span>
            </label>
            <textarea
              id="task-description"
              placeholder="Enter task description"
              {...register('description')}
              className={`textarea ${errors.description ? 'textarea-error' : ''}`}
              rows={4}
              disabled={isLoading}
            />
            {errors.description && (
              <span className="textarea-error-message">{errors.description.message}</span>
            )}
          </div>

          <div className="select-container">
            <label htmlFor="task-status" className="select-label">
              Status
            </label>
            <select
              id="task-status"
              {...register('status')}
              className="select"
              disabled={isLoading}
            >
              {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="task-form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (initialData ? 'Update Task' : 'Create Task')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm; 
