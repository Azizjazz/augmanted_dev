'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_URL = `${API_BASE}/api/v1`;
const TOKEN_KEY = 'taskboard_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || 'Login failed');
        return false;
      }

      const data = await response.json();
      localStorage.setItem(TOKEN_KEY, data.access_token);
      setToken(data.access_token);
      await fetchUser(data.access_token);
      return true;
    } catch (err) {
      setError('Network error. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || 'Registration failed');
        return false;
      }

      return await login(username, password);
    } catch (err) {
      setError('Network error. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
