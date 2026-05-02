/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
  createdAt?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  error?: string;
}

interface RegisterResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  error?: string;
}

interface MeResponse {
  success: boolean;
  data: {
    user: User;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // FIXED: Use useCallback to prevent infinite loops
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  // FIXED: Use useCallback for refreshAccessToken
  const refreshAccessToken = useCallback(async (refreshToken: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        setUser(data.data.user);
        return true;
      } else {
        clearAuthData();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      clearAuthData();
      return false;
    }
  }, [clearAuthData]);

  // FIXED: Use useCallback for checkAuth
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('🔍 Checking auth, token exists:', !!token);
      
      if (!token) {
        console.log('❌ No token found');
        setIsLoading(false);
        return;
      }

      console.log('📡 Fetching user data from /auth/me');
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data: MeResponse = await response.json();
      console.log('📡 Auth response:', { ok: response.ok, success: data.success, hasUser: !!data.data?.user });

      if (response.ok && data.success && data.data?.user) {
        console.log('✅ User authenticated:', data.data.user.email);
        setUser(data.data.user);
      } else {
        console.log('⚠️ Token invalid, trying to refresh...');
        // Token might be expired, try to refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          await refreshAccessToken(refreshToken);
        } else {
          console.log('❌ No refresh token, clearing auth');
          clearAuthData();
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, [refreshAccessToken, clearAuthData]);

  // FIXED: Only run checkAuth once on mount
  useEffect(() => {
    checkAuth();
  }, []); // Empty dependency array - only run once

 // contexts/AuthContext.tsx - የተሻሻለው login ተግባር

const login = async (email: string, password: string) => {
  // ✅ በመጀመሪያ የግቤቶች ማረጋገጫ (Input Validation)
  if (!email || !email.trim()) {
    notifications.show({
      title: 'Validation Error',
      message: 'Email is required',
      color: 'red',
    });
    return { 
      success: false, 
      error: 'Email is required' 
    };
  }

  if (!password || !password.trim()) {
    notifications.show({
      title: 'Validation Error',
      message: 'Password is required',
      color: 'red',
    });
    return { 
      success: false, 
      error: 'Password is required' 
    };
  }

  // ✅ የኢሜይል ቅርጸት ማረጋገጫ (Email Format Validation)
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  if (!emailRegex.test(email)) {
    notifications.show({
      title: 'Validation Error',
      message: 'Please enter a valid email address',
      color: 'red',
    });
    return { 
      success: false, 
      error: 'Invalid email format' 
    };
  }

  // ✅ የይለፍ ቃል ርዝመት ማረጋገጫ (Password Length Validation)
  if (password.length < 6) {
    notifications.show({
      title: 'Validation Error',
      message: 'Password must be at least 6 characters',
      color: 'red',
    });
    return { 
      success: false, 
      error: 'Password too short' 
    };
  }

  try {
    console.log('🔐 Attempting login for:', email);
    
    // ✅ Request Timeout ያክሉ
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.trim(), password }),
      credentials: 'include',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data: LoginResponse = await response.json();
    console.log('🔐 Login response:', { 
      ok: response.ok, 
      success: data.success, 
      role: data.data?.user?.role,
      status: response.status 
    });

    // ✅ የተለያዩ የስህተት ሁኔታዎችን ማስተናገድ
    if (!response.ok) {
      let errorMessage = 'Login failed';
      
      switch (response.status) {
        case 400:
          errorMessage = 'Invalid request. Please check your credentials.';
          break;
        case 401:
          errorMessage = 'Invalid email or password. Please try again.';
          break;
        case 403:
          errorMessage = 'Your account is locked. Please contact support.';
          break;
        case 404:
          errorMessage = 'Account not found. Please register first.';
          break;
        case 429:
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = data.error || 'Login failed. Please try again.';
      }
      
      notifications.show({
        title: 'Login Failed',
        message: errorMessage,
        color: 'red',
      });
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }

    if (!data.success || !data.data) {
      notifications.show({
        title: 'Login Failed',
        message: data.error || 'Invalid email or password',
        color: 'red',
      });
      return { 
        success: false, 
        error: data.error || 'Invalid email or password' 
      };
    }

    // ✅ የተጠቃሚ መረጃ ማረጋገጫ (User Data Validation)
    if (!data.data.user || !data.data.user.id || !data.data.user.email) {
      console.error('Invalid user data received:', data.data.user);
      notifications.show({
        title: 'Login Failed',
        message: 'Invalid user data received',
        color: 'red',
      });
      return { 
        success: false, 
        error: 'Invalid user data' 
      };
    }

    // ✅ የToken ማረጋገጫ (Token Validation)
    if (!data.data.accessToken || !data.data.refreshToken) {
      console.error('Missing tokens:', { 
        hasAccessToken: !!data.data.accessToken, 
        hasRefreshToken: !!data.data.refreshToken 
      });
      notifications.show({
        title: 'Login Failed',
        message: 'Authentication tokens missing',
        color: 'red',
      });
      return { 
        success: false, 
        error: 'Authentication failed' 
      };
    }

    // ✅ Tokens ን ማከማቸት
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    
    // ✅ ተጠቃሚ ማዘመን
    setUser(data.data.user);
    
    notifications.show({
      title: 'Success',
      message: `Welcome back, ${data.data.user.fullName || data.data.user.email}!`,
      color: 'green',
    });
    
    // ✅ በሚገባ ያረጋገጠ የማዞሪያ አመክንዮ
    console.log('🔐 User role:', data.data.user.role);
    
    // ወደ ኋላ ለመመለስ callback URL ካለ
    const callbackUrl = localStorage.getItem('callbackUrl');
    if (callbackUrl) {
      localStorage.removeItem('callbackUrl');
      router.push(callbackUrl);
      return { success: true };
    }
    
    // በሚገባ በተገለጸ ሚና መሰረት ማዞር
    switch (data.data.user.role?.toLowerCase()) {
      case 'admin':
        router.push('/dashboard');
        break;
      case 'client':
        router.push('/');
        break;
      default:
        console.warn('Unknown role:', data.data.user.role);
        router.push('/');
    }
    
    return { success: true };
    
  } catch (error: any) {
    console.error('Login error:', error);
    
    // ✅ የተለያዩ የስህተት አይነቶችን ማስተናገድ
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout. Please check your connection.';
    } else if (error.message === 'Failed to fetch') {
      errorMessage = 'Cannot connect to server. Please check if the backend is running.';
    } else if (error.message?.includes('NetworkError')) {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.response?.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    }
    
    notifications.show({
      title: 'Login Error',
      message: errorMessage,
      color: 'red',
    });
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result: RegisterResponse = await response.json();

      if (!response.ok || !result.success) {
        return { 
          success: false, 
          error: result.error || 'Registration failed' 
        };
      }

      notifications.show({
        title: 'Success',
        message: 'Account created successfully',
        color: 'green',
      });

      // Auto login after registration
      const loginResult = await login(data.email, data.password);
      
      if (!loginResult.success) {
        // If auto login fails, redirect to login page
        router.push('/login');
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      router.push('/');
      
      notifications.show({
        title: 'Success',
        message: 'Logged out successfully',
        color: 'green',
      });
    }
  };

  const getCurrentUser = async (): Promise<User | null> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;

      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data: MeResponse = await response.json();

      if (response.ok && data.success && data.data?.user) {
        return data.data.user;
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        register, 
        logout, 
        getCurrentUser,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};