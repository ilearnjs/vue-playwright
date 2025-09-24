<template>
  <main class="min-h-screen flex items-center justify-center py-6 sm:py-12 px-3 sm:px-4 lg:px-8">
    <div class="max-w-md w-full space-y-6 sm:space-y-8">
      <div>
        <div class="text-center mb-6 sm:mb-8">
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">FinanceTracker</h1>
          <p class="text-base sm:text-lg text-gray-600">Take control of your financial future</p>
        </div>

        <h2 class="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-xs sm:text-sm text-gray-600">
          Use demo credentials:
          <br class="sm:hidden">
          <span class="font-mono bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">demo@example.com</span> / <span class="font-mono bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">password</span>
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="authStore.error" class="rounded-md bg-red-50 p-3 sm:p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-4 sm:h-5 w-4 sm:w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-2 sm:ml-3">
            <h3 class="text-xs sm:text-sm font-medium text-red-800">
              {{ authStore.error }}
            </h3>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
        <div class="rounded-md shadow-sm space-y-3 sm:space-y-4">
          <div>
            <label for="email" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              :disabled="authStore.isLoading"
              class="appearance-none relative block w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label for="password" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              :disabled="authStore.isLoading"
              class="appearance-none relative block w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div class="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              :disabled="authStore.isLoading"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:cursor-not-allowed"
            />
            <label for="remember-me" class="ml-2 block text-xs sm:text-sm text-gray-900">
              Remember me
            </label>
          </div>
          <div class="text-xs sm:text-sm">
            <RouterLink to="/about" class="font-medium text-indigo-600 hover:text-indigo-500">
              Learn more about FinanceTracker
            </RouterLink>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.isLoading || !email || !password"
            class="group relative w-full flex justify-center py-2.5 sm:py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-4 sm:h-5 w-4 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ authStore.isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    return
  }

  const success = await authStore.signIn({
    email: email.value,
    password: password.value
  })

  if (success) {
    router.push('/')
  }
}
</script>