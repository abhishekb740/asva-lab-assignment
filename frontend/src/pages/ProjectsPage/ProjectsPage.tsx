import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button/Button';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../../hooks/useProjects';
import { useAuthStore } from '../../stores/authStore';
import ProjectForm from '../../components/forms/ProjectForm';
import ProjectTable from '../../components/tables/ProjectTable';
import { type Project } from '../../types/project';
import './ProjectsPage.css';
import Input from '../../components/common/Input/Input';

const ProjectsPage = (): React.ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthStore();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: projectsData, isLoading, error, refetch } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const projects = projectsData?.projects || [];
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle query parameter for create mode
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setIsCreateModalOpen(true);
      // Remove the query parameter
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleCreateProject = async (data: { name: string; description?: string }) => {
    try {
      await createProject.mutateAsync(data);
      enqueueSnackbar('Project created successfully!', { variant: 'success' });
      setIsCreateModalOpen(false);
      refetch();
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.error || 'Failed to create project', { 
        variant: 'error' 
      });
    }
  };

  const handleUpdateProject = async (data: { name: string; description?: string }) => {
    if (!editingProject) return;
    
    try {
      await updateProject.mutateAsync({ id: editingProject.id, data });
      enqueueSnackbar('Project updated successfully!', { variant: 'success' });
      setEditingProject(null);
      refetch();
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.error || 'Failed to update project', { 
        variant: 'error' 
      });
    }
  };

  // Handle delete project
  const handleDeleteProject = async (projectId: number) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject.mutateAsync(projectId);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  // Handle view project - removed since we're using direct navigation now
  // const handleViewProject = (project: Project) => {
  //   // Navigation now handled by Link in ProjectTable
  // };

  if (error) {
    return (
      <Layout>
        <div className="projects-page">
          <div className="projects-error">
            <div className="error-content">
              <h2>Unable to load projects</h2>
              <p>There was an error loading your projects. Please try again.</p>
              <Button 
                variant="primary" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="projects-page">
        <div className="projects-container">
          {/* Header */}
          <div className="projects-header">
            <div className="projects-title-section">
              <h1>Projects</h1>
              <p>Manage your projects and collaborate with your team</p>
            </div>
            <div className="projects-actions">
              <Button 
                variant="primary" 
                onClick={() => setIsCreateModalOpen(true)}
              >
                New Project
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="projects-controls">
            <div className="search-container">
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="projects-search"
              />
            </div>
            
            <div className="projects-stats">
              <span className="stats-item">
                {filteredProjects.length} of {projects.length} projects
              </span>
              {user?.role === 'admin' && (
                <span className="stats-item admin-badge">
                  Admin View - All Projects
                </span>
              )}
            </div>
          </div>

          {/* Projects Content */}
          {isLoading ? (
            <div className="projects-loading">
              <div className="loading-spinner"></div>
              <p>Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="projects-empty">
              {searchTerm ? (
                <>
                  <div className="empty-icon">🔍</div>
                  <h3>No projects found</h3>
                  <p>No projects match your search "{searchTerm}"</p>
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    Clear Search
                  </Button>
                </>
              ) : (
                <>
                  <div className="empty-icon">📋</div>
                  <h3>No projects yet</h3>
                  <p>Create your first project to get started with project management.</p>
                  <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                    Create Project
                  </Button>
                </>
              )}
            </div>
          ) : (
            <ProjectTable
              projects={filteredProjects}
              isLoading={false}
              onEdit={setEditingProject}
              onDelete={handleDeleteProject}
            />
          )}

          {/* Create Project Modal */}
          {isCreateModalOpen && (
            <ProjectForm
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onSubmit={handleCreateProject}
              isLoading={createProject.isPending}
              title="Create New Project"
            />
          )}

          {/* Edit Project Modal */}
          {editingProject && (
            <ProjectForm
              isOpen={!!editingProject}
              onClose={() => setEditingProject(null)}
              onSubmit={handleUpdateProject}
              isLoading={updateProject.isPending}
              title="Edit Project"
              initialData={{
                name: editingProject.name,
                description: editingProject.description || ''
              }}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectsPage; 
