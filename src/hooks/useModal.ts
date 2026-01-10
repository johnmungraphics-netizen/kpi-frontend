/**
 * Custom Hook: useModal
 * 
 * Hook for managing modal open/close states.
 * Eliminates 10+ instances of duplicated modal state logic.
 * To be implemented in Phase 1.
 */

import { useState } from 'react';

export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  return { isOpen, open, close, toggle };
}

export default useModal;
