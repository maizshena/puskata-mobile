// services/api.config.ts
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // Ganti dengan URL backend kamu
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    
    // Books
    BOOKS: '/books',
    BOOK_BY_ID: (id: number) => `/books/${id}`,
    SEARCH_BOOKS: '/books/search',
    BOOKS_BY_CATEGORY: '/books/category',
    
    // Loans
    USER_LOANS: (userId: number) => `/loans/user/${userId}`,
    BORROW_BOOK: '/loans/borrow',
    RETURN_BOOK: (loanId: number) => `/loans/return/${loanId}`,
    
    // Wishlist
    USER_WISHLIST: (userId: number) => `/wishlist/user/${userId}`,
    ADD_WISHLIST: '/wishlist/add',
    REMOVE_WISHLIST: (id: number) => `/wishlist/${id}`,
    CHECK_WISHLIST: '/wishlist/check',
  },
};

// Helper untuk membuat request
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};