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
  const SESSION_COOKIE_NAME = 'session_id'
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
        // Cookies.set(SESSION_COOKIE_NAME, JSON.stringify(user.value), COOKIE_OPTIONS)

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
    Cookies.remove(SESSION_COOKIE_NAME, { path: '/' })
  }

  // Initialize user from API verification on app start
  const initializeAuth = async () => {
    const storedUser = Cookies.get(SESSION_COOKIE_NAME)
    if (!storedUser) {
      return // No stored user, remain unauthenticated
    }

    try {
      // Parse stored user to get email for API call
      const userData = JSON.parse(storedUser)
      if (!userData.email) {
        throw new Error('No email in stored user data')
      }

      // Verify user session with API
      isLoading.value = true
      const response = await authApi.getCurrentUser(userData.email)

      if (response.success && response.user) {
        // Update user with fresh data from API
        user.value = response.user
        // Update cookie with fresh data
        Cookies.set(SESSION_COOKIE_NAME, JSON.stringify(response.user), COOKIE_OPTIONS)
      } else {
        // Session invalid, clear local data
        throw new Error(response.error || 'Session expired')
      }
    } catch (err) {
      // Clear invalid cookie and local state
      Cookies.remove(SESSION_COOKIE_NAME, { path: '/' })
      user.value = null
      // Don't set error state during initialization - just fail silently
      console.warn('Authentication initialization failed:', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      isLoading.value = false
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