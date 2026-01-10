/**
 * HR Layout
 * 
 * Layout specific to HR pages.
 * To be implemented in Phase 2.
 */

import React from 'react';

interface HRLayoutProps {
  children: React.ReactNode;
}

export const HRLayout: React.FC<HRLayoutProps> = ({ children }) => {
  // TODO: Implement HR-specific layout
  return (
    <div className="hr-layout">
      {children}
    </div>
  );
};

export default HRLayout;
