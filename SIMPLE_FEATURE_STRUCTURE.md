# Simple Feature Structure Guide (HR Example)

## Recommended Standard Structure

```
src/
├── features/
│   └── hr/                                 # HR Feature Module
│       ├── components/                     # HR-specific components
│       │   ├── DepartmentCard.tsx
│       │   ├── EmployeeStatsCard.tsx
│       │   ├── SettingsForm.tsx
│       │   └── index.ts
│       │
│       ├── hooks/                          # HR-specific hooks
│       │   ├── useHRDashboard.ts
│       │   ├── useSettings.ts
│       │   └── index.ts
│       │
│       ├── services/                       # HR API calls
│       │   ├── hrService.ts
│       │   └── index.ts
│       │
│       ├── types/                          # HR TypeScript types
│       │   ├── hr.types.ts
│       │   └── index.ts
│       │
│       ├── pages/                          # HR Pages
│       │   ├── Dashboard.tsx
│       │   ├── Settings.tsx
│       │   ├── KPIList.tsx
│       │   └── index.ts
│       │
│       └── index.ts                        # Main export file
│
├── components/common/                      # Shared components
│   ├── Button/
│   ├── Input/
│   ├── Modal/
│   └── Table/
│
└── store/slices/                           # Redux (Centralized)
    ├── authSlice.ts
    ├── employeeSlice.ts
    ├── departmentSlice.ts
    └── settingsSlice.ts
```

---

## Complete HR Feature Example

### 1. Pages (`features/hr/pages/`)

**Dashboard.tsx**
```tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStatistics } from '@/store/slices/statisticsSlice';
import { DepartmentCard, EmployeeStatsCard } from '../components';
import { useHRDashboard } from '../hooks';

const Dashboard: React.FC = () => {
  const { statistics, departments, loading } = useHRDashboard();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">HR Dashboard</h1>
      
      <div className="grid grid-cols-3 gap-4">
        {statistics.map(stat => (
          <EmployeeStatsCard key={stat.id} data={stat} />
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Departments</h2>
        {departments.map(dept => (
          <DepartmentCard key={dept.id} department={dept} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
```

**pages/index.ts**
```ts
export { default as Dashboard } from './Dashboard';
export { default as Settings } from './Settings';
export { default as KPIList } from './KPIList';
export { default as KPIDetails } from './KPIDetails';
```

---

### 2. Components (`features/hr/components/`)

**DepartmentCard.tsx**
```tsx
import React from 'react';
import { Card } from '@/components/common';
import { Department } from '../types';

interface DepartmentCardProps {
  department: Department;
  onClick?: () => void;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({ 
  department, 
  onClick 
}) => {
  return (
    <Card onClick={onClick} className="p-4 cursor-pointer hover:shadow-lg">
      <h3 className="text-lg font-semibold">{department.name}</h3>
      <p className="text-gray-600">Manager: {department.manager_name}</p>
      <p className="text-sm text-gray-500">
        Employees: {department.employee_count}
      </p>
    </Card>
  );
};
```

**EmployeeStatsCard.tsx**
```tsx
import React from 'react';
import { StatsCard } from '@/components/common';

interface EmployeeStatsCardProps {
  data: {
    title: string;
    count: number;
    icon: string;
  };
}

export const EmployeeStatsCard: React.FC<EmployeeStatsCardProps> = ({ data }) => {
  return (
    <StatsCard
      title={data.title}
      value={data.count}
      icon={data.icon}
    />
  );
};
```

**components/index.ts**
```ts
export * from './DepartmentCard';
export * from './EmployeeStatsCard';
export * from './SettingsForm';
```

---

### 3. Hooks (`features/hr/hooks/`)

**useHRDashboard.ts**
```ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDepartments } from '@/store/slices/departmentSlice';
import { fetchStatistics } from '@/store/slices/statisticsSlice';

export const useHRDashboard = () => {
  const dispatch = useAppDispatch();
  
  const departments = useAppSelector(state => state.departments.list);
  const statistics = useAppSelector(state => state.statistics.dashboard);
  const loading = useAppSelector(state => state.ui.loading);

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

**useSettings.ts**
```ts
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateSettings } from '@/store/slices/settingsSlice';

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings);
  const [saving, setSaving] = useState(false);

  const saveSettings = async (data: any) => {
    setSaving(true);
    try {
      await dispatch(updateSettings(data)).unwrap();
      return true;
    } catch (error) {
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    saving,
    saveSettings,
  };
};
```

**hooks/index.ts**
```ts
export * from './useHRDashboard';
export * from './useSettings';
```

---

### 4. Services (`features/hr/services/`)

**hrService.ts**
```ts
import api from '@/services/api';
import { Department, EmployeePerformance } from '../types';

export const hrService = {
  // Departments
  getDepartments: async (): Promise<Department[]> => {
    const { data } = await api.get('/departments');
    return data;
  },

  createDepartment: async (department: Partial<Department>): Promise<Department> => {
    const { data } = await api.post('/departments', department);
    return data;
  },

  updateDepartment: async (id: number, department: Partial<Department>): Promise<Department> => {
    const { data } = await api.put(`/departments/${id}`, department);
    return data;
  },

  deleteDepartment: async (id: number): Promise<void> => {
    await api.delete(`/departments/${id}`);
  },

  // Employee Performance
  getEmployeePerformance: async (employeeId: number): Promise<EmployeePerformance> => {
    const { data } = await api.get(`/employees/${employeeId}/performance`);
    return data;
  },

  // Statistics
  getDashboardStats: async (): Promise<any> => {
    const { data } = await api.get('/hr/statistics');
    return data;
  },
};
```

**services/index.ts**
```ts
export * from './hrService';
```

---

### 5. Types (`features/hr/types/`)

**hr.types.ts**
```ts
export interface Department {
  id: number;
  name: string;
  manager_id: number | null;
  manager_name?: string;
  employee_count?: number;
  created_at?: string;
}

export interface EmployeePerformance {
  employee_id: number;
  employee_name: string;
  department_id: number;
  department_name: string;
  total_kpis: number;
  completed_kpis: number;
  average_rating: number;
  completion_rate: number;
}

export interface HRStatistics {
  total_employees: number;
  total_departments: number;
  active_kpis: number;
  pending_reviews: number;
}
```

**types/index.ts**
```ts
export * from './hr.types';
```

---

### 6. Main Export (`features/hr/index.ts`)

```ts
// Pages
export * from './pages';

// Components
export * from './components';

// Hooks
export * from './hooks';

// Types
export * from './types';

// Services
export * from './services';
```

---

## Usage Examples

### In App.tsx (Routing)

```tsx
import { Dashboard as HRDashboard, Settings as HRSettings } from '@/features/hr';

<Route path="/hr/dashboard" element={<HRDashboard />} />
<Route path="/hr/settings" element={<HRSettings />} />
```

### In Another Component

```tsx
import { useHRDashboard, Department } from '@/features/hr';
import { DepartmentCard } from '@/features/hr';

const MyComponent = () => {
  const { departments, loading } = useHRDashboard();

  return (
    <div>
      {departments.map(dept => (
        <DepartmentCard key={dept.id} department={dept} />
      ))}
    </div>
  );
};
```

---

## File Organization Rules

### ✅ DO

1. **Keep feature code together**
   ```
   features/hr/
     ├── components/  # Only HR components
     ├── hooks/       # Only HR hooks
     └── pages/       # Only HR pages
   ```

2. **Use barrel exports (index.ts)**
   ```ts
   // features/hr/components/index.ts
   export * from './DepartmentCard';
   export * from './EmployeeStatsCard';
   ```

3. **Import from feature root**
   ```ts
   import { useHRDashboard, DepartmentCard } from '@/features/hr';
   ```

4. **Keep Redux centralized**
   ```
   store/slices/
     ├── departmentSlice.ts
     ├── settingsSlice.ts
     └── statisticsSlice.ts
   ```

### ❌ DON'T

1. **Don't mix features**
   ```
   ❌ features/hr/components/ManagerKPICard.tsx  # Wrong!
   ✅ features/manager/components/KPICard.tsx    # Correct!
   ```

2. **Don't duplicate shared components**
   ```
   ❌ features/hr/components/Button.tsx          # Wrong!
   ✅ components/common/Button/Button.tsx        # Correct!
   ```

3. **Don't put Redux in features** (use centralized)
   ```
   ❌ features/hr/slices/departmentSlice.ts      # Wrong!
   ✅ store/slices/departmentSlice.ts            # Correct!
   ```

---

## Quick Setup Steps

### Step 1: Create Folders
```bash
cd src/features/hr
mkdir components hooks services types pages
```

### Step 2: Create index.ts Files
```bash
touch components/index.ts
touch hooks/index.ts
touch services/index.ts
touch types/index.ts
touch pages/index.ts
touch index.ts
```

### Step 3: Move Existing Files
```bash
# If pages are in src/pages/hr/
mv src/pages/hr/*.tsx src/features/hr/pages/
```

### Step 4: Create Feature Files
- Add components to `components/`
- Add hooks to `hooks/`
- Add services to `services/`
- Add types to `types/`

### Step 5: Add Exports
```ts
// features/hr/index.ts
export * from './pages';
export * from './components';
export * from './hooks';
export * from './types';
export * from './services';
```

---

## Apply Same Pattern to Other Features

```
features/
├── hr/              ✅ (Follow above structure)
├── manager/         ✅ (Same structure)
├── employee/        ✅ (Same structure)
├── superadmin/      ✅ (Same structure)
├── auth/            ✅ (Same structure)
└── shared/          ✅ (Same structure)
```

Each feature has:
- `components/` - Feature-specific UI
- `hooks/` - Feature-specific logic
- `services/` - Feature-specific API calls
- `types/` - Feature-specific types
- `pages/` - Feature pages
- `index.ts` - Export everything

---

## Summary

**One Feature = One Self-Contained Module**

```
features/hr/
├── components/      # What users see (HR-specific UI)
├── hooks/          # How it works (HR-specific logic)
├── services/       # How it talks to API (HR endpoints)
├── types/          # What data looks like (HR interfaces)
├── pages/          # Full pages (HR screens)
└── index.ts        # Public API of HR feature
```

**That's it!** Simple, clean, and scalable. 🚀

Copy this pattern for each feature: `manager`, `employee`, `superadmin`, `auth`, `shared`.
