import { type PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { ROUTES } from './routes';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false 
}: PropsWithChildren<ProtectedRouteProps>) => {
  const { isAuthenticated, isAdmin } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGNIN} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 
