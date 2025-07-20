import React from 'react';
import './Footer.css';

const Footer = (): React.ReactElement => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h3>AsvaLab Assignment (Project Management Tool)</h3>
          <p>Professional project management made simple.</p>
        </div>
        <div className="footer-links">
          <p>&copy; 2025 AsvaLab Assignment. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
