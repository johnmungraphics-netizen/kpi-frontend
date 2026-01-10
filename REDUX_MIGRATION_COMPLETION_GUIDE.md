# Redux Migration Completion Guide

## Migration Progress: 20% Complete ✅

### ✅ Completed Components
1. **HR Dashboard** - Fully migrated, using Redux for KPIs, statistics, departments, and period settings
2. **Employees Page** - Fully migrated, using Redux for employee management and departments

### 🔄 In Progress
3. **Manager Dashboard** - 50% complete (imports added, state variables updated, needs function replacements)

---

## IMMEDIATE NEXT STEPS

### Step 1: Complete Manager Dashboard Migration

**File**: `src/pages/manager/Dashboard.tsx`

**Current Status**: Imports and state variables updated, need to update useEffect hooks

**Remaining Work**:

Replace the first useEffect (around line 91-97):
```typescript
// OLD
useEffect(() => {
  fetchData();
  fetchDepartmentStatistics();
  fetchPeriodSettings();
  fetchManagerDepartments();
  loadDefaultPeriod();
}, []);

// NEW
useEffect(() => {
  dispatch(fetchKPIs());
  dispatch(fetchDepartmentStatistics());
  dispatch(fetchPeriodSettings());
  dispatch(fetchDepartments());
  fetchNonReduxData();
  fetchManagerDepartments();
  loadDefaultPeriod();
}, [dispatch]);
```

Replace the third useEffect (around line 107-109):
```typescript
// OLD
useEffect(() => {
  fetchDepartmentStatistics();
}, [filters.period, filters.department]);

// NEW
useEffect(() => {
  const params: any = {};
  if (filters.period) params.period = filters.period;
  if (filters.department) params.department = filters.department;
  dispatch(fetchDepartmentStatistics(params));
}, [dispatch, filters.period, filters.department]);
```

Remove fetchData function and replace with:
```typescript
const fetchNonReduxData = async () => {
  try {
    setLoading(true);
    const [reviewsRes, notificationsRes, activityRes, employeesRes] = await Promise.all([
      api.get('/kpi-review').catch(err => {
        console.error('Error fetching reviews:', err);
        return { data: { reviews: [] } };
      }),
      api.get('/notifications', { params: { limit: 5, read: 'false' } }).catch(err => {
        console.error('Error fetching notifications:', err);
        return { data: { notifications: [] } };
      }),
      api.get('/notifications/activity').catch(err => {
        console.error('Error fetching activity:', err);
        return { data: { activities: [] } };
      }),
      api.get('/employees').catch(err => {
        console.error('Error fetching employees:', err);
        return { data: { employees: [] } };
      }),
    ]);

    setReviews(reviewsRes.data.reviews || []);
    setNotifications(notificationsRes.data.notifications || []);
    setRecentActivity(activityRes.data.activities || []);
    setEmployees(employeesRes.data.employees || []);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    setLoading(false);
  }
};
```

Remove fetchDepartmentStatistics function (no longer needed - using Redux)

Remove fetchPeriodSettings function (no longer needed - using Redux)

Update all references to `statistics` with `departmentStatistics` in the JSX (search and replace)

Update all references to local `loading` to use `loading || kpisLoading || statsLoading`

**Commands to help**:
```bash
cd c:/kpi/fronted/kpi-frontend/src/pages/manager
# Replace statistics references
sed -i 's/statistics\.map/departmentStatistics.map/g' Dashboard.tsx
sed -i 's/statistics\.reduce/departmentStatistics.reduce/g' Dashboard.tsx
sed -i 's/statistics\.find/departmentStatistics.find/g' Dashboard.tsx
sed -i 's/statistics\.length/departmentStatistics.length/g' Dashboard.tsx
```

---

### Step 2: Migrate Employee Dashboard

**File**: `src/pages/employee/Dashboard.tsx`

**Migration Steps**:

1. Add imports:
```typescript
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchKPIs } from '../../store/slices/kpiSlice';
import { fetchPeriodSettings } from '../../store/slices/settingsSlice';
```

2. Replace state management:
```typescript
// OLD
const [kpis, setKpis] = useState<KPI[]>([]);
const [loading, setLoading] = useState(true);
const [periodSettings, setPeriodSettings] = useState([]);

// NEW
const dispatch = useAppDispatch();
const { kpis, loading: kpisLoading } = useAppSelector(state => state.kpi);
const { periodSettings } = useAppSelector(state => state.settings);
const [loading, setLoading] = useState(true);  // Keep for non-Redux data
```

3. Update useEffect:
```typescript
// OLD
useEffect(() => {
  fetchKPIs();
  fetchPeriodSettings();
}, []);

// NEW
useEffect(() => {
  dispatch(fetchKPIs());
  dispatch(fetchPeriodSettings());
  // Keep other non-Redux fetches
}, [dispatch]);
```

4. Remove fetchKPIs and fetchPeriodSettings functions

---

### Step 3: Migrate HR KPIList

**File**: `src/pages/hr/KPIList.tsx`

**Current Issues**: 13+ useState hooks, 8+ direct API calls

**Redux Slices Needed**:
- `kpiSlice` - for KPI data
- `settingsSlice` - for period settings
- `departmentSlice` - for departments
- `employeeSlice` - for employee data

**Migration Pattern**:

1. Add Redux imports
2. Replace KPI state: `const { kpis, loading, pagination } = useAppSelector(state => state.kpi);`
3. Replace period settings: `const { periodSettings } = useAppSelector(state => state.settings);`
4. Replace departments: `const { departments } = useAppSelector(state => state.departments);`
5. Update all fetch calls to use Redux dispatch
6. Remove manual API calls

---

### Step 4: Migrate Manager KPISetting

**File**: `src/pages/manager/KPISetting.tsx`

**Migration Steps**:

1. Use `kpiSlice` for KPI operations
2. Use `employeeSlice` for employee data
3. Use `settingsSlice` for period settings
4. Replace form submission to use Redux createKPI thunk
5. Handle success/error with Redux fulfilled/rejected actions

**Pattern**:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const result = await dispatch(createKPI(formData));
  if (createKPI.fulfilled.match(result)) {
    toast.show('KPI created successfully', 'success');
    navigate('/manager/kpi-list');
  } else {
    toast.show(result.payload as string || 'Failed to create KPI', 'error');
  }
};
```

---

### Step 5: Migrate Employee KPIList

**File**: `src/pages/employee/KPIList.tsx`

**Simpler than HR version** - employee only sees their own KPIs

**Redux Usage**:
- `kpiSlice.fetchKPIs({ employeeId: user.id })`
- `settingsSlice` for period settings
- Display and filtering only (no create/edit operations)

---

### Step 6: Migrate HR Settings

**File**: `src/pages/hr/Settings.tsx`

**This is the PERFECT use case for settingsSlice!**

**Current State**: 12+ useState hooks, 15+ API calls for different settings

**New State Structure**:
```typescript
const dispatch = useAppDispatch();
const { 
  periodSettings, 
  reminderSettings, 
  dailyReminderSetting,
  ratingOptions, 
  hrEmailNotifications,
  loading 
} = useAppSelector(state => state.settings);
```

**Replace all API calls**:
- Period Settings: `dispatch(fetchPeriodSettings())`, `dispatch(createPeriodSetting(data))`, etc.
- Reminder Settings: `dispatch(fetchReminderSettings())`, `dispatch(updateReminderSetting(data))`
- Rating Options: `dispatch(fetchRatingOptions())`, `dispatch(updateRatingOption({id, data}))`
- Daily Reminders: `dispatch(fetchDailyReminderSettings())`, `dispatch(updateDailyReminderSetting(data))`
- HR Notifications: `dispatch(fetchHREmailNotifications())`, `dispatch(updateHREmailNotification({id, data}))`

**Benefits**:
- Reduces from 15+ API calls to Redux dispatches
- All settings cached in Redux
- Settings accessible from any component
- Instant updates across all components using settings

---

## MIGRATION TESTING CHECKLIST

For each migrated component:

### Before Starting
- [ ] Read component code thoroughly
- [ ] List all useState hooks using server data
- [ ] List all API calls
- [ ] Identify which Redux slices are needed

### During Migration
- [ ] Add Redux imports
- [ ] Replace useState with useAppSelector
- [ ] Replace API fetch calls with dispatch(thunk())
- [ ] Update useEffect dependencies to include 'dispatch'
- [ ] Handle loading states from Redux
- [ ] Handle error states from Redux
- [ ] Update form submissions to dispatch actions
- [ ] Remove unused useState and API call functions

### After Migration
- [ ] Component renders without errors
- [ ] Data loads correctly on mount
- [ ] CRUD operations work as expected
- [ ] Loading indicators display properly
- [ ] Error messages show correctly
- [ ] Redux DevTools shows correct actions
- [ ] No duplicate API calls
- [ ] Performance is same or better

---

## QUICK REFERENCE: REDUX SLICE APIS

### employeeSlice
**Thunks**:
- `fetchEmployees(params)` - Get employees list with pagination/filters
- `fetchEmployeeById(id)` - Get single employee
- `createEmployee({data, params})` - Create new employee
- `updateEmployee({id, data, params})` - Update employee
- `deleteEmployee({id, params})` - Delete employee
- `uploadEmployeesExcel({file, params})` - Bulk upload
- `fetchEmployeesByDepartment(departmentId)` - Filter by department
- `fetchEmployeesByManager(managerId)` - Filter by manager

**Selectors**:
- `state.employees.employees` - Employee array
- `state.employees.currentEmployee` - Selected employee
- `state.employees.loading` - Loading state
- `state.employees.error` - Error message
- `state.employees.pagination` - Pagination info

### departmentSlice
**Thunks**:
- `fetchDepartments(companyId?)` - Get all departments
- `fetchDepartmentById(id)` - Get single department
- `createDepartment(data)` - Create department
- `updateDepartment({id, data})` - Update department
- `deleteDepartment(id)` - Delete department

**Selectors**:
- `state.departments.departments` - Department array
- `state.departments.currentDepartment` - Selected department
- `state.departments.loading` - Loading state

### settingsSlice
**Thunks**:
- `fetchPeriodSettings()` - Get period settings
- `createPeriodSetting(data)` - Create period
- `updatePeriodSetting({id, data})` - Update period
- `deletePeriodSetting(id)` - Delete period
- `fetchReminderSettings()` - Get reminder settings
- `updateReminderSetting({id, data})` - Update reminder
- `fetchDailyReminderSettings()` - Get daily reminder
- `updateDailyReminderSetting(data)` - Update daily reminder
- `fetchRatingOptions()` - Get rating options
- `updateRatingOption({id, data})` - Update rating
- `fetchHREmailNotifications()` - Get HR email settings
- `updateHREmailNotification({id, data})` - Update HR email

**Selectors**:
- `state.settings.periodSettings` - Period settings array
- `state.settings.reminderSettings` - Reminder settings array
- `state.settings.dailyReminderSetting` - Daily reminder object
- `state.settings.ratingOptions` - Rating options array
- `state.settings.hrEmailNotifications` - HR notifications array
- `state.settings.loading` - Loading state

### statisticsSlice
**Thunks**:
- `fetchDepartmentStatistics(params)` - Get department stats
- `fetchDashboardCounts()` - Get dashboard counts
- `fetchEmployeesByCategory(params)` - Get employees by category

**Selectors**:
- `state.statistics.departmentStatistics` - Stats array
- `state.statistics.dashboardCounts` - Count object
- `state.statistics.loading` - Loading state

### kpiSlice (existing)
**Thunks**:
- `fetchKPIs(params)` - Get KPIs with filters
- `createKPI(data)` - Create new KPI
- `updateKPI({id, data})` - Update KPI
- `deleteKPI(id)` - Delete KPI

**Selectors**:
- `state.kpi.kpis` - KPI array
- `state.kpi.loading` - Loading state
- `state.kpi.error` - Error message

---

## AUTOMATED REPLACEMENT COMMANDS

For common patterns, use these bash commands to speed up migration:

### Replace statistics references
```bash
cd c:/kpi/fronted/kpi-frontend/src/pages/COMPONENT_FOLDER
sed -i 's/\bstatistics\.map\b/departmentStatistics.map/g' COMPONENT.tsx
sed -i 's/\bstatistics\.reduce\b/departmentStatistics.reduce/g' COMPONENT.tsx
sed -i 's/\bstatistics\.find\b/departmentStatistics.find/g' COMPONENT.tsx
sed -i 's/\bstatistics\.length\b/departmentStatistics.length/g' COMPONENT.tsx
sed -i 's/\bstatistics\b\s*\[/departmentStatistics[/g' COMPONENT.tsx
```

### Replace departments references
```bash
sed -i 's/\bdepartments\.find\b/departmentsList.find/g' COMPONENT.tsx
sed -i 's/\bdepartments\.map\b/departmentsList.map/g' COMPONENT.tsx
sed -i 's/\bdepartments\.filter\b/departmentsList.filter/g' COMPONENT.tsx
```

### Replace employees references
```bash
sed -i 's/\bemployees\.map\b/employees.map/g' COMPONENT.tsx  # Already correct
# Just verify employees is from Redux: const { employees } = useAppSelector(state => state.employees);
```

---

## COMMON ISSUES & SOLUTIONS

### Issue: "Property 'X' does not exist on RootState"
**Solution**: Restart TypeScript server
```
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Issue: Data not loading
**Solution**: Check Redux DevTools
1. Open Redux DevTools in browser
2. Look for your actions (pending/fulfilled/rejected)
3. Check Network tab for API calls
4. Verify dispatch is being called

### Issue: Infinite re-renders
**Solution**: Add dispatch to useEffect deps
```typescript
// Wrong
useEffect(() => {
  dispatch(fetchSomething());
}, []);  // Missing dispatch

// Correct
useEffect(() => {
  dispatch(fetchSomething());
}, [dispatch]);
```

### Issue: Stale data after update
**Solution**: Ensure Redux slice updates state correctly
```typescript
// In slice extraReducers
.addCase(updateItem.fulfilled, (state, action) => {
  const index = state.items.findIndex(item => item.id === action.payload.id);
  if (index !== -1) {
    state.items[index] = action.payload;  // ✅ Update in place
  }
})
```

### Issue: Multiple API calls on mount
**Solution**: Data is already being fetched by Redux, remove duplicate calls

---

## ESTIMATED TIME REMAINING

Based on current progress (20% complete):

| Component | Complexity | Time Estimate |
|-----------|-----------|---------------|
| Manager Dashboard | High | 2 hours |
| Employee Dashboard | Medium | 1 hour |
| HR KPIList | High | 3 hours |
| Manager KPISetting | Medium | 2 hours |
| Employee KPIList | Low | 1 hour |
| HR Settings | High | 3 hours |
| Review Pages (5) | Medium each | 5 hours total |
| Remaining Pages (40+) | Varies | 20 hours |

**Total Remaining**: ~37 hours of development work

**With 2 developers**: ~2.5 weeks
**With 3 developers**: ~2 weeks

---

## MIGRATION PRIORITIES

### Week 1 (Current)
- ✅ Security fix
- ✅ Create all Redux slices
- ✅ HR Dashboard
- ✅ Employees page
- 🔄 Manager Dashboard
- 🔲 Employee Dashboard

### Week 2
- 🔲 KPI List pages (HR, Manager, Employee)
- 🔲 Settings page (critical - lots of API calls)
- 🔲 KPI Setting/Creation pages

### Week 3
- 🔲 Review pages (Self Rating, Manager Review, Confirmation)
- 🔲 Admin pages (User Management, Company Management)
- 🔲 Profile pages

### Week 4
- 🔲 Remaining components
- 🔲 Testing and bug fixes
- 🔲 Performance optimization
- 🔲 Documentation updates

---

## SUCCESS METRICS

Track these metrics to measure migration progress:

### Code Quality
- [ ] Zero direct API calls in components (except for truly non-cacheable data)
- [ ] All data flows through Redux
- [ ] Consistent error handling across all components
- [ ] TypeScript errors: 0

### Performance
- [ ] Page load time reduced by 50%+
- [ ] API calls reduced by 50%+
- [ ] Redux DevTools shows all state changes
- [ ] No duplicate network requests

### Developer Experience
- [ ] Redux DevTools usable for debugging
- [ ] State management is predictable
- [ ] Components are easier to test
- [ ] New features easier to add

---

## FINAL NOTES

### What's Working Great
- ✅ Redux slices are comprehensive and production-ready
- ✅ Type safety is excellent
- ✅ HR Dashboard migration shows clear benefits
- ✅ Employees page migration went smoothly
- ✅ Pattern is established and repeatable

### What to Watch For
- ⚠️ Don't migrate truly non-cacheable data (notifications, real-time updates)
- ⚠️ Keep localStorage for user preferences (default period, etc.)
- ⚠️ File uploads still need FormData and direct API calls
- ⚠️ Some reports/exports might not need Redux

### Best Practices
1. **Test as you go** - Don't batch test at the end
2. **Use Redux DevTools** - It's your best debugging friend
3. **Keep PRs small** - One component per PR
4. **Update tests** - Don't leave tests broken
5. **Ask for help** - Don't get stuck for hours

---

**Ready to continue? Start with completing Manager Dashboard!** 🚀

The foundation is solid. Keep following the patterns and you'll complete this migration successfully.
