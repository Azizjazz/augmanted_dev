import type { Metadata } from 'next';
import { TaskProvider } from '@/context/TaskContext';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaskBoard Pro',
  description: 'A premium Kanban board with Glassmorphism UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TaskProvider>
            {children}
          </TaskProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
