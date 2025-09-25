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

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

// HTTP client with credentials
const makeRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Dashboard API calls
export const dashboardApi = {
  /**
   * Get total balance API call
   */
  async getTotalBalance(): Promise<BalanceResponse> {
    try {
      const response = await makeRequest('/api/dashboard/balance')
      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get balance'
      }
    }
  },

  /**
   * Get monthly data API call
   */
  async getMonthlyData(): Promise<MonthlyDataResponse> {
    try {
      const response = await makeRequest('/api/dashboard/monthly-data')
      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get monthly data'
      }
    }
  },

  /**
   * Get transaction history API call
   */
  async getHistory(): Promise<HistoryResponse> {
    try {
      const response = await makeRequest('/api/dashboard/transactions')
      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get transaction history'
      }
    }
  },

  /**
   * Create transaction API call
   */
  async createTransaction(data: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    try {
      const response = await makeRequest('/api/dashboard/transactions', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create transaction'
      }
    }
  },

  /**
   * Update transaction API call
   */
  async updateTransaction(data: UpdateTransactionRequest): Promise<UpdateTransactionResponse> {
    try {
      const { id, ...updateData } = data
      const response = await makeRequest(`/api/dashboard/transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update transaction'
      }
    }
  },

  /**
   * Delete transaction API call
   */
  async deleteTransaction(id: string): Promise<DeleteTransactionResponse> {
    try {
      const response = await makeRequest(`/api/dashboard/transactions/${id}`, {
        method: 'DELETE',
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete transaction'
      }
    }
  }
}