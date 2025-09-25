// User types
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

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  user?: UserResponse
  error?: string
}

// Transaction types
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
  type: 'income' | 'expense'
  amount: number
  description?: string
  date: string
  timestamp: string
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

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Fastify types
export interface AuthenticatedRequest {
  user?: UserResponse
}