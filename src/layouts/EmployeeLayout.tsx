/**
 * Employee Layout
 * 
 * Layout specific to employee pages.
 * To be implemented in Phase 2.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';

// FIXED: Remove children prop, use Outlet from react-router-dom
export const EmployeeLayout: React.FC = () => {
  return (
    <div className="employee-layout">
      <Outlet />
    </div>
  );
};

export default EmployeeLayout;
