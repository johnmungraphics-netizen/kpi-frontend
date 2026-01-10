/**
 * Footer Component
 * 
 * Application footer for layout.
 * To be implemented in Phase 2.
 */

import React from 'react';

export const Footer: React.FC = () => {
  // TODO: Implement footer
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} KPI Management System</p>
    </footer>
  );
};

export default Footer;
