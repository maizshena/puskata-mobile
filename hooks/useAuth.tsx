// hooks/useAuth.ts
import { authService } from '@/services/auth.service';
import { User } from '@/types';
import { storage } from '@/utils/storage';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await storage.getToken();
      const userData = await storage.getUser();
      
      if (token && userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    if (response.success && response.user && response.token) {
      await storage.setToken(response.token);
      await storage.setUser(response.user);
      setUser(response.user);
      setIsAuthenticated(true);
    }
    return response;
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await authService.register(name, email, password);
    if (response.success && response.user && response.token) {
      await storage.setToken(response.token);
      await storage.setUser(response.user);
      setUser(response.user);
      setIsAuthenticated(true);
    }
    return response;
  };

  const logout = async () => {
    await storage.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      await storage.setUser(updatedUser);
      setUser(updatedUser);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };
};