// types/index.ts

export interface User {
  id: number;
  name: string;
  email: string;
  profile_image?: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  published_year?: number;
  category?: string;
  pages?: number;
  language?: string;
  description?: string;
  cover_image?: string;
  quantity: number;
  available: number;
  status: 'active' | 'archived' | 'damaged';
  created_at: string;
  updated_at: string;
}

export interface Loan {
  id: number;
  user_id: number;
  book_id: number;
  loan_date: string;
  due_date: string;
  return_date?: string;
  status: 'pending' | 'approved' | 'returned' | 'rejected';
  rejection_reason?: string;
  fine: number;
  created_at: string;
  book?: Book;
}

export interface Wishlist {
  id: number;
  user_id: number;
  book_id: number;
  created_at: string;
  book?: Book;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}