'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    const success = await register(username, email, password);
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
          <h2 className="text-xl font-semibold text-devoteam-dark">Create Account</h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-devoteam-red/30 rounded p-3 mb-4">
            <p className="text-devoteam-red text-sm text-center font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Choose a username"
              required
              minLength={3}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-devoteam-dark mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded border border-gray-200 text-devoteam-dark placeholder-gray-400 focus:outline-none focus:border-devoteam-dark focus:ring-1 focus:ring-devoteam-dark/20"
              placeholder="Enter your email"
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
              placeholder="Create a password"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-devoteam-dark mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded border border-gray-200 text-devoteam-dark placeholder-gray-400 focus:outline-none focus:border-devoteam-dark focus:ring-1 focus:ring-devoteam-dark/20"
              placeholder="Confirm your password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-devoteam-red hover:bg-red-600 text-white font-semibold rounded transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-gray-500 text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-devoteam-red hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
