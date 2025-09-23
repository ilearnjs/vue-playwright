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
  }
}