<template>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome back, {{ authStore.user?.name }}!</h1>
      <p class="text-gray-600">Here's your financial overview for today.</p>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Balance</p>
            <div class="h-8 bg-gray-200 rounded animate-pulse mt-1"></div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
          </div>
          <div>
            <p class="text-sm text-gray-600">This Month's Expenses</p>
            <div class="h-8 bg-gray-200 rounded animate-pulse mt-1"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data loaded -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Balance</p>
            <p class="text-2xl font-bold text-gray-900">${{ balance?.toLocaleString() || '0.00' }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">This Month's Expenses</p>
            <p class="text-2xl font-bold text-gray-900">${{ expenses?.toLocaleString() || '0.00' }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>

      <!-- Transactions loading state -->
      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="flex items-center justify-between py-2">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
            </div>
            <div>
              <div class="h-4 bg-gray-200 rounded animate-pulse mb-1 w-20"></div>
              <div class="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>
          </div>
          <div class="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>
      </div>

      <!-- Transactions loaded -->
      <div v-else class="space-y-3">
        <div v-for="transaction in transactions" :key="transaction.id" class="flex items-center justify-between py-2">
          <div class="flex items-center">
            <div :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center mr-3',
              transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
            ]">
              <svg :class="[
                'w-5 h-5',
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="transaction.type === 'income' ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'"
                ></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ transaction.type === 'income' ? 'Income' : 'Expense' }}</p>
              <p class="text-sm text-gray-500">{{ transaction.date }}, {{ transaction.timestamp }}</p>
            </div>
          </div>
          <p :class="[
            'font-semibold',
            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
          ]">
            {{ transaction.type === 'income' ? '+' : '-' }}${{ transaction.amount.toLocaleString() }}
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { dashboardApi, type Transaction } from '@/api'

const authStore = useAuthStore()

const isLoading = ref(true)
const balance = ref<number | null>(null)
const expenses = ref<number | null>(null)
const transactions = ref<Transaction[]>([])

const loadDashboardData = async () => {
  isLoading.value = true

  try {
    // Load all dashboard data in parallel
    const [balanceResponse, expensesResponse, historyResponse] = await Promise.all([
      dashboardApi.getTotalBalance(),
      dashboardApi.getMonthsExpenses(),
      dashboardApi.getHistory()
    ])

    if (balanceResponse.success) {
      balance.value = balanceResponse.balance || 0
    }

    if (expensesResponse.success) {
      expenses.value = expensesResponse.expenses || 0
    }

    if (historyResponse.success) {
      transactions.value = historyResponse.transactions || []
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>