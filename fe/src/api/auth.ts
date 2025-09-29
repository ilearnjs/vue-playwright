export interface User {
  id: string
  email: string
  name: string
}

export interface LoginCredentials {
  email: string
  password: string
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

export const authApi = {
  async signIn(credentials: LoginCredentials): Promise<User> {
    const response = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    return response.user
  },

  async signOut(): Promise<void> {
    await makeRequest('/api/auth/logout', {
      method: 'POST',
    })
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await makeRequest('/api/auth/me')
      return response.user || null
    } catch (error) {
      // Don't treat 401 as an error - it just means no valid session
      if (error instanceof Error && 'status' in error && (error as Error & { status: number }).status === 401) {
        return null
      }
      throw error
    }
  }
}