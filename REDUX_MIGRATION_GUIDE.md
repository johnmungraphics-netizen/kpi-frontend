# Redux Migration Guide for KPI Management Application

## Overview

This guide provides step-by-step instructions for migrating components from direct API calls with local state to Redux Toolkit state management.

---

## Table of Contents

1. [Why Migrate to Redux?](#why-migrate-to-redux)
2. [Prerequisites](#prerequisites)
3. [Current Architecture](#current-architecture)
4. [Target Architecture](#target-architecture)
5. [Step-by-Step Migration Process](#step-by-step-migration-process)
6. [Creating New Redux Slices](#creating-new-redux-slices)
7. [Migration Patterns](#migration-patterns)
8. [Testing Guidelines](#testing-guidelines)
9. [Common Pitfalls](#common-pitfalls)
10. [Checklist](#checklist)

---

## Why Migrate to Redux?

### Current Problems
- ❌ **100+ direct API calls** scattered across components
- ❌ **No state sharing** between components
- ❌ **Duplicate requests** for the same data
- ❌ **No caching** - data refetched on every mount
- ❌ **Inconsistent error handling**
- ❌ **Hard to debug** state changes
- ❌ **No centralized loading states**

### Benefits After Migration
- ✅ **Centralized state** - Single source of truth
- ✅ **Data caching** - Fetch once, use everywhere
- ✅ **Redux DevTools** - Time-travel debugging
- ✅ **Type safety** - Full TypeScript support
- ✅ **Better performance** - Optimized re-renders
- ✅ **Easier testing** - Mock Redux store
- ✅ **Consistent patterns** - Less boilerplate

---

## Prerequisites

### Required Knowledge
- React Hooks (useState, useEffect, useCallback)
- TypeScript basics
- Async/await and Promises
- Redux Toolkit fundamentals

### Tools Already Set Up ✅
- Redux store configured at `src/store/index.ts`
- Type-safe hooks: `useAppDispatch`, `useAppSelector`
- Redux DevTools integration
- Existing slices: auth, kpi, notifications, ui

---

## Current Architecture

### Typical Component Pattern (Before Migration)

```typescript
// ❌ BEFORE - Direct API calls with local state
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Dashboard = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchKPIs = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/kpis');
        setKpis(response.data.kpis);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load KPIs');
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      {kpis.map(kpi => <KPICard key={kpi.id} kpi={kpi} />)}
    </div>
  );
};
```

**Problems**:
- 3 useState hooks for one API call
- Loading/error logic repeated in every component
- Data not shared with other components
- No caching - refetches on every mount
- Hard to test

---

## Target Architecture

### Redux-Powered Component (After Migration)

```typescript
// ✅ AFTER - Redux state management
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchKPIs } from '../../store/slices/kpiSlice';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { kpis, loading, error } = useAppSelector(state => state.kpi);

  useEffect(() => {
    dispatch(fetchKPIs());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      {kpis.map(kpi => <KPICard key={kpi.id} kpi={kpi} />)}
    </div>
  );
};
```

**Improvements**:
- ✅ Zero local state hooks needed
- ✅ Data accessible from any component
- ✅ Automatic caching
- ✅ Redux DevTools support
- ✅ Consistent error/loading handling
- ✅ Easy to test

---

## Step-by-Step Migration Process

### Phase 1: Identify Components to Migrate

1. **Find all components with direct API calls**
   ```bash
   # Search for api.get, api.post, etc.
   grep -r "api\.(get|post|put|delete)" src/pages/
   ```

2. **Priority ranking**:
   - **P0 - Critical**: Login, Dashboards (already done for Login ✅)
   - **P1 - High**: KPI lists, Employee management
   - **P2 - Medium**: Settings, Profile pages
   - **P3 - Low**: Admin utilities

### Phase 2: Check if Redux Slice Exists

**Existing Slices** (in `src/store/slices/`):
- ✅ `authSlice.ts` - Authentication
- ✅ `kpiSlice.ts` - KPI operations
- ✅ `notificationSlice.ts` - Notifications
- ✅ `uiSlice.ts` - UI state

**Need to Create**:
- ❌ `employeeSlice.ts` - Employee management
- ❌ `departmentSlice.ts` - Department operations
- ❌ `settingsSlice.ts` - Application settings
- ❌ `reviewSlice.ts` - KPI reviews
- ❌ `statisticsSlice.ts` - Dashboard statistics

### Phase 3: Create Redux Slice (if needed)

See [Creating New Redux Slices](#creating-new-redux-slices) section below.

### Phase 4: Migrate Component

Follow these steps for each component:

#### Step 1: Import Redux hooks

```typescript
// Add these imports
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchKPIs, createKPI, updateKPI } from '../../store/slices/kpiSlice';
```

#### Step 2: Replace useState with useAppSelector

```typescript
// ❌ BEFORE
const [kpis, setKpis] = useState<KPI[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

// ✅ AFTER
const { kpis, loading, error } = useAppSelector(state => state.kpi);
```

#### Step 3: Replace API calls with Redux dispatches

```typescript
// ❌ BEFORE
const fetchKPIs = async () => {
  setLoading(true);
  try {
    const response = await api.get('/kpis');
    setKpis(response.data.kpis);
  } catch (err) {
    setError('Failed to load');
  } finally {
    setLoading(false);
  }
};

// ✅ AFTER
const dispatch = useAppDispatch();

useEffect(() => {
  dispatch(fetchKPIs());
}, [dispatch]);
```

#### Step 4: Update form submissions

```typescript
// ❌ BEFORE
const handleCreate = async (formData) => {
  try {
    const response = await api.post('/kpis', formData);
    setKpis([...kpis, response.data]);
    toast.success('Created successfully');
  } catch (err) {
    toast.error('Failed to create');
  }
};

// ✅ AFTER
const handleCreate = async (formData) => {
  const result = await dispatch(createKPI(formData));
  
  if (createKPI.fulfilled.match(result)) {
    toast.success('Created successfully');
    navigate('/kpis');
  } else {
    toast.error(result.payload as string);
  }
};
```

#### Step 5: Remove unused code

Delete:
- ❌ Unused useState declarations
- ❌ Manual loading/error state management
- ❌ Direct API imports (if no longer needed)
- ❌ Custom fetch functions

#### Step 6: Test thoroughly

- [ ] Component renders correctly
- [ ] Data loads on mount
- [ ] Loading states display properly
- [ ] Error states handled gracefully
- [ ] CRUD operations work
- [ ] Redux DevTools shows correct actions

---

## Creating New Redux Slices

### Template: Employee Slice

Create `src/store/slices/employeeSlice.ts`:

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Employee } from '../../types';

// Define state interface
interface EmployeeState {
  employees: Employee[];
  currentEmployee: Employee | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
}

// Initial state
const initialState: EmployeeState = {
  employees: [],
  currentEmployee: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
};

// Async thunks
export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (params: { page?: number; search?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/employees', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employees');
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee');
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/create',
  async (data: Partial<Employee>, { rejectWithValue }) => {
    try {
      const response = await api.post('/employees', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create employee');
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }: { id: number; data: Partial<Employee> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/employees/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update employee');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/employees/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete employee');
    }
  }
);

// Slice
const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setCurrentEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.currentEmployee = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all employees
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees || action.payload;
        if (action.payload.page) {
          state.pagination = {
            page: action.payload.page,
            totalPages: action.payload.totalPages,
            total: action.payload.total,
          };
        }
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch employee by ID
    builder
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create employee
    builder
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update employee
    builder
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        if (state.currentEmployee?.id === action.payload.id) {
          state.currentEmployee = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete employee
    builder
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(emp => emp.id !== action.payload);
        if (state.currentEmployee?.id === action.payload) {
          state.currentEmployee = null;
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentEmployee, clearError } = employeeSlice.actions;
export default employeeSlice.reducer;
```

### Register the New Slice

Update `src/store/index.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import kpiReducer from './slices/kpiSlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice';
import employeeReducer from './slices/employeeSlice'; // NEW

export const store = configureStore({
  reducer: {
    auth: authReducer,
    kpi: kpiReducer,
    notifications: notificationReducer,
    ui: uiReducer,
    employees: employeeReducer, // NEW
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## Migration Patterns

### Pattern 1: Simple Data Fetching

**Component**: Display list of items

```typescript
// Component
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchEmployees } from '../store/slices/employeeSlice';

const EmployeeList = () => {
  const dispatch = useAppDispatch();
  const { employees, loading, error } = useAppSelector(state => state.employees);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      {employees.map(emp => (
        <EmployeeCard key={emp.id} employee={emp} />
      ))}
    </div>
  );
};
```

### Pattern 2: Fetch with Parameters

**Component**: Filtered/paginated data

```typescript
const EmployeeList = () => {
  const dispatch = useAppDispatch();
  const { employees, loading, pagination } = useAppSelector(state => state.employees);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchEmployees({ page, search }));
  }, [dispatch, page, search]);

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {employees.map(emp => <EmployeeCard key={emp.id} employee={emp} />)}
      <Pagination 
        page={page} 
        totalPages={pagination.totalPages}
        onChange={setPage}
      />
    </div>
  );
};
```

### Pattern 3: Create/Update Operations

**Component**: Form submission

```typescript
const EmployeeForm = ({ employeeId }: { employeeId?: number }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentEmployee, loading } = useAppSelector(state => state.employees);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeById(employeeId));
    }
  }, [dispatch, employeeId]);

  useEffect(() => {
    if (currentEmployee) {
      setFormData(currentEmployee);
    }
  }, [currentEmployee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = employeeId
      ? await dispatch(updateEmployee({ id: employeeId, data: formData }))
      : await dispatch(createEmployee(formData));

    if (createEmployee.fulfilled.match(result) || updateEmployee.fulfilled.match(result)) {
      toast.success(`Employee ${employeeId ? 'updated' : 'created'} successfully`);
      navigate('/employees');
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" loading={loading}>
        {employeeId ? 'Update' : 'Create'}
      </Button>
    </form>
  );
};
```

### Pattern 4: Delete Operations

**Component**: Delete with confirmation

```typescript
const EmployeeCard = ({ employee }: { employee: Employee }) => {
  const dispatch = useAppDispatch();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    const result = await dispatch(deleteEmployee(employee.id));
    
    if (deleteEmployee.fulfilled.match(result)) {
      toast.success('Employee deleted');
      setShowConfirm(false);
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <div>
      <h3>{employee.name}</h3>
      <Button onClick={() => setShowConfirm(true)}>Delete</Button>
      
      {showConfirm && (
        <ConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};
```

### Pattern 5: Using Selectors for Derived Data

**Create Selectors**:

```typescript
// store/slices/employeeSlice.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Basic selector
export const selectEmployees = (state: RootState) => state.employees.employees;

// Memoized derived selector
export const selectActiveEmployees = createSelector(
  [selectEmployees],
  (employees) => employees.filter(emp => emp.status === 'active')
);

export const selectEmployeesByDepartment = createSelector(
  [selectEmployees, (state: RootState, department: string) => department],
  (employees, department) => employees.filter(emp => emp.department === department)
);
```

**Use in Components**:

```typescript
const ActiveEmployees = () => {
  // This automatically recomputes only when employees change
  const activeEmployees = useAppSelector(selectActiveEmployees);
  
  return (
    <div>
      {activeEmployees.map(emp => <EmployeeCard key={emp.id} employee={emp} />)}
    </div>
  );
};

const DepartmentEmployees = ({ department }: { department: string }) => {
  const deptEmployees = useAppSelector(state => 
    selectEmployeesByDepartment(state, department)
  );
  
  return (
    <div>
      {deptEmployees.map(emp => <EmployeeCard key={emp.id} employee={emp} />)}
    </div>
  );
};
```

---

## Testing Guidelines

### Unit Testing Redux Slices

```typescript
// store/slices/__tests__/employeeSlice.test.ts
import { configureStore } from '@reduxjs/toolkit';
import employeeReducer, { fetchEmployees, createEmployee } from '../employeeSlice';
import { server } from '../../../test/mocks/server';
import { rest } from 'msw';

describe('employeeSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { employees: employeeReducer }
    });
  });

  it('should fetch employees successfully', async () => {
    const mockEmployees = [
      { id: 1, name: 'John Doe', email: 'john@test.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@test.com' },
    ];

    server.use(
      rest.get('/api/employees', (req, res, ctx) => {
        return res(ctx.json({ employees: mockEmployees }));
      })
    );

    await store.dispatch(fetchEmployees());

    const state = store.getState().employees;
    expect(state.loading).toBe(false);
    expect(state.employees).toHaveLength(2);
    expect(state.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    server.use(
      rest.get('/api/employees', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Server error' }));
      })
    );

    await store.dispatch(fetchEmployees());

    const state = store.getState().employees;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Server error');
  });

  it('should create employee', async () => {
    const newEmployee = { name: 'New Employee', email: 'new@test.com' };

    await store.dispatch(createEmployee(newEmployee));

    const state = store.getState().employees;
    expect(state.employees).toContainEqual(expect.objectContaining(newEmployee));
  });
});
```

### Integration Testing Components

```typescript
// __tests__/integration/EmployeeList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store';
import EmployeeList from '../../pages/EmployeeList';

test('EmployeeList displays employees after loading', async () => {
  render(
    <Provider store={store}>
      <EmployeeList />
    </Provider>
  );

  // Should show loading initially
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Should show employees after load
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});
```

---

## Common Pitfalls

### Pitfall 1: Not Handling Unwrap Errors

❌ **Wrong**:
```typescript
const handleCreate = async () => {
  await dispatch(createEmployee(formData)).unwrap();
  // If this fails, it throws an error that isn't caught!
  navigate('/employees');
};
```

✅ **Correct**:
```typescript
const handleCreate = async () => {
  try {
    await dispatch(createEmployee(formData)).unwrap();
    toast.success('Created successfully');
    navigate('/employees');
  } catch (error) {
    toast.error(error as string);
  }
};
```

### Pitfall 2: Stale Dependencies

❌ **Wrong**:
```typescript
useEffect(() => {
  dispatch(fetchEmployees({ department }));
}, []); // Missing dependency!
```

✅ **Correct**:
```typescript
useEffect(() => {
  dispatch(fetchEmployees({ department }));
}, [dispatch, department]);
```

### Pitfall 3: Not Checking Action Result

❌ **Wrong**:
```typescript
const handleDelete = async () => {
  await dispatch(deleteEmployee(id));
  toast.success('Deleted'); // Shows even if it failed!
};
```

✅ **Correct**:
```typescript
const handleDelete = async () => {
  const result = await dispatch(deleteEmployee(id));
  
  if (deleteEmployee.fulfilled.match(result)) {
    toast.success('Deleted successfully');
  } else {
    toast.error('Failed to delete');
  }
};
```

### Pitfall 4: Mutating State

❌ **Wrong**:
```typescript
// In reducer
state.employees.push(action.payload); // This mutates the array!
```

✅ **Correct** (Redux Toolkit uses Immer, so this is actually OK):
```typescript
// Redux Toolkit with Immer - this works!
state.employees.push(action.payload);

// Or explicitly create new array
state.employees = [...state.employees, action.payload];
```

### Pitfall 5: Selecting Too Much State

❌ **Wrong** (causes unnecessary re-renders):
```typescript
const entireState = useAppSelector(state => state);
```

✅ **Correct** (only select what you need):
```typescript
const { employees, loading } = useAppSelector(state => state.employees);
```

---

## Checklist

Use this checklist when migrating each component:

### Before Starting
- [ ] Component has been identified for migration
- [ ] Checked if appropriate Redux slice exists
- [ ] Created new slice if needed
- [ ] Registered slice in store
- [ ] Read migration patterns for component type

### During Migration
- [ ] Imported Redux hooks (`useAppDispatch`, `useAppSelector`)
- [ ] Imported thunks from appropriate slice
- [ ] Replaced `useState` with `useAppSelector`
- [ ] Replaced API calls with `dispatch(thunkName())`
- [ ] Updated form submissions to use Redux
- [ ] Removed unused state and API imports
- [ ] Handled loading states from Redux
- [ ] Handled error states from Redux

### After Migration
- [ ] Component renders correctly
- [ ] Data loads on component mount
- [ ] CRUD operations work as expected
- [ ] Loading indicators display properly
- [ ] Error messages show correctly
- [ ] Redux DevTools shows actions
- [ ] No console errors
- [ ] Component re-renders optimized
- [ ] Unit tests written
- [ ] Integration tests passing

### Code Review
- [ ] No direct API calls remain
- [ ] No duplicate state management
- [ ] Proper error handling
- [ ] Type safety maintained
- [ ] Code follows project conventions
- [ ] Comments added for complex logic

---

## Examples from Codebase

### ✅ Good Example: Login Page

`src/pages/Login.tsx` - Already migrated to Redux!

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, loginWithEmail, clearError } from '../store/slices/authSlice';

const Login = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector(state => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginAction({ payrollNumber, password })).unwrap();
    } catch (err) {
      // Error automatically stored in Redux
    }
  };
};
```

### ❌ Needs Migration: HR Dashboard

`src/pages/hr/Dashboard.tsx` - Has 10+ API calls, 15+ useState hooks

**Current Pattern**:
```typescript
const [kpis, setKpis] = useState<KPI[]>([]);
const [reviews, setReviews] = useState<KPIReview[]>([]);
const [notifications, setNotifications] = useState<Notification[]>([]);
// ... 12 more useState hooks

useEffect(() => {
  const fetchData = async () => {
    const [kpisRes, reviewsRes, notificationsRes] = await Promise.all([
      api.get('/kpis'),
      api.get('/kpi-review'),
      api.get('/notifications'),
    ]);
    // Manual state updates
  };
  fetchData();
}, []);
```

**Target Pattern** (after migration):
```typescript
const { kpis } = useAppSelector(state => state.kpi);
const { reviews } = useAppSelector(state => state.reviews);
const { notifications } = useAppSelector(state => state.notifications);

useEffect(() => {
  dispatch(fetchKPIs());
  dispatch(fetchReviews());
  dispatch(fetchNotifications());
}, [dispatch]);
```

---

## Additional Resources

### Official Documentation
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Redux TypeScript Guide](https://redux.js.org/usage/usage-with-typescript)
- [React-Redux Hooks API](https://react-redux.js.org/api/hooks)

### Internal Documentation
- [API Security & Redux Analysis Report](./API_SECURITY_AND_REDUX_ANALYSIS.md)
- Redux Store: `src/store/index.ts`
- Type Definitions: `src/types/index.ts`

### Tools
- **Redux DevTools Extension**: [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)
- **Redux Toolkit CLI**: For generating slices
- **MSW (Mock Service Worker)**: For testing API calls

---

## Getting Help

If you encounter issues during migration:

1. **Check Redux DevTools**: Inspect actions and state changes
2. **Review Existing Slices**: Look at `authSlice.ts` and `kpiSlice.ts` for patterns
3. **Search Documentation**: Redux Toolkit docs are comprehensive
4. **Ask Team**: Other developers may have solved similar issues
5. **Create Issue**: Document problem for team discussion

---

## Summary

**Key Takeaways**:
1. Redux centralizes state and eliminates duplicate API calls
2. Use `useAppSelector` to read state, `useAppDispatch` to trigger actions
3. Create Redux slices for each domain (employees, departments, etc.)
4. Always handle loading and error states from Redux
5. Test thoroughly with Redux DevTools
6. Migrate incrementally - one component at a time

**Next Steps**:
1. Review this guide thoroughly
2. Pick a component to migrate (start small!)
3. Follow the step-by-step process
4. Test with Redux DevTools
5. Submit PR with detailed description
6. Move to next component

Good luck with your migrations! 🚀
