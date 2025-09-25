// Dashboard-related types
export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  date: string
  timestamp: string
}

export interface BalanceResponse {
  success: boolean
  balance?: number
  error?: string
}

export interface MonthlyDataResponse {
  success: boolean
  income?: number
  expenses?: number
  error?: string
}

export interface HistoryResponse {
  success: boolean
  transactions?: Transaction[]
  error?: string
}

export interface CreateTransactionRequest {
  type: 'income' | 'expense'
  amount: number
}

export interface CreateTransactionResponse {
  success: boolean
  transaction?: Transaction
  error?: string
}

export interface UpdateTransactionRequest {
  id: string
  type: 'income' | 'expense'
  amount: number
}

export interface UpdateTransactionResponse {
  success: boolean
  transaction?: Transaction
  error?: string
}

export interface DeleteTransactionResponse {
  success: boolean
  error?: string
}

// Mock API configuration
const API_CONFIG = {
  timeout: 1000, // Simulate network delay
}

// Simulate network delay for realistic UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock dashboard API calls
export const dashboardApi = {
  /**
   * Mock get total balance API call
   */
  async getTotalBalance(): Promise<BalanceResponse> {
    try {
      await delay(600)

      return {
        success: true,
        balance: 12450.30
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get balance'
      }
    }
  },

  /**
   * Mock get monthly data API call
   */
  async getMonthlyData(): Promise<MonthlyDataResponse> {
    try {
      await delay(700)

      return {
        success: true,
        income: 5250.00,
        expenses: 2840.75
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get monthly data'
      }
    }
  },

  /**
   * Mock get transaction history API call
   */
  async getHistory(): Promise<HistoryResponse> {
    try {
      await delay(800)

      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'expense',
          amount: 87.45,
          date: 'Today',
          timestamp: '2:30 PM'
        },
        {
          id: '2',
          type: 'income',
          amount: 3250.00,
          date: 'Yesterday',
          timestamp: '9:00 AM'
        },
        {
          id: '3',
          type: 'expense',
          amount: 120.50,
          date: 'Dec 1',
          timestamp: '4:15 PM'
        }
      ]

      return {
        success: true,
        transactions: mockTransactions
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get transaction history'
      }
    }
  },

  /**
   * Mock create transaction API call
   */
  async createTransaction(data: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    try {
      await delay(1000)

      // Create new transaction with mock data
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: data.type,
        amount: data.amount,
        date: 'Today',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      return {
        success: true,
        transaction: newTransaction
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create transaction'
      }
    }
  },

  /**
   * Mock update transaction API call
   */
  async updateTransaction(data: UpdateTransactionRequest): Promise<UpdateTransactionResponse> {
    try {
      await delay(800)

      // Update transaction with mock data
      const updatedTransaction: Transaction = {
        id: data.id,
        type: data.type,
        amount: data.amount,
        date: 'Today', // In real app, this would preserve original date or update it
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      return {
        success: true,
        transaction: updatedTransaction
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update transaction'
      }
    }
  },

  /**
   * Mock delete transaction API call
   */
  async deleteTransaction(id: string): Promise<DeleteTransactionResponse> {
    try {
      await delay(500)

      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete transaction'
      }
    }
  }
}