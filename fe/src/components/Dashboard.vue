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
          <div class="flex-1">
            <p class="text-sm text-gray-600">This Month's Change</p>
            <div class="h-8 bg-gray-200 rounded animate-pulse mt-1 mb-2"></div>
            <div class="flex justify-between">
              <div class="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
              <div class="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
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
          <div :class="[
            'w-12 h-12 rounded-lg flex items-center justify-center mr-4',
            (monthlyChange || 0) >= 0 ? 'bg-blue-100' : 'bg-orange-100'
          ]">
            <svg :class="[
              'w-6 h-6',
              (monthlyChange || 0) >= 0 ? 'text-blue-600' : 'text-orange-600'
            ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="(monthlyChange || 0) >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'"></path>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm text-gray-600">This Month's Change</p>
            <p :class="[
              'text-2xl font-bold mb-2',
              (monthlyChange || 0) >= 0 ? 'text-blue-600' : 'text-orange-600'
            ]">
              {{ (monthlyChange || 0) >= 0 ? '+' : '' }}${{ monthlyChange?.toLocaleString() || '0.00' }}
            </p>
            <div class="flex justify-between text-sm">
              <div class="flex items-center text-green-600">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                </svg>
                <span>+${{ monthlyIncome?.toLocaleString() || '0.00' }}</span>
              </div>
              <div class="flex items-center text-red-600">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
                <span>-${{ monthlyExpenses?.toLocaleString() || '0.00' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Recent Transactions</h2>
        <div class="flex space-x-3">
          <button
            @click="addIncome"
            class="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            Add Income
          </button>
          <button
            @click="addExpense"
            class="flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
            Add Expense
          </button>
        </div>
      </div>

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
        <div v-for="transaction in transactions" :key="transaction.id" class="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 group">
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

          <div class="flex items-center space-x-4">
            <p :class="[
              'font-semibold',
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            ]">
              {{ transaction.type === 'income' ? '+' : '-' }}${{ transaction.amount.toLocaleString() }}
            </p>

            <!-- Action buttons (shown on hover) -->
            <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                @click="editTransaction(transaction)"
                class="p-1 text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600"
                title="Edit transaction"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                @click="deleteTransaction(transaction)"
                class="p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:text-red-600"
                title="Delete transaction"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Modal -->
    <TransactionModal
      :is-open="showModal"
      :type="modalType"
      :transaction="editingTransaction"
      @close="closeModal"
      @submit="handleTransactionSubmit"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { dashboardApi, type Transaction, type CreateTransactionRequest, type UpdateTransactionRequest } from '@/api'
import TransactionModal from './TransactionModal.vue'

const authStore = useAuthStore()

const isLoading = ref(true)
const balance = ref<number | null>(null)
const monthlyIncome = ref<number | null>(null)
const monthlyExpenses = ref<number | null>(null)
const transactions = ref<Transaction[]>([])

// Computed property for monthly change
const monthlyChange = computed(() => {
  if (monthlyIncome.value === null || monthlyExpenses.value === null) return null
  return monthlyIncome.value - monthlyExpenses.value
})

// Modal state
const showModal = ref(false)
const modalType = ref<'income' | 'expense'>('income')
const editingTransaction = ref<Transaction | null>(null)

const loadDashboardData = async () => {
  isLoading.value = true

  try {
    // Load all dashboard data in parallel
    const [balanceResponse, monthlyDataResponse, historyResponse] = await Promise.all([
      dashboardApi.getTotalBalance(),
      dashboardApi.getMonthlyData(),
      dashboardApi.getHistory()
    ])

    if (balanceResponse.success) {
      balance.value = balanceResponse.balance || 0
    }

    if (monthlyDataResponse.success) {
      monthlyIncome.value = monthlyDataResponse.income || 0
      monthlyExpenses.value = monthlyDataResponse.expenses || 0
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

const addIncome = () => {
  editingTransaction.value = null
  modalType.value = 'income'
  showModal.value = true
}

const addExpense = () => {
  editingTransaction.value = null
  modalType.value = 'expense'
  showModal.value = true
}

const editTransaction = (transaction: Transaction) => {
  editingTransaction.value = transaction
  modalType.value = transaction.type
  showModal.value = true
}

const deleteTransaction = async (transaction: Transaction) => {
  if (!confirm('Are you sure you want to delete this transaction?')) {
    return
  }

  try {
    const response = await dashboardApi.deleteTransaction(transaction.id)

    if (response.success) {
      // Remove transaction from list
      const index = transactions.value.findIndex(t => t.id === transaction.id)
      if (index !== -1) {
        transactions.value.splice(index, 1)

        // Update balance and monthly data
        if (transaction.type === 'income') {
          balance.value = (balance.value || 0) - transaction.amount
          monthlyIncome.value = (monthlyIncome.value || 0) - transaction.amount
        } else {
          balance.value = (balance.value || 0) + transaction.amount
          monthlyExpenses.value = (monthlyExpenses.value || 0) - transaction.amount
        }
      }
    } else {
      console.error('Failed to delete transaction:', response.error)
      alert('Failed to delete transaction. Please try again.')
    }
  } catch (error) {
    console.error('Error deleting transaction:', error)
    alert('Error deleting transaction. Please try again.')
  }
}

const closeModal = () => {
  showModal.value = false
  editingTransaction.value = null
}

const handleTransactionSubmit = async (data: CreateTransactionRequest & { id?: string }) => {
  try {
    if (data.id) {
      // Edit existing transaction
      const updateData: UpdateTransactionRequest = {
        id: data.id,
        type: data.type,
        amount: data.amount
      }
      const response = await dashboardApi.updateTransaction(updateData)

      if (response.success && response.transaction) {
        // Find and update transaction in list
        const index = transactions.value.findIndex(t => t.id === data.id)
        if (index !== -1) {
          const oldTransaction = transactions.value[index]

          // Reverse old transaction effect on balance and monthly data
          if (oldTransaction.type === 'income') {
            balance.value = (balance.value || 0) - oldTransaction.amount
            monthlyIncome.value = (monthlyIncome.value || 0) - oldTransaction.amount
          } else {
            balance.value = (balance.value || 0) + oldTransaction.amount
            monthlyExpenses.value = (monthlyExpenses.value || 0) - oldTransaction.amount
          }

          // Apply new transaction effect
          if (data.type === 'income') {
            balance.value = (balance.value || 0) + data.amount
            monthlyIncome.value = (monthlyIncome.value || 0) + data.amount
          } else {
            balance.value = (balance.value || 0) - data.amount
            monthlyExpenses.value = (monthlyExpenses.value || 0) + data.amount
          }

          // Update transaction in list
          transactions.value[index] = response.transaction
        }

        closeModal()
      } else {
        console.error('Failed to update transaction:', response.error)
      }
    } else {
      // Create new transaction
      const response = await dashboardApi.createTransaction(data)

      if (response.success && response.transaction) {
        // Add new transaction to the beginning of the list
        transactions.value.unshift(response.transaction)

        // Update balance and monthly data
        if (data.type === 'income') {
          balance.value = (balance.value || 0) + data.amount
          monthlyIncome.value = (monthlyIncome.value || 0) + data.amount
        } else {
          balance.value = (balance.value || 0) - data.amount
          monthlyExpenses.value = (monthlyExpenses.value || 0) + data.amount
        }

        closeModal()
      } else {
        console.error('Failed to create transaction:', response.error)
      }
    }
  } catch (error) {
    console.error('Error saving transaction:', error)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>