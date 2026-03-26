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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded border text-sm focus:ring-2 focus:ring-[#F22F46] focus:border-[#F22F46] outline-none"
              style={{ borderColor: '#E5E7EB', color: '#1A1A1A' }}
              placeholder="Choose a username"
              required
              minLength={3}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded border text-sm focus:ring-2 focus:ring-[#F22F46] focus:border-[#F22F46] outline-none"
              style={{ borderColor: '#E5E7EB', color: '#1A1A1A' }}
              placeholder="Enter your email"
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
              placeholder="Create a password"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded border text-sm focus:ring-2 focus:ring-[#F22F46] focus:border-[#F22F46] outline-none"
              style={{ borderColor: '#E5E7EB', color: '#1A1A1A' }}
              placeholder="Confirm your password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: '#6B7280' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold" style={{ color: '#F22F46' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
