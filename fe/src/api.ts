export interface User {
  id: string
  email: string
  name: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  user?: User
  error?: string
}

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

export interface ExpensesResponse {
  success: boolean
  expenses?: number
  error?: string
}

export interface HistoryResponse {
  success: boolean
  transactions?: Transaction[]
  error?: string
}

// Mock API configuration
const API_CONFIG = {
  timeout: 1000, // Simulate network delay
}

// Simulate network delay for realistic UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock authentication API calls
export const authApi = {
  /**
   * Mock sign in API call
   * In production, this would make an HTTP request to the backend
   */
  async signIn(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Simulate API delay
      await delay(API_CONFIG.timeout)

      // Mock validation - in real app this would be handled by backend
      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        const user: User = {
          id: '1',
          email: credentials.email,
          name: 'Demo User'
        }

        return {
          success: true,
          user
        }
      } else {
        return {
          success: false,
          error: 'Invalid email or password'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign in failed'
      }
    }
  },

  /**
   * Mock sign out API call
   * In production, this would invalidate the session on the server
   */
  async signOut(): Promise<{ success: boolean }> {
    try {
      // Simulate API delay
      await delay(500)

      // Mock successful sign out
      return { success: true }
    } catch {
      return { success: false }
    }
  },

  /**
   * Mock get current user API call
   * In production, this would fetch user info from the server using session/token
   */
  async getCurrentUser(email: string): Promise<LoginResponse> {
    try {
      // Simulate API delay
      await delay(800)

      // Mock user lookup - in real app this would validate session and fetch user data
      if (email === 'demo@example.com') {
        const user: User = {
          id: '1',
          email: email,
          name: 'Demo User'
        }

        return {
          success: true,
          user
        }
      } else {
        return {
          success: false,
          error: 'User not found or session expired'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get current user'
      }
    }
  }
}

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
   * Mock get month's expenses API call
   */
  async getMonthsExpenses(): Promise<ExpensesResponse> {
    try {
      await delay(700)

      return {
        success: true,
        expenses: 2840.75
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get expenses'
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
  }
}