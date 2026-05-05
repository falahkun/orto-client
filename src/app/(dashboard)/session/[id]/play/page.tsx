'use client';

import { useStore } from '@/store/useStore';
import SetupPhase from './SetupPhase';
import ExecutionPhase from './ExecutionPhase';

export default function PlayPage() {
  const { session } = useStore();

  return (
    <div className="space-y-6">
      {!session.isActive ? (
        <SetupPhase />
      ) : (
        <ExecutionPhase />
      )}
    </div>
  );
}
