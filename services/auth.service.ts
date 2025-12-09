import { AuthResponse } from '@/types';

let mockUsers: Array<{
  id: number;
  name: string;
  email: string;
  password: string;
  profile_image?: string;
  role: 'admin' | 'user';
  created_at: string;
}> = [
  {
    id: 1,
    name: 'Demo User',
    email: 'carmen@puskata.com',
    password: 'carmen123',
    profile_image: 'https://i.pravatar.cc/150?img=12',
    role: 'user',
    created_at: new Date().toISOString(),
  },
];

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          
          resolve({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword,
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
        const existingUser = mockUsers.find((u) => u.email === email);

        if (existingUser) {
          resolve({
            success: false,
            message: 'Email already registered',
          });
          return;
        }

        const newUser = {
          id: mockUsers.length + 1,
          name,
          email,
          password,
          profile_image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
          role: 'user' as const,
          created_at: new Date().toISOString(),
        };

        mockUsers.push(newUser);

        const { password: _, ...userWithoutPassword } = newUser;

        resolve({
          success: true,
          message: 'Registration successful',
          user: userWithoutPassword,
          token: 'mock-jwt-token-' + Date.now(),
        });
      }, 1000);
    });
  },
};