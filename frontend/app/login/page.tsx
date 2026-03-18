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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          TaskBoard Pro
        </h1>
        <h2 className="text-xl text-white/90 text-center mb-6">Sign In</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
            <p className="text-red-200 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-white/80 text-sm mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white/80 text-sm mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-white/70 text-center mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
