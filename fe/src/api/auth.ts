// Auth-related types
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

// Authentication API calls
export const authApi = {
  /**
   * Sign in API call to backend
   */
  async signIn(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await makeRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign in failed'
      }
    }
  },

  /**
   * Sign out API call to backend
   */
  async signOut(): Promise<{ success: boolean }> {
    try {
      const response = await makeRequest('/api/auth/logout', {
        method: 'POST',
      })

      return response
    } catch (error) {
      return { success: false }
    }
  },

  /**
   * Get current user API call to backend
   */
  async getCurrentUser(email: string): Promise<LoginResponse> {
    try {
      const response = await makeRequest('/api/auth/me')
      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get current user'
      }
    }
  }
}