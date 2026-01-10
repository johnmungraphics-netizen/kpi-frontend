/**
 * Custom Hook: useLoading
 * 
 * Simplified hook for managing loading states.
 * To be implemented in Phase 1.
 */

import { useState } from 'react';

export function useLoading(initialState = false) {
  const [loading, setLoading] = useState(initialState);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  
  const withLoading = async <T,>(asyncFn: () => Promise<T>): Promise<T> => {
    startLoading();
    try {
      return await asyncFn();
    } finally {
      stopLoading();
    }
  };

  return { loading, startLoading, stopLoading, withLoading };
}

export default useLoading;
