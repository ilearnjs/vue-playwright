export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
  userId: string
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
    const response = await makeRequest('/api/dashboard/balance')
    return response.data || { balance: 0 }
  },

  async getMonthlyData(): Promise<MonthlyData> {
    const response = await makeRequest('/api/dashboard/monthly-data')
    return response.data || { change: 0, income: 0, expenses: 0 }
  },

  async getHistory(): Promise<Transaction[]> {
    const response = await makeRequest('/api/dashboard/transactions')
    return response.data || []
  },

  async createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
    const response = await makeRequest('/api/dashboard/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.data
  },

  async updateTransaction(data: UpdateTransactionRequest): Promise<Transaction> {
    const { id, ...updateData } = data
    const response = await makeRequest(`/api/dashboard/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })
    return response.data
  },

  async deleteTransaction(id: string): Promise<void> {
    await makeRequest(`/api/dashboard/transactions/${id}`, {
      method: 'DELETE',
    })
  }
}