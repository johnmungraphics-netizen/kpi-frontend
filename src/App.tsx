import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { initializeAuth } from './store/slices/authSlice';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Auth Pages
import { Login } from './features/auth';

// Manager Pages
import {
  ManagerDashboard,
  KPISetting,
  ManagerKPIReview,
  EmployeeSelection,
  ReviewsList,
  ManagerKPIList,
  ManagerKPIDetails,
  EmployeeKPIs,
  KPITemplates,
  KPITemplateForm,
  ApplyKPITemplate,
  MeetingScheduler,
} from './features/manager';

// Employee Pages
import {
  EmployeeDashboard,
  KPIAcknowledgement,
  KPIConfirmation,
  SelfRating,
  KPIList,
  KPIDetails,
  Reviews,
} from './features/employee';
import AcknowledgeList from './features/employee/pages/AcknowledgeList';

// HR Pages
import {
  HRDashboard,
  HRKPIList,
  HRKPIDetails,
  HRSettings,
  DepartmentDashboard,
  EmailTemplates,
  RejectedKPIManagement,
  EmployeePerformance,
} from './features/hr';

// Shared Pages
import {
  AcknowledgedKPIs,
  KPISettingCompleted,
  CompletedReviews,
  Notifications,
  EditProfile,
  Employees,
  Profile,
} from './features/shared';

// Super Admin Pages
import {
  SuperAdminDashboard,
  CompanySelection,
  CompanyOnboarding,
  AssignHrToCompany,
  CompanyManagement,
  UserManagement,
} from './features/superadmin';

// Protected Route Component (Using Redux)
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const { user: contextUser, isLoading: contextLoading } = useAuth();

  // Use Redux state if available, fallback to context during migration
  const currentUser = user || contextUser;
  const loading = isLoading || contextLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Layout Component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

function AppRoutes() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/select-company" element={<CompanySelection />} />
      
      {/* Super Admin Routes */}
      <Route
        path="/super-admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <Layout>
              <SuperAdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin/assign-hr"
        element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <Layout>
              <AssignHrToCompany />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin/company-management"
        element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <Layout>
              <CompanyManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin/user-management"
        element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <Layout>
              <UserManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboard"
        element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <Layout>
              <CompanyOnboarding />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* Manager Routes */}
      {user?.role === 'manager' && (
        <>
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <ManagerDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/kpi-setting/:employeeId"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <KPISetting />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/kpi-review/:reviewId"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <ManagerKPIReview />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/select-employee"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <EmployeeSelection />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/kpi-management"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <EmployeeSelection />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/employees"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <EmployeeSelection />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/reviews"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <ReviewsList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/kpi-list"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <ManagerKPIList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/kpi-details/:kpiId"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <ManagerKPIDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/kpi-templates"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <KPITemplates />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/kpi-templates/create"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <KPITemplateForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/kpi-templates/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <KPITemplateForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/kpi-templates/:templateId/apply"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <ApplyKPITemplate />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/employee-kpis/:employeeId"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <EmployeeKPIs />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/acknowledged-kpis"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <AcknowledgedKPIs />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/kpi-setting-completed"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <KPISettingCompleted />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/completed-reviews"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <CompletedReviews />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/schedule-meeting"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <MeetingScheduler />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/schedule-meeting/kpi/:kpiId"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <MeetingScheduler />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/schedule-meeting/review/:reviewId"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <MeetingScheduler />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/notifications"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <Layout>
                  <Notifications />
                </Layout>
              </ProtectedRoute>
            }
          />
        </>
      )}

      {/* Employee Routes */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Layout>
              <EmployeeDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/my-kpis"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Layout>
              <EmployeeDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/acknowledge"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Layout>
              <AcknowledgeList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/kpi-acknowledgement/:kpiId"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Layout>
              <KPIAcknowledgement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/kpi-confirmation/:reviewId"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Layout>
              <KPIConfirmation />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/self-rating/:kpiId"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Layout>
              <SelfRating />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/kpi-list"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Layout>
              <KPIList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/kpi-details/:kpiId"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Layout>
              <KPIDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/reviews"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Layout>
              <Reviews />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/kpi-setting-completed"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Layout>
              <KPISettingCompleted />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/completed-reviews"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Layout>
              <CompletedReviews />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* HR Routes */}
      <Route
        path="/hr/dashboard"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <Layout>
              <HRDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/kpi-list"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <Layout>
              <HRKPIList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/kpi-details/:kpiId"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <Layout>
              <HRKPIDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/acknowledged-kpis"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <Layout>
              <AcknowledgedKPIs />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/kpi-setting-completed"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <Layout>
              <KPISettingCompleted />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/completed-reviews"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <Layout>
              <CompletedReviews />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/notifications"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/settings"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <Layout>
              <HRSettings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/email-templates"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <Layout>
              <EmailTemplates />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/rejected-kpis"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <Layout>
              <RejectedKPIManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/departments"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <Layout>
              <DepartmentDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/departments"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <Layout>
              <DepartmentDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/employee-performance/:employeeId"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <Layout>
              <EmployeePerformance />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/employees"
        element={
          <ProtectedRoute allowedRoles={['hr']}>
            <Layout>
              <Employees />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/employees"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <Layout>
              <Employees />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute allowedRoles={['hr', 'manager', 'super_admin']}>
            <Layout>
              <Employees />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Shared Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute allowedRoles={['hr', 'manager']}>
            <Layout>
              <EditProfile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  const dispatch = useAppDispatch();

  // Initialize Redux auth state from localStorage on app mount
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
