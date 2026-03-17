'use client';

import { AuthProvider } from '@/context/AuthContext';
import { StatsProvider } from '@/context/StatsContext';
import { TaskProvider } from '@/context/TaskContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TaskProvider>
        <StatsProvider>{children}</StatsProvider>
      </TaskProvider>
    </AuthProvider>
  );
}
