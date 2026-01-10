/**
 * Toast Context
 * 
 * Global context for toast notifications accessible throughout the app.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useNotification, NotificationType } from '../hooks/useNotification';
import { ToastContainer } from '../components/common/Toast';

interface ToastContextType {
  show: (message: string, options?: { duration?: number; type?: NotificationType }) => string;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const notification = useNotification();

  return (
    <ToastContext.Provider value={notification}>
      {children}
      <ToastContainer 
        toasts={notification.notifications} 
        onClose={notification.dismiss}
        position="top-right"
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
