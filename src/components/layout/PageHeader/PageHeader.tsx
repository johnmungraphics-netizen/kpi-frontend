/**
 * Page Header Component
 * 
 * Consistent header for all pages with title, breadcrumbs, and actions.
 * To be implemented in Phase 2.
 */

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; path?: string }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  breadcrumbs
}) => {
  // TODO: Implement page header
  return (
    <div className="page-header">
      {breadcrumbs && (
        <nav className="breadcrumbs">
          {/* Breadcrumb implementation */}
        </nav>
      )}
      <div className="page-header-content">
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
