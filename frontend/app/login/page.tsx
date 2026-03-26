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
    <div className="min-h-screen flex items-center justify-center bg-devoteam-grey p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Devoteam Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-devoteam-dark font-bold text-2xl tracking-tight">devoteam</span>
            <span className="text-devoteam-red font-bold text-2xl">.</span>
          </div>
          <h2 className="text-xl font-semibold text-devoteam-dark">Sign In</h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-devoteam-red/30 rounded p-3 mb-4">
            <p className="text-devoteam-red text-sm text-center font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-devoteam-dark mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded border border-gray-200 text-devoteam-dark placeholder-gray-400 focus:outline-none focus:border-devoteam-dark focus:ring-1 focus:ring-devoteam-dark/20"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-devoteam-dark mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded border border-gray-200 text-devoteam-dark placeholder-gray-400 focus:outline-none focus:border-devoteam-dark focus:ring-1 focus:ring-devoteam-dark/20"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-devoteam-red hover:bg-red-600 text-white font-semibold rounded transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-gray-500 text-center mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-devoteam-red hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
