import React, { type PropsWithChildren } from 'react';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

interface LayoutProps {
  showFooter?: boolean;
}

const Layout = ({ children, showFooter = true }: PropsWithChildren<LayoutProps>) => {
  return (
    <div className="layout">
      <Header />
      <main className="layout-main">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout; 
