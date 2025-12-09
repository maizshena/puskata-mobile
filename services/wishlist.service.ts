// services/wishlist.service.ts
import { Wishlist, ApiResponse } from '@/types';
import { MOCK_BOOKS } from '@/constants/MockData';

let MOCK_WISHLIST: Wishlist[] = [
  {
    id: 1,
    user_id: 1,
    book_id: 3,
    created_at: new Date().toISOString(),
    book: MOCK_BOOKS[2],
  },
];

export const wishlistService = {
  async getUserWishlist(userId: number): Promise<ApiResponse<Wishlist[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Wishlist fetched successfully',
          data: MOCK_WISHLIST,
        });
      }, 500);
    });
  },

  async addToWishlist(userId: number, bookId: number): Promise<ApiResponse<Wishlist>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const book = MOCK_BOOKS.find(b => b.id === bookId);
        const newItem: Wishlist = {
          id: Math.floor(Math.random() * 1000),
          user_id: userId,
          book_id: bookId,
          created_at: new Date().toISOString(),
          book,
        };
        MOCK_WISHLIST.push(newItem);
        resolve({
          success: true,
          message: 'Added to wishlist',
          data: newItem,
        });
      }, 500);
    });
  },

  async removeFromWishlist(wishlistId: number): Promise<ApiResponse<null>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        MOCK_WISHLIST = MOCK_WISHLIST.filter(item => item.id !== wishlistId);
        resolve({
          success: true,
          message: 'Removed from wishlist',
        });
      }, 500);
    });
  },

  async checkInWishlist(userId: number, bookId: number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const exists = MOCK_WISHLIST.some(
          item => item.user_id === userId && item.book_id === bookId
        );
        resolve(exists);
      }, 300);
    });
  },
};