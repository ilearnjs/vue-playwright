export interface User {
  id: string
  email: string
  name: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

export interface UserResponse {
  id: string
  email: string
  name: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface Transaction {
  id: string
  userId: string
  type: 'income' | 'expense'
  amount: number
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface TransactionResponse {
  id: string
  userId: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
}

export interface CreateTransactionRequest {
  type: 'income' | 'expense'
  amount: number
  description?: string
}

export interface UpdateTransactionRequest {
  type?: 'income' | 'expense'
  amount?: number
  description?: string
}

export interface AuthenticatedRequest {
  user?: UserResponse
}