import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authApi, type User, type LoginCredentials } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)


  const signIn = async (credentials: LoginCredentials): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const userData = await authApi.signIn(credentials)
      user.value = userData
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Sign in failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const signOut = async () => {
    try {
      await authApi.signOut()
    } catch {
      // Even if the API call fails, clear the local state
    } finally {
      user.value = null
      error.value = null
    }
  }

  const initializeAuth = async () => {
    isLoading.value = true
    try {
      const userData = await authApi.getCurrentUser()
      user.value = userData
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