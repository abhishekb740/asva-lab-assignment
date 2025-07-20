import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import './ProjectForm.css';

const projectSchema = yup.object({
  name: yup
    .string()
    .min(1, 'Project name is required')
    .max(255, 'Project name must be less than 255 characters')
    .required('Project name is required')
});

interface ProjectFormData {
  name: string;
  description?: string;
}

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  isLoading: boolean;
  title: string;
  initialData?: Partial<ProjectFormData>;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
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
  } = useForm<ProjectFormData>({
    resolver: yupResolver(projectSchema),
    defaultValues: initialData || { name: '', description: '' },
  });

  const handleFormSubmit = async (data: ProjectFormData) => {
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
    <div className="project-form-overlay">
      <div className="project-form-modal">
        <div className="project-form-header">
          <h2>{title}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="project-form-close"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="project-form">
          <Input
            label="Project Name"
            type="text"
            placeholder="Enter project name"
            {...register('name')}
            error={errors.name?.message}
            required
            disabled={isLoading}
          />

          <div className="textarea-container">
            <label htmlFor="description" className="textarea-label">
              Description <span className="optional">(optional)</span>
            </label>
            <textarea
              id="description"
              placeholder="Enter project description"
              {...register('description')}
              className={`textarea ${errors.description ? 'textarea-error' : ''}`}
              rows={4}
              disabled={isLoading}
            />
            {errors.description && (
              <span className="textarea-error-message">{errors.description.message}</span>
            )}
          </div>

          <div className="project-form-actions">
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
              {isLoading ? 'Saving...' : (initialData ? 'Update Project' : 'Create Project')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm; 
