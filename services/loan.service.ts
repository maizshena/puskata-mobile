// services/loan.service.ts
import { Loan, ApiResponse } from '@/types';
import { MOCK_BOOKS } from '@/constants/MockData';

let MOCK_LOANS: Loan[] = [
  {
    id: 1,
    user_id: 1,
    book_id: 1,
    loan_date: '2024-01-01',
    due_date: '2024-01-15',
    status: 'approved',
    fine: 0,
    created_at: new Date().toISOString(),
    book: MOCK_BOOKS[0],
  },
  {
    id: 2,
    user_id: 1,
    book_id: 2,
    loan_date: '2024-01-05',
    due_date: '2024-01-19',
    return_date: '2024-01-18',
    status: 'returned',
    fine: 0,
    created_at: new Date().toISOString(),
    book: MOCK_BOOKS[1],
  },
];

export const loanService = {
  async getUserLoans(userId: number): Promise<ApiResponse<Loan[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Loans fetched successfully',
          data: MOCK_LOANS,
        });
      }, 500);
    });
  },

  async borrowBook(userId: number, bookId: number): Promise<ApiResponse<Loan>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const book = MOCK_BOOKS.find(b => b.id === bookId);
        const newLoan: Loan = {
          id: Math.floor(Math.random() * 1000),
          user_id: userId,
          book_id: bookId,
          loan_date: new Date().toISOString().split('T')[0],
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'pending',
          fine: 0,
          created_at: new Date().toISOString(),
          book,
        };
        MOCK_LOANS.push(newLoan);
        resolve({
          success: true,
          message: 'Borrow request submitted successfully',
          data: newLoan,
        });
      }, 1000);
    });
  },

  async returnBook(loanId: number): Promise<ApiResponse<Loan>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const loanIndex = MOCK_LOANS.findIndex(l => l.id === loanId);
        if (loanIndex !== -1) {
          MOCK_LOANS[loanIndex] = {
            ...MOCK_LOANS[loanIndex],
            return_date: new Date().toISOString().split('T')[0],
            status: 'returned',
          };
          resolve({
            success: true,
            message: 'Book returned successfully',
            data: MOCK_LOANS[loanIndex],
          });
        } else {
          resolve({
            success: false,
            message: 'Loan not found',
          });
        }
      }, 1000);
    });
  },
};