import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button/Button';
import { useAuthStore } from '../../stores/authStore';
import { type Project } from '../../types/project';
import './ProjectTable.css';

interface ProjectTableProps {
  projects: Project[];
  isLoading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuthStore();

  // Check if user can modify project (admin or project owner)
  const canModifyProject = (project: Project): boolean => {
    if (!user) return false;
    return user.role === 'admin' || project.user_id === user.id;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="project-table-loading">
        <div className="loading-spinner"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="project-table-empty">
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>No projects yet</h3>
          <p>Create your first project to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="project-table-container">
      <div className="project-table-wrapper">
        <table className="project-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Description</th>
              <th>Owner</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="project-row">
                <td>
                  <div className="project-name">
                    <span className="project-name-text">{project.name}</span>
                  </div>
                </td>
                <td>
                  <div className="project-description">
                    {project.description ? (
                      <span className="project-description-text">
                        {project.description.length > 100 
                          ? `${project.description.substring(0, 100)}...` 
                          : project.description}
                      </span>
                    ) : (
                      <span className="project-description-empty">No description</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="project-owner">
                    {user?.role === 'admin' && project.user_id !== user.id && (
                      <span className="project-owner-id">
                        User ID: {project.user_id}
                      </span>
                    )}
                    {project.user_id === user?.id && (
                      <span className="project-owner-you">You</span>
                    )}
                    {user?.role !== 'admin' && project.user_id !== user?.id && (
                      <span className="project-owner-other">Other user</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className="project-date">{formatDate(project.created_at)}</span>
                </td>
                <td>
                  <div className="project-actions">
                    <Link 
                      to={`/projects/${project.id}/tasks`}
                      className="project-action-link"
                    >
                      <Button
                        variant="outline"
                        size="small"
                        className="project-action-btn"
                      >
                        View Tasks
                      </Button>
                    </Link>
                    
                    {canModifyProject(project) && (
                      <>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => onEdit(project)}
                          className="project-action-btn"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => onDelete(project.id)}
                          className="project-action-btn project-delete-btn"
                        >
                          Delete
                        </Button>
                      </>
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

export default ProjectTable; 
