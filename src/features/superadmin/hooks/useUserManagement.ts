import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { userManagementService, User, UserFilters } from '../services/userManagementService';

export const useUserManagement = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  
  // Filters
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [companyFilter, setCompanyFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, companyFilter, searchQuery]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [usersData, companiesData] = await Promise.all([
        userManagementService.fetchAllUsers(),
        userManagementService.fetchCompanies(),
      ]);
      
      setUsers(usersData);
      setCompanies(companiesData);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const filters: UserFilters = {};
      
      if (roleFilter) filters.role = roleFilter;
      if (companyFilter) filters.company = companyFilter;
      if (searchQuery) filters.search = searchQuery;

      const data = await userManagementService.fetchAllUsers(filters);
      setUsers(data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch users');
    }
  };

  const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
    try {
      setActionLoading(userId);
      const newStatus = !currentStatus;
      
      await userManagementService.toggleUserStatus(userId, newStatus);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: newStatus } : user
      ));
      
      toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(userId);
      
      await userManagementService.deleteUser(userId);
      
      // Remove from local state
      setUsers(users.filter(user => user.id !== userId));
      
      toast.success('User deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetFilters = () => {
    setRoleFilter('');
    setCompanyFilter('');
    setSearchQuery('');
  };

  const handleBack = () => {
    navigate('/super-admin/dashboard');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'hr':
        return 'bg-blue-100 text-blue-700';
      case 'manager':
        return 'bg-green-100 text-green-700';
      case 'employee':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return {
    users,
    companies,
    loading,
    actionLoading,
    roleFilter,
    setRoleFilter,
    companyFilter,
    setCompanyFilter,
    searchQuery,
    setSearchQuery,
    handleToggleStatus,
    handleDeleteUser,
    handleResetFilters,
    handleBack,
    getRoleBadgeColor,
  };
};