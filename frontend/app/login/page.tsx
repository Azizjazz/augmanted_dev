'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      router.push('/board');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="bg-white rounded-lg p-8 w-full max-w-md" style={{ border: '1px solid #E5E7EB' }}>
        {/* Devoteam Logo - Centered */}
        <div className="text-center mb-8">
          <img 
            src="/assets/devoteam-logo.png" 
            alt="Devoteam" 
            className="h-12 w-auto mx-auto mb-4"
          />
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#FEF2F2', border: '1px solid #F22F46' }}>
            <p className="text-center text-sm font-medium" style={{ color: '#F22F46' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded border text-sm"
              style={{ borderColor: '#E5E7EB', color: '#1A1A1A' }}
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded border text-sm focus:ring-2 focus:ring-[#F22F46] focus:border-[#F22F46] outline-none"
              style={{ borderColor: '#E5E7EB', color: '#1A1A1A' }}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: '#6B7280' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold" style={{ color: '#F22F46' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
