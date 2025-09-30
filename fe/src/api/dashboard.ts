export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
}

export interface BalanceData {
  balance: number
}

export interface MonthlyData {
  change: number
  income: number
  expenses: number
}

export interface CreateTransactionRequest {
  type: 'income' | 'expense'
  amount: number
  description: string
}

export interface UpdateTransactionRequest {
  id: string
  type?: 'income' | 'expense'
  amount?: number
  description?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

const makeRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }

  // Only set Content-Type if there's a body
  if (options.body) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`) as Error & { status: number }
    error.status = response.status
    throw error
  }

  return response.json()
}

export const dashboardApi = {
  async getTotalBalance(): Promise<BalanceData> {
    return await makeRequest('/api/dashboard/balance')
  },

  async getMonthlyData(): Promise<MonthlyData> {
    return await makeRequest('/api/dashboard/monthly-data')
  },

  async getHistory(): Promise<Transaction[]> {
    return await makeRequest('/api/dashboard/transactions')
  },

  async createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
    return await makeRequest('/api/dashboard/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateTransaction(data: UpdateTransactionRequest): Promise<Transaction> {
    const { id, ...updateData } = data
    return await makeRequest(`/api/dashboard/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })
  },

  async deleteTransaction(id: string): Promise<void> {
    await makeRequest(`/api/dashboard/transactions/${id}`, {
      method: 'DELETE',
    })
  }
}