import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { authApi, type User, type LoginCredentials } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  const SESSION_COOKIE_NAME = 'session_id'
  const COOKIE_OPTIONS = {
    expires: 7,
    secure: location.protocol === 'https:',
    sameSite: 'strict' as const,
    path: '/'
  }

  const signIn = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authApi.signIn(credentials)

      if (response.success && response.user) {
        user.value = response.user


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
      await authApi.signOut()
    } catch {
    }

    user.value = null
    error.value = null
    Cookies.remove(SESSION_COOKIE_NAME, { path: '/' })
  }

  const initializeAuth = async () => {
    const storedUser = Cookies.get(SESSION_COOKIE_NAME)
    if (!storedUser) {
      return
    }

    try {
      const userData = JSON.parse(storedUser)
      if (!userData.email) {
        throw new Error('No email in stored user data')
      }

      isLoading.value = true
      const response = await authApi.getCurrentUser(userData.email)

      if (response.success && response.user) {
        user.value = response.user
        Cookies.set(SESSION_COOKIE_NAME, JSON.stringify(response.user), COOKIE_OPTIONS)
      } else {
        throw new Error(response.error || 'Session expired')
      }
    } catch (err) {
      Cookies.remove(SESSION_COOKIE_NAME, { path: '/' })
      user.value = null
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