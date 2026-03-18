import { redirect } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';

export default function HomePage() {
  redirect('/login');
}
