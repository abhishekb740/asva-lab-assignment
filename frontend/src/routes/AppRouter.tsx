import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { ROUTES } from './routes';
import ProtectedRoute from './ProtectedRoute';

import LandingPage from '../pages/LandingPage/LandingPage';
import SignInPage from '../pages/SignInPage/SignInPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import ProjectsPage from '../pages/ProjectsPage/ProjectsPage';
import TasksPage from '../pages/TasksPage/TasksPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRouter = (): React.ReactElement => {
  const { initializeAuth } = useAuthStore();
  
  // Initialize auth state from localStorage on app start
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path={ROUTES.HOME} element={<LandingPage />} />
          <Route path={ROUTES.SIGNIN} element={<SignInPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          
          <Route 
            path={ROUTES.DASHBOARD} 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path={ROUTES.PROJECTS} 
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path={ROUTES.PROJECT_TASKS} 
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default AppRouter; 
