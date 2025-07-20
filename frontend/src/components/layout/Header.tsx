import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Button from '../common/Button/Button';
import { ROUTES } from '../../routes/routes';
import { useAuthStore } from '../../stores/authStore';
import './Header.css';

const Header = (): React.ReactElement => {
  const { user, isAuthenticated, signOut } = useAuthStore();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    enqueueSnackbar('Signed out successfully. See you soon!', { 
      variant: 'info',
      autoHideDuration: 3000 
    });
    navigate(ROUTES.HOME);
  };

  return (
    <nav className="header">
      <div className="header-content">
        <Link to={ROUTES.HOME} className="header-logo">
          <h2>AsvaLab Assignment (Project Management Tool)</h2>
        </Link>
        
        <div className="header-nav">
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.DASHBOARD} className="header-nav-link">
                Dashboard
              </Link>
              <div className="header-user">
                <span className="header-user-info">
                  {user?.email} ({user?.role})
                </span>
                <Button variant="outline" size="medium" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <div className="header-buttons">
              <Link to={ROUTES.SIGNIN}>
                <Button variant="outline" size="medium">Sign In</Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button variant="primary" size="medium">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header; 
