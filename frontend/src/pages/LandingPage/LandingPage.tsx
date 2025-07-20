import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuthStore } from '../../stores/authStore';
import { ROUTES } from '../../routes/routes';
import './LandingPage.css';

const LandingPage = (): React.ReactElement => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="landing-container">
      <Header />

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Manage Projects Like a <span className="highlight">Pro</span>
          </h1>
          <p className="hero-description">
            Streamline your workflow, collaborate with your team, and deliver projects on time. 
            Our powerful project management platform helps teams stay organized and productive.
          </p>
          <div className="hero-buttons">
            <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.REGISTER}>
              <Button variant="primary" size="large">
                {isAuthenticated ? 'Go to Dashboard' : 'Start your project now'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-content">
          <h2 className="features-title">Everything you need to succeed</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">📊</div>
              <h3>Project Tracking</h3>
              <p>Keep track of all your projects in one centralized dashboard with real-time updates.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📈</div>
              <h3>Progress Analytics</h3>
              <p>Monitor project progress with detailed analytics and performance insights.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage; 
