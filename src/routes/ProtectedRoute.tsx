/**
 * Protected Route Component
 * 
 * HOC for protecting routes that require authentication.
 * To be migrated from App.tsx in Phase 3.
 */

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('🛡️ [ProtectedRoute] Rendering route:', {
      pathname: location.pathname,
      allowedRoles: allowedRoles,
      timestamp: new Date().toISOString()
    });
  }, [location.pathname, allowedRoles]);
  
  // TODO: Implement protected route logic
  console.log('✅ [ProtectedRoute] Rendering children for:', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
