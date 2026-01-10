# React + Redux Frontend File Structure (Standard Architecture)

## Overview
This document defines the standard file structure for the KPI Management System frontend using React 18, TypeScript, Redux Toolkit, and feature-based architecture.

## Core Principles
1. **Feature-Based Organization**: Each domain (auth, hr, employee, manager, superadmin, shared) is self-contained
2. **Colocation**: Keep related files close together (components, hooks, types, utils within each feature)
3. **Separation of Concerns**: Clear separation between features, shared components, and global state
4. **Scalability**: Easy to add new features without affecting existing ones
5. **DRY**: Shared code lives in dedicated folders (components/common, hooks, utils)

---

## Recommended File Structure

```
src/
├── app/                                    # App-level configuration
│   ├── store.ts                           # Redux store configuration
│   └── rootReducer.ts                     # (Optional) Root reducer combiner
│
├── assets/                                 # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── components/                             # Global shared components
│   ├── common/                            # Reusable UI components
│   │   ├── Button/
│   │   │   ├── index.ts                  # Export barrel
│   │   │   ├── Button.tsx                # Component
│   │   │   ├── Button.test.tsx           # Tests (optional)
│   │   │   └── Button.module.css         # Styles (if not using Tailwind)
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Table/
│   │   ├── Toast/
│   │   ├── LoadingSpinner/
│   │   ├── ConfirmDialog/
│   │   └── index.ts                      # Export all common components
│   │
│   ├── layout/                            # Layout components
│   │   ├── Header/
│   │   │   ├── index.ts
│   │   │   └── Header.tsx
│   │   ├── Sidebar/
│   │   │   ├── index.ts
│   │   │   └── Sidebar.tsx
│   │   ├── Footer/
│   │   ├── PageContainer/
│   │   └── index.ts
│   │
│   └── forms/                             # Reusable form components
│       ├── DatePicker/
│       ├── FormField/
│       ├── SelectDropdown/
│       └── index.ts
│
├── features/                               # Feature modules (MAIN ORGANIZATION)
│   │
│   ├── auth/                              # Authentication feature
│   │   ├── components/                    # Auth-specific components
│   │   │   ├── LoginForm/
│   │   │   │   ├── index.ts
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── CompanySelector/
│   │   │   └── index.ts
│   │   ├── hooks/                         # Auth-specific hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useLogin.ts
│   │   │   └── index.ts
│   │   ├── services/                      # Auth API services
│   │   │   ├── authService.ts
│   │   │   └── index.ts
│   │   ├── slices/                        # Auth Redux slice
│   │   │   ├── authSlice.ts
│   │   │   └── index.ts
│   │   ├── types/                         # Auth TypeScript types
│   │   │   ├── auth.types.ts
│   │   │   └── index.ts
│   │   ├── utils/                         # Auth utilities
│   │   │   ├── tokenHelpers.ts
│   │   │   ├── validators.ts
│   │   │   └── index.ts
│   │   ├── pages/                         # Auth pages (if complex)
│   │   │   ├── LoginPage.tsx
│   │   │   └── index.ts
│   │   ├── index.ts                       # Export public API
│   │   └── Login.tsx                      # Main login page (if simple)
│   │
│   ├── hr/                                # HR feature
│   │   ├── components/                    # HR-specific components
│   │   │   ├── DepartmentCard/
│   │   │   ├── EmployeeTable/
│   │   │   ├── SettingsForm/
│   │   │   ├── StatisticsChart/
│   │   │   └── index.ts
│   │   ├── hooks/                         # HR-specific hooks
│   │   │   ├── useHRDashboard.ts
│   │   │   ├── useDepartments.ts
│   │   │   ├── useSettings.ts
│   │   │   └── index.ts
│   │   ├── services/                      # HR API services
│   │   │   ├── hrService.ts
│   │   │   ├── departmentService.ts
│   │   │   └── index.ts
│   │   ├── slices/                        # HR Redux slices
│   │   │   ├── hrSlice.ts                # (if needed)
│   │   │   └── index.ts
│   │   ├── types/                         # HR TypeScript types
│   │   │   ├── hr.types.ts
│   │   │   └── index.ts
│   │   ├── utils/                         # HR utilities
│   │   │   ├── calculators.ts
│   │   │   └── index.ts
│   │   ├── pages/                         # HR pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── KPIList.tsx
│   │   │   ├── KPIDetails.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── DepartmentDashboard.tsx
│   │   │   ├── EmailTemplates.tsx
│   │   │   ├── RejectedKPIManagement.tsx
│   │   │   ├── EmployeePerformance.tsx
│   │   │   └── index.ts
│   │   └── index.ts                       # Export public HR API
│   │
│   ├── manager/                           # Manager feature
│   │   ├── components/                    # Manager-specific components
│   │   │   ├── KPITemplateCard/
│   │   │   ├── EmployeeSelector/
│   │   │   ├── ReviewForm/
│   │   │   └── index.ts
│   │   ├── hooks/                         # Manager-specific hooks
│   │   │   ├── useManagerDashboard.ts
│   │   │   ├── useKPITemplates.ts
│   │   │   └── index.ts
│   │   ├── services/                      # Manager API services
│   │   │   ├── managerService.ts
│   │   │   ├── kpiTemplateService.ts
│   │   │   └── index.ts
│   │   ├── slices/                        # Manager Redux slices
│   │   │   ├── managerSlice.ts           # (if needed)
│   │   │   └── index.ts
│   │   ├── types/                         # Manager TypeScript types
│   │   │   ├── manager.types.ts
│   │   │   └── index.ts
│   │   ├── utils/                         # Manager utilities
│   │   │   └── index.ts
│   │   ├── pages/                         # Manager pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── KPISetting.tsx
│   │   │   ├── KPIReview.tsx
│   │   │   ├── EmployeeSelection.tsx
│   │   │   ├── ReviewsList.tsx
│   │   │   ├── KPIList.tsx
│   │   │   ├── KPIDetails.tsx
│   │   │   ├── EmployeeKPIs.tsx
│   │   │   ├── KPITemplates.tsx
│   │   │   ├── KPITemplateForm.tsx
│   │   │   ├── ApplyKPITemplate.tsx
│   │   │   ├── MeetingScheduler.tsx
│   │   │   └── index.ts
│   │   └── index.ts                       # Export public Manager API
│   │
│   ├── employee/                          # Employee feature
│   │   ├── components/                    # Employee-specific components
│   │   │   ├── KPICard/
│   │   │   ├── RatingForm/
│   │   │   ├── AcknowledgementForm/
│   │   │   └── index.ts
│   │   ├── hooks/                         # Employee-specific hooks
│   │   │   ├── useEmployeeDashboard.ts
│   │   │   ├── useKPIAcknowledgement.ts
│   │   │   └── index.ts
│   │   ├── services/                      # Employee API services
│   │   │   ├── employeeService.ts
│   │   │   └── index.ts
│   │   ├── slices/                        # Employee Redux slices
│   │   │   ├── employeeSlice.ts          # (if needed)
│   │   │   └── index.ts
│   │   ├── types/                         # Employee TypeScript types
│   │   │   ├── employee.types.ts
│   │   │   └── index.ts
│   │   ├── utils/                         # Employee utilities
│   │   │   └── index.ts
│   │   ├── pages/                         # Employee pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── KPIAcknowledgement.tsx
│   │   │   ├── KPIConfirmation.tsx
│   │   │   ├── SelfRating.tsx
│   │   │   ├── KPIList.tsx
│   │   │   ├── KPIDetails.tsx
│   │   │   ├── Acknowledge.tsx
│   │   │   ├── Reviews.tsx
│   │   │   └── index.ts
│   │   └── index.ts                       # Export public Employee API
│   │
│   ├── superadmin/                        # Super Admin feature
│   │   ├── components/                    # Super Admin components
│   │   │   ├── CompanyCard/
│   │   │   ├── UserTable/
│   │   │   └── index.ts
│   │   ├── hooks/                         # Super Admin hooks
│   │   │   ├── useCompanyManagement.ts
│   │   │   └── index.ts
│   │   ├── services/                      # Super Admin API services
│   │   │   ├── superAdminService.ts
│   │   │   └── index.ts
│   │   ├── slices/                        # Super Admin Redux slices
│   │   │   ├── superAdminSlice.ts        # (if needed)
│   │   │   └── index.ts
│   │   ├── types/                         # Super Admin TypeScript types
│   │   │   ├── superAdmin.types.ts
│   │   │   └── index.ts
│   │   ├── utils/                         # Super Admin utilities
│   │   │   └── index.ts
│   │   ├── pages/                         # Super Admin pages
│   │   │   ├── SuperAdminDashboard.tsx
│   │   │   ├── CompanySelection.tsx
│   │   │   ├── CompanyOnboarding.tsx
│   │   │   ├── CompanyManagement.tsx
│   │   │   ├── UserManagement.tsx
│   │   │   ├── AssignHrToCompany.tsx
│   │   │   └── index.ts
│   │   └── index.ts                       # Export public Super Admin API
│   │
│   └── shared/                            # Shared cross-feature functionality
│       ├── components/                    # Components used by multiple features
│       │   ├── ProfileCard/
│       │   ├── NotificationBell/
│       │   └── index.ts
│       ├── hooks/                         # Shared hooks
│       │   ├── useNotifications.ts
│       │   └── index.ts
│       ├── services/                      # Shared API services
│       │   ├── notificationService.ts
│       │   └── index.ts
│       ├── slices/                        # Shared Redux slices (NOT recommended - use store/slices)
│       │   └── index.ts
│       ├── types/                         # Shared types
│       │   ├── shared.types.ts
│       │   └── index.ts
│       ├── utils/                         # Shared utilities
│       │   └── index.ts
│       ├── pages/                         # Shared pages
│       │   ├── Employees.tsx             # Used by HR and Manager
│       │   ├── Notifications.tsx
│       │   ├── EditProfile.tsx
│       │   ├── Profile.tsx
│       │   ├── AcknowledgedKPIs.tsx
│       │   ├── KPISettingCompleted.tsx
│       │   ├── CompletedReviews.tsx
│       │   └── index.ts
│       └── index.ts                       # Export shared public API
│
├── hooks/                                  # Global custom hooks
│   ├── useApi.ts
│   ├── useAuth.ts                         # (Or import from features/auth)
│   ├── useConfirm.ts
│   ├── useDebounce.ts
│   ├── useForm.ts
│   ├── useLoading.ts
│   ├── useModal.ts
│   ├── useNotification.ts
│   ├── usePagination.ts
│   └── index.ts                           # Export all hooks
│
├── layouts/                                # Layout wrappers
│   ├── AuthLayout.tsx                     # Layout for auth pages
│   ├── DashboardLayout.tsx                # Base dashboard layout
│   ├── HRLayout.tsx                       # HR-specific layout
│   ├── ManagerLayout.tsx                  # Manager-specific layout
│   ├── EmployeeLayout.tsx                 # Employee-specific layout
│   └── index.ts
│
├── routes/                                 # Routing configuration
│   ├── index.tsx                          # Main route definitions
│   ├── ProtectedRoute.tsx                 # Auth guard component
│   ├── hrRoutes.tsx                       # HR route configuration
│   ├── managerRoutes.tsx                  # Manager route configuration
│   ├── employeeRoutes.tsx                 # Employee route configuration
│   └── publicRoutes.tsx                   # Public routes (optional)
│
├── services/                               # Global API services
│   ├── api.ts                             # Axios instance & interceptors
│   ├── apiClient.ts                       # (Optional) API client wrapper
│   └── index.ts
│
├── store/                                  # Redux store (CENTRALIZED)
│   ├── hooks.ts                           # Typed Redux hooks (useAppDispatch, useAppSelector)
│   ├── index.ts                           # Export store and types
│   ├── slices/                            # All Redux slices (centralized)
│   │   ├── authSlice.ts                  # Auth state
│   │   ├── kpiSlice.ts                   # KPI data
│   │   ├── employeeSlice.ts              # Employee management
│   │   ├── departmentSlice.ts            # Department data
│   │   ├── settingsSlice.ts              # App settings
│   │   ├── statisticsSlice.ts            # Dashboard statistics
│   │   ├── notificationSlice.ts          # Notifications
│   │   ├── uiSlice.ts                    # UI state (modals, toasts, etc.)
│   │   └── index.ts                      # Export all slices
│   └── middleware/                        # Custom Redux middleware (optional)
│       └── logger.ts
│
├── types/                                  # Global TypeScript types
│   ├── index.ts                           # Aggregate all types
│   ├── api.types.ts                       # API request/response types
│   ├── common.types.ts                    # Common shared types
│   └── react-signature-canvas.d.ts        # Third-party type declarations
│
├── utils/                                  # Global utility functions
│   ├── constants.ts                       # App constants
│   ├── dateHelpers.ts                     # Date utilities
│   ├── formatters.ts                      # Format functions
│   ├── validators.ts                      # Validation functions
│   ├── storageHelpers.ts                  # localStorage/sessionStorage helpers
│   ├── errorHandlers.ts                   # Error handling utilities
│   └── index.ts                           # Export all utils
│
├── styles/                                 # Global styles (optional if using Tailwind)
│   ├── globals.css
│   ├── variables.css
│   └── themes/
│
├── App.tsx                                 # Root App component
├── main.tsx                                # Entry point
├── index.css                               # Global CSS
├── App.css                                 # App-specific CSS
└── vite-env.d.ts                          # Vite type declarations

```

---

## Key Architectural Decisions

### 1. **Feature-Based vs. File-Type-Based**

**✅ RECOMMENDED: Feature-Based (Current Structure)**
```
features/
  hr/
    components/
    hooks/
    services/
    types/
    pages/
```

**❌ NOT RECOMMENDED: File-Type-Based**
```
components/
  hr/
hooks/
  hr/
services/
  hr/
```

**Why Feature-Based?**
- Better scalability: Add new features without touching existing ones
- Colocation: Related files are close together
- Clear ownership: Each team can own a feature
- Easier code splitting and lazy loading

### 2. **Redux State Organization**

**CENTRALIZED Redux Store** (Current Approach ✅)
```
store/
  slices/
    authSlice.ts
    employeeSlice.ts
    departmentSlice.ts
    ...
```

**Why Centralized?**
- Single source of truth for ALL app state
- Easier to track state dependencies
- Better DevTools integration
- Avoids circular dependencies

**Note**: Individual features can have their slices inside `features/[feature]/slices/` during development, but should be imported into `store/slices/` for the Redux store configuration.

### 3. **Component Organization**

**Three Levels:**

1. **Global Shared Components** (`components/common/`)
   - Used across multiple features
   - Examples: Button, Input, Modal, Table

2. **Feature-Specific Components** (`features/[feature]/components/`)
   - Used only within that feature
   - Examples: LoginForm, KPITemplateCard, EmployeeSelector

3. **Layout Components** (`components/layout/`)
   - Structure and navigation
   - Examples: Header, Sidebar, PageContainer

### 4. **Barrel Exports (index.ts)**

Use barrel exports for clean imports:

```typescript
// features/hr/index.ts
export { default as HRDashboard } from './pages/Dashboard';
export { default as HRSettings } from './pages/Settings';
export * from './components';
export * from './hooks';
export * from './types';
```

**Usage:**
```typescript
// Clean import
import { HRDashboard, useHRDashboard } from '@/features/hr';

// Instead of
import HRDashboard from '@/features/hr/pages/Dashboard';
import { useHRDashboard } from '@/features/hr/hooks/useHRDashboard';
```

### 5. **TypeScript Types Location**

**Three Levels:**

1. **Feature-Specific Types**: `features/[feature]/types/`
2. **Shared Types**: `types/` (root level)
3. **Component Types**: Inside component files (for small interfaces)

**Example:**
```typescript
// features/hr/types/hr.types.ts
export interface Department {
  id: number;
  name: string;
  managerId: number;
}

// types/common.types.ts
export interface PaginationParams {
  page: number;
  limit: number;
}

// features/hr/components/DepartmentCard/DepartmentCard.tsx
interface DepartmentCardProps {
  department: Department; // Import from feature types
  onClick?: () => void;
}
```

---

## Implementation Guidelines

### Step 1: Organize Current Pages

**Move pages to their respective features:**

```bash
# Current structure (already correct)
features/
  hr/
    Dashboard.tsx ✅
    KPIList.tsx ✅
    Settings.tsx ✅
  manager/
    Dashboard.tsx ✅
    KPISetting.tsx ✅
  employee/
    Dashboard.tsx ✅
    KPIList.tsx ✅
```

**If you have pages outside features folder, move them:**
```bash
# Example: If Login.tsx is in src/pages/
mv src/pages/Login.tsx src/features/auth/Login.tsx
```

### Step 2: Create Feature Sub-folders

For each feature (auth, hr, manager, employee, superadmin, shared):

```bash
mkdir -p src/features/[feature]/components
mkdir -p src/features/[feature]/hooks
mkdir -p src/features/[feature]/services
mkdir -p src/features/[feature]/types
mkdir -p src/features/[feature]/utils
mkdir -p src/features/[feature]/pages  # if not exists
```

### Step 3: Extract Feature-Specific Components

**Example for HR:**

```bash
# If you have components used only in HR pages
# Move them from components/ to features/hr/components/

# Example: DepartmentCard only used in HR
mv src/components/DepartmentCard src/features/hr/components/
```

### Step 4: Create Feature Services

**Example: HR Service**

```typescript
// features/hr/services/hrService.ts
import api from '@/services/api';
import { Department, EmployeePerformance } from '../types';

export const hrService = {
  fetchDepartments: async (): Promise<Department[]> => {
    const { data } = await api.get('/departments');
    return data;
  },

  fetchEmployeePerformance: async (employeeId: number): Promise<EmployeePerformance> => {
    const { data } = await api.get(`/employees/${employeeId}/performance`);
    return data;
  },

  // ... other HR-specific API calls
};
```

### Step 5: Create Feature Hooks

**Example: HR Hook**

```typescript
// features/hr/hooks/useHRDashboard.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDepartments } from '@/store/slices/departmentSlice';
import { fetchStatistics } from '@/store/slices/statisticsSlice';

export const useHRDashboard = () => {
  const dispatch = useAppDispatch();
  const departments = useAppSelector((state) => state.departments.list);
  const statistics = useAppSelector((state) => state.statistics.dashboard);
  const loading = useAppSelector((state) => state.ui.loading);

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchStatistics());
  }, [dispatch]);

  return {
    departments,
    statistics,
    loading,
  };
};
```

### Step 6: Create Feature Types

```typescript
// features/hr/types/hr.types.ts
export interface Department {
  id: number;
  name: string;
  manager_id: number | null;
  manager_name?: string;
  employee_count?: number;
}

export interface EmployeePerformance {
  employeeId: number;
  name: string;
  kpiCount: number;
  averageRating: number;
  completionRate: number;
}

// Export all types
export * from './hr.types';
```

### Step 7: Create Barrel Exports

```typescript
// features/hr/index.ts
export * from './pages';
export * from './components';
export * from './hooks';
export * from './types';
export * from './services';
```

### Step 8: Update Imports

**Before:**
```typescript
import Dashboard from '../../../pages/hr/Dashboard';
import { fetchDepartments } from '../../../store/slices/departmentSlice';
```

**After:**
```typescript
import { HRDashboard, useHRDashboard } from '@/features/hr';
import { fetchDepartments } from '@/store/slices/departmentSlice';
```

---

## Current vs. Recommended Structure Comparison

### Current Structure (Partially Correct ✅)

```
✅ features/
  ✅ auth/ (has slices inside)
  ✅ hr/ (pages exist)
  ✅ manager/ (pages exist)
  ✅ employee/ (pages exist)
  ✅ superadmin/ (pages exist)
  ✅ shared/ (pages exist)

✅ store/
  ✅ slices/ (centralized)

❌ Missing: Feature sub-folders (components, hooks, services, types, utils)
❌ Missing: Barrel exports (index.ts)
❌ Issue: Some components may be in wrong location
```

### Actions Needed

1. **Create sub-folders for each feature:**
   ```bash
   components/
   hooks/
   services/
   types/
   utils/
   pages/  # if not exists
   ```

2. **Move feature-specific code into features:**
   - Components used only in one feature
   - Hooks used only in one feature
   - Types specific to one feature

3. **Keep in global folders:**
   - Components used across multiple features → `components/common/`
   - Hooks used globally → `hooks/`
   - Types used across features → `types/`

4. **Create barrel exports:**
   - Each feature needs an `index.ts`
   - Each sub-folder needs an `index.ts`

---

## Example: Complete HR Feature Structure

```
features/hr/
├── components/
│   ├── DepartmentCard/
│   │   ├── index.ts
│   │   ├── DepartmentCard.tsx
│   │   └── DepartmentCard.test.tsx
│   ├── EmployeePerformanceTable/
│   │   ├── index.ts
│   │   └── EmployeePerformanceTable.tsx
│   ├── SettingsPanel/
│   │   ├── index.ts
│   │   └── SettingsPanel.tsx
│   └── index.ts                          # Export all HR components
│
├── hooks/
│   ├── useHRDashboard.ts
│   ├── useDepartments.ts
│   ├── useSettings.ts
│   └── index.ts                          # Export all HR hooks
│
├── services/
│   ├── hrService.ts
│   ├── departmentService.ts
│   └── index.ts                          # Export all HR services
│
├── types/
│   ├── hr.types.ts
│   ├── department.types.ts
│   └── index.ts                          # Export all HR types
│
├── utils/
│   ├── performanceCalculators.ts
│   └── index.ts                          # Export all HR utils
│
├── pages/
│   ├── Dashboard.tsx
│   ├── KPIList.tsx
│   ├── KPIDetails.tsx
│   ├── Settings.tsx
│   ├── DepartmentDashboard.tsx
│   ├── EmailTemplates.tsx
│   ├── RejectedKPIManagement.tsx
│   ├── EmployeePerformance.tsx
│   └── index.ts                          # Export all HR pages
│
└── index.ts                              # Main HR feature export
```

**Main index.ts:**
```typescript
// features/hr/index.ts
export * from './pages';
export * from './components';
export * from './hooks';
export * from './types';
export * from './services';
export * from './utils';
```

---

## Best Practices

### 1. **Import Aliases**

Configure path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/features/*": ["src/features/*"],
      "@/store/*": ["src/store/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"]
    }
  }
}
```

**Usage:**
```typescript
import { Button } from '@/components/common';
import { useAuth } from '@/features/auth';
import { useAppSelector } from '@/store/hooks';
```

### 2. **Component Naming**

- **PascalCase**: Components, Types, Interfaces
- **camelCase**: Functions, variables, hooks
- **UPPER_SNAKE_CASE**: Constants

```typescript
// Component
export const DepartmentCard: React.FC<DepartmentCardProps> = () => {};

// Hook
export const useHRDashboard = () => {};

// Constant
export const MAX_RETRIES = 3;
```

### 3. **File Naming**

- **PascalCase**: Component files (`DepartmentCard.tsx`)
- **camelCase**: Utilities, services, hooks (`authService.ts`, `useAuth.ts`)
- **kebab-case**: CSS/Style files (`department-card.module.css`)

### 4. **Export Patterns**

```typescript
// Named exports (preferred for components)
export const Button: React.FC<ButtonProps> = () => {};

// Default export (for pages/containers)
export default Dashboard;

// Barrel exports (index.ts files)
export * from './Button';
export * from './Input';
export { default as Modal } from './Modal';
```

### 5. **Redux Slice Organization**

```typescript
// store/slices/employeeSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchEmployees = createAsyncThunk(/* ... */);
export const createEmployee = createAsyncThunk(/* ... */);

// Slice
const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    // Synchronous actions
  },
  extraReducers: (builder) => {
    // Async action handlers
  },
});

// Export actions
export const { setFilter, clearEmployees } = employeeSlice.actions;

// Export selectors
export const selectEmployees = (state: RootState) => state.employees.list;
export const selectLoading = (state: RootState) => state.employees.loading;

// Export reducer
export default employeeSlice.reducer;
```

### 6. **Service Layer Pattern**

```typescript
// features/hr/services/hrService.ts
import api from '@/services/api';
import { Department, CreateDepartmentDTO } from '../types';

export const hrService = {
  // GET
  fetchDepartments: async (): Promise<Department[]> => {
    const { data } = await api.get('/departments');
    return data;
  },

  // POST
  createDepartment: async (dto: CreateDepartmentDTO): Promise<Department> => {
    const { data } = await api.post('/departments', dto);
    return data;
  },

  // PUT
  updateDepartment: async (id: number, dto: CreateDepartmentDTO): Promise<Department> => {
    const { data } = await api.put(`/departments/${id}`, dto);
    return data;
  },

  // DELETE
  deleteDepartment: async (id: number): Promise<void> => {
    await api.delete(`/departments/${id}`);
  },
};
```

---

## Migration Checklist

### Phase 1: Structure Setup ✅ (Partially Done)
- [x] Create `features/` folder
- [x] Create feature folders (auth, hr, manager, employee, superadmin, shared)
- [x] Create `store/slices/` for Redux
- [ ] Create sub-folders for each feature (components, hooks, services, types, utils)

### Phase 2: Code Organization
- [ ] Move feature-specific components to `features/[feature]/components/`
- [ ] Move feature-specific hooks to `features/[feature]/hooks/`
- [ ] Create service files in `features/[feature]/services/`
- [ ] Create type files in `features/[feature]/types/`
- [ ] Create utility files in `features/[feature]/utils/`

### Phase 3: Barrel Exports
- [ ] Create `index.ts` for each feature
- [ ] Create `index.ts` for each sub-folder
- [ ] Update imports across the application

### Phase 4: Redux Integration
- [x] Centralize Redux slices in `store/slices/`
- [x] Create typed hooks (`useAppDispatch`, `useAppSelector`)
- [ ] Create feature-specific selectors
- [ ] Create feature-specific hooks using Redux

### Phase 5: Testing & Validation
- [ ] Verify all imports work
- [ ] Test each feature independently
- [ ] Ensure no circular dependencies
- [ ] Run linter and type checker

---

## Conclusion

This structure provides:

✅ **Scalability**: Easy to add new features  
✅ **Maintainability**: Clear organization and separation  
✅ **Developer Experience**: Easy to find and modify code  
✅ **Performance**: Better code splitting opportunities  
✅ **Testing**: Easy to test features in isolation  
✅ **Collaboration**: Clear ownership and boundaries  

The current structure is **70% correct**. The main improvements needed are:
1. Add sub-folders to each feature (components, hooks, services, types, utils)
2. Move feature-specific code into feature folders
3. Create barrel exports for clean imports
4. Add feature-specific services and hooks

---

## Next Steps

1. Review this document
2. Create missing sub-folders for each feature
3. Gradually move feature-specific code
4. Create barrel exports
5. Update imports
6. Test and validate

**Time Estimate**: 2-4 hours for complete reorganization

---

**Document Version**: 1.0  
**Last Updated**: January 8, 2026  
**Status**: Ready for Implementation
