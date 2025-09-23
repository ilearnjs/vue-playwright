import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { authApi, type User, type LoginCredentials } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  // Cookie configuration
  const COOKIE_NAME = 'auth_user'
  const COOKIE_OPTIONS = {
    expires: 7, // 7 days
    secure: location.protocol === 'https:', // Only send over HTTPS in production
    sameSite: 'strict' as const, // CSRF protection
    path: '/'
  }

  // Sign in using API
  const signIn = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authApi.signIn(credentials)

      if (response.success && response.user) {
        user.value = response.user

        // Store in cookie for persistence
        Cookies.set(COOKIE_NAME, JSON.stringify(user.value), COOKIE_OPTIONS)

        return true
      } else {
        error.value = response.error || 'Sign in failed'
        return false
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Sign in failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const signOut = async () => {
    try {
      // Call API to invalidate session on server
      await authApi.signOut()
    } catch {
      // Continue with local sign out even if API call fails
    }

    // Clear local state and cookie
    user.value = null
    error.value = null
    Cookies.remove(COOKIE_NAME, { path: '/' })
  }

  // Initialize user from cookie on app start
  const initializeAuth = () => {
    const storedUser = Cookies.get(COOKIE_NAME)
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        // Remove invalid cookie
        Cookies.remove(COOKIE_NAME, { path: '/' })
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