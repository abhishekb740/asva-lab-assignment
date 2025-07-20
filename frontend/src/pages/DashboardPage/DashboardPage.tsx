import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button/Button';
import { useProjects } from '../../hooks/useProjects';
import { useAuthStore } from '../../stores/authStore';
import { ROUTES } from '../../routes/routes';
import './DashboardPage.css';

const DashboardPage = (): React.ReactElement => {
  const { user } = useAuthStore();
  const { data: projectsData, isLoading, error } = useProjects();

  const projects = projectsData?.projects || [];
  const projectCount = projects.length;
  
  // Calculate stats
  const recentProjects = projects.slice(0, 5);
  const userRole = user?.role || 'user';

  return (
    <Layout>
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <div className="dashboard-welcome">
              <h1>Welcome back, {user?.email}!</h1>
              <p>Here's what's happening with your projects today.</p>
            </div>
            <div className="dashboard-actions">
              <Link to={ROUTES.PROJECTS}>
                <Button variant="outline" size="medium">View All Projects</Button>
              </Link>
              <Link to={`${ROUTES.PROJECTS}?create=true`}>
                <Button variant="primary" size="medium">New Project</Button>
              </Link>
            </div>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>{projectCount}</h3>
                <p>{userRole === 'admin' ? 'Total Projects' : 'Your Projects'}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👤</div>
              <div className="stat-content">
                <h3>{userRole}</h3>
                <p>Account Type</p>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Projects</h2>
              <Link to={ROUTES.PROJECTS} className="section-link">
                View all →
              </Link>
            </div>
            
            {isLoading ? (
              <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading projects...</p>
              </div>
            ) : error ? (
              <div className="dashboard-error">
                <p>Failed to load projects. Please try again.</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Reload
                </Button>
              </div>
            ) : projects.length === 0 ? (
              <div className="dashboard-empty">
                <div className="empty-icon">📋</div>
                <h3>No projects yet</h3>
                <p>Create your first project to get started with project management.</p>
                <Link to={`${ROUTES.PROJECTS}?create=true`}>
                  <Button variant="primary" size="medium">Create Project</Button>
                </Link>
              </div>
            ) : (
              <div className="projects-grid">
                {recentProjects.map((project) => (
                  <div key={project.id} className="project-card">
                    <div className="project-header">
                      <h3>{project.name}</h3>
                      <span className="project-date">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="project-description">
                      {project.description || 'No description provided'}
                    </p>
                    <div className="project-actions">
                      <Link to={`/projects/${project.id}/tasks`}>
                        <Button variant="outline" size="small">View Details</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <Link to={`${ROUTES.PROJECTS}?create=true`} className="quick-action">
                <div className="quick-action-icon">➕</div>
                <div className="quick-action-content">
                  <h4>New Project</h4>
                  <p>Start a new project and organize your tasks</p>
                </div>
              </Link>
              <Link to={ROUTES.PROJECTS} className="quick-action">
                <div className="quick-action-icon">📋</div>
                <div className="quick-action-content">
                  <h4>Browse Projects</h4>
                  <p>View and manage all your projects</p>
                </div>
              </Link>
              {userRole === 'admin' && (
                <div className="quick-action">
                  <div className="quick-action-icon">👑</div>
                  <div className="quick-action-content">
                    <h4>Admin Access</h4>
                    <p>You can view and edit all projects</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage; 
