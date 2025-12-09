// services/book.service.ts
import { Book, ApiResponse } from '@/types';
import { MOCK_BOOKS } from '@/constants/MockData';
import { API_CONFIG, apiRequest } from './api.config';

const USE_REAL_API = false; // Set true untuk pakai real API

export const bookService = {
  async getBooks(): Promise<ApiResponse<Book[]>> {
    if (USE_REAL_API) {
      try {
        const response = await apiRequest(API_CONFIG.ENDPOINTS.BOOKS);
        return response;
      } catch (error) {
        return { success: false, message: 'Failed to fetch books' };
      }
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Books fetched successfully',
            data: MOCK_BOOKS,
          });
        }, 500);
      });
    }
  },

  async getBookById(id: number): Promise<ApiResponse<Book>> {
    if (USE_REAL_API) {
      try {
        const response = await apiRequest(API_CONFIG.ENDPOINTS.BOOK_BY_ID(id));
        return response;
      } catch (error) {
        return { success: false, message: 'Book not found' };
      }
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          const book = MOCK_BOOKS.find((b) => b.id === id);
          if (book) {
            resolve({
              success: true,
              message: 'Book fetched successfully',
              data: book,
            });
          } else {
            resolve({
              success: false,
              message: 'Book not found',
            });
          }
        }, 500);
      });
    }
  },

  async searchBooks(query: string): Promise<ApiResponse<Book[]>> {
    if (USE_REAL_API) {
      try {
        const response = await apiRequest(
          `${API_CONFIG.ENDPOINTS.SEARCH_BOOKS}?q=${encodeURIComponent(query)}`
        );
        return response;
      } catch (error) {
        return { success: false, message: 'Search failed' };
      }
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          const results = MOCK_BOOKS.filter(
            (book) =>
              book.title.toLowerCase().includes(query.toLowerCase()) ||
              book.author.toLowerCase().includes(query.toLowerCase())
          );
          resolve({
            success: true,
            message: 'Search completed',
            data: results,
          });
        }, 500);
      });
    }
  },

  async getBooksByCategory(category: string): Promise<ApiResponse<Book[]>> {
    if (USE_REAL_API) {
      try {
        const response = await apiRequest(
          `${API_CONFIG.ENDPOINTS.BOOKS_BY_CATEGORY}?category=${encodeURIComponent(category)}`
        );
        return response;
      } catch (error) {
        return { success: false, message: 'Failed to fetch books' };
      }
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          const results =
            category === 'All'
              ? MOCK_BOOKS
              : MOCK_BOOKS.filter((book) => book.category === category);
          resolve({
            success: true,
            message: 'Books fetched successfully',
            data: results,
          });
        }, 500);
      });
    }
  },
};