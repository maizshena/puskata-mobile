// services/auth.service.ts
import { AuthResponse } from '@/types';
import { MOCK_USER } from '@/constants/MockData';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'user@puskata.com' && password === 'password') {
          resolve({
            success: true,
            message: 'Login successful',
            user: MOCK_USER,
            token: 'mock-jwt-token-' + Date.now(),
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid email or password',
          });
        }
      }, 1000);
    });
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          ...MOCK_USER,
          id: Math.floor(Math.random() * 1000),
          name,
          email,
        };
        resolve({
          success: true,
          message: 'Registration successful',
          user: newUser,
          token: 'mock-jwt-token-' + Date.now(),
        });
      }, 1000);
    });
  },
};