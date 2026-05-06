'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export default function StorageCleaner() {
  const resetState = useStore((state) => state.resetState);

  useEffect(() => {
    // 1. Clear Zustand in-memory state
    resetState();
    
    // 2. Clear all local storage
    localStorage.clear();
    
    console.log('Zustand state and local storage cleared on session entry');
  }, [resetState]);

  return null;
}
