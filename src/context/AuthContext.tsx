import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Company } from '../types/index';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  companies: Company[];
  hasMultipleCompanies: boolean;
  selectedCompany: Company | null;
  login: (payrollNumber: string, nationalId: string, password?: string) => Promise<{ hasMultipleCompanies: boolean }>;
  loginWithEmail: (email: string, password: string) => Promise<{ hasMultipleCompanies: boolean }>;
  selectCompany: (companyId: number) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [hasMultipleCompanies, setHasMultipleCompanies] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedCompanies = localStorage.getItem('companies');
    const storedSelectedCompany = localStorage.getItem('selectedCompany');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      
      if (storedCompanies) {
        const parsedCompanies = JSON.parse(storedCompanies);
        setCompanies(parsedCompanies);
        setHasMultipleCompanies(parsedCompanies.length > 1);
      }
      
      if (storedSelectedCompany) {
        setSelectedCompany(JSON.parse(storedSelectedCompany));
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (payrollNumber: string, nationalId: string, password?: string) => {
    try {
      const response = await api.post('/auth/login', {
        payrollNumber,
        nationalId,
        password,
      });

      const { token: newToken, user: newUser, companies: userCompanies, hasMultipleCompanies: multiple } = response.data;

      setToken(newToken);
      setUser(newUser);
      setCompanies(userCompanies || []);
      setHasMultipleCompanies(multiple || false);
      
      // Set selected company (primary or first)
      if (userCompanies && userCompanies.length > 0) {
        const primary = userCompanies.find((c: Company) => c.is_primary) || userCompanies[0];
        setSelectedCompany(primary);
        localStorage.setItem('selectedCompany', JSON.stringify(primary));
      }
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('companies', JSON.stringify(userCompanies || []));
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { hasMultipleCompanies: multiple || false };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token: newToken, user: newUser, companies: userCompanies, hasMultipleCompanies: multiple } = response.data;

      setToken(newToken);
      setUser(newUser);
      setCompanies(userCompanies || []);
      setHasMultipleCompanies(multiple || false);
      
      // Set selected company (primary or first)
      if (userCompanies && userCompanies.length > 0) {
        const primary = userCompanies.find((c: Company) => c.is_primary) || userCompanies[0];
        setSelectedCompany(primary);
        localStorage.setItem('selectedCompany', JSON.stringify(primary));
      }
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('companies', JSON.stringify(userCompanies || []));
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { hasMultipleCompanies: multiple || false };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const selectCompany = async (companyId: number) => {
    try {
      const response = await api.post('/auth/select-company', { companyId });
      const { token: newToken } = response.data;
      
      setToken(newToken);
      const company = companies.find(c => c.id === companyId);
      if (company) {
        setSelectedCompany(company);
        localStorage.setItem('selectedCompany', JSON.stringify(company));
      }
      
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to select company');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCompanies([]);
    setHasMultipleCompanies(false);
    setSelectedCompany(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('companies');
    localStorage.removeItem('selectedCompany');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      companies,
      hasMultipleCompanies,
      selectedCompany,
      login, 
      loginWithEmail, 
      selectCompany,
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

