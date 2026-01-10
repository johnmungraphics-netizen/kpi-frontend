/**
 * Auth Layout
 * 
 * Layout for authentication pages (login, register, etc.)
 * To be implemented in Phase 2.
 */

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  // TODO: Implement auth layout with centered content
  return (
    <div className="auth-layout">
      <div className="auth-container">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
