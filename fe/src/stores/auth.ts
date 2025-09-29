import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authApi, type User, type LoginCredentials } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)


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
      // Even if the API call fails, clear the local state
    }

    user.value = null
    error.value = null
  }

  const initializeAuth = async () => {
    isLoading.value = true
    try {
      const response = await authApi.getCurrentUser()

      if (response.success && response.user) {
        user.value = response.user
      }
    } catch (err) {
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