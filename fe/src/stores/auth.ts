import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface User {
  id: string
  email: string
  name: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  // Mock API call for sign in
  const signIn = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock validation - in real app this would be handled by backend
      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        user.value = {
          id: '1',
          email: credentials.email,
          name: 'Demo User'
        }

        // Store in localStorage for persistence
        localStorage.setItem('auth_user', JSON.stringify(user.value))

        return true
      } else {
        throw new Error('Invalid email or password')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Sign in failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const signOut = () => {
    user.value = null
    error.value = null
    localStorage.removeItem('auth_user')
  }

  // Initialize user from localStorage on app start
  const initializeAuth = () => {
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        localStorage.removeItem('auth_user')
      }
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    signIn,
    signOut,
    initializeAuth,
    clearError
  }
})