import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { isEmployee } from '../utils/roleUtils';
import api from '../services/api';

interface EmployeeDataContextType {
  sharedKpis: any[];
  sharedReviews: any[];
  sharedDepartmentFeatures: any | null;
  dataFetched: boolean;
  isLoading: boolean;
}

const EmployeeDataContext = createContext<EmployeeDataContextType | undefined>(undefined);

export const EmployeeDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [sharedKpis, setSharedKpis] = useState<any[]>([]);
  const [sharedReviews, setSharedReviews] = useState<any[]>([]);
  const [sharedDepartmentFeatures, setSharedDepartmentFeatures] = useState<any>(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fetchingRef = useRef(false);

  useEffect(() => {
    const fetchSharedData = async () => {
      if (isEmployee(user) && !dataFetched && !fetchingRef.current) {
        fetchingRef.current = true;
        setIsLoading(true);
        
        try {
          const [kpisRes, reviewsRes, deptFeaturesRes] = await Promise.all([
            api.get('/kpis'),
            api.get('/kpi-review'),
            api.get('/department-features/my-department')
          ]);

         

          const kpis = kpisRes.data.data?.kpis || kpisRes.data.kpis || [];
          const reviews = reviewsRes.data.reviews || [];

          

          setSharedKpis(kpis);
          setSharedReviews(reviews);
          setSharedDepartmentFeatures(deptFeaturesRes.data);
          setDataFetched(true);
        } catch (error) {
          // Silently fail - data will be fetched again on next load
          fetchingRef.current = false;
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSharedData();
  }, [user]);

  return (
    <EmployeeDataContext.Provider
      value={{
        sharedKpis,
        sharedReviews,
        sharedDepartmentFeatures,
        dataFetched,
        isLoading,
      }}
    >
      {children}
    </EmployeeDataContext.Provider>
  );
};

export const useEmployeeData = () => {
  const context = useContext(EmployeeDataContext);
  if (context === undefined) {
    throw new Error('useEmployeeData must be used within EmployeeDataProvider');
  }
  return context;
};
