/**
 * Custom Hook: useNotification
 * 
 * Hook for displaying toast notifications with full implementation.
 * Supports success, error, warning, and info messages with customizable duration.
 */

import { useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface ShowOptions {
  duration?: number;
  type?: NotificationType;
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const show = useCallback((message: string, options: ShowOptions = {}) => {
    const { duration = 5000, type = 'info' } = options;
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setNotifications(prev => [...prev, { id, message, type, duration }]);

    // Auto-dismiss after duration (unless duration is 0 for persistent)
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const success = useCallback((message: string, duration?: number) => 
    show(message, { type: 'success', duration }), [show]);
  
  const error = useCallback((message: string, duration?: number) => 
    show(message, { type: 'error', duration }), [show]);
  
  const info = useCallback((message: string, duration?: number) => 
    show(message, { type: 'info', duration }), [show]);
  
  const warning = useCallback((message: string, duration?: number) => 
    show(message, { type: 'warning', duration }), [show]);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return { 
    notifications, 
    show, 
    success, 
    error, 
    info, 
    warning, 
    dismiss,
    dismissAll 
  };
}

export default useNotification;
