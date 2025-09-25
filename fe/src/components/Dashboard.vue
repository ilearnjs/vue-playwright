<template>
  <main class="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-12">
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome back, {{ authStore.user?.name }}!</h1>
      <p class="text-gray-600 text-sm sm:text-base">Here's your financial overview for today.</p>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <BalanceCardSkeleton />
      <MonthlyChangeCardSkeleton />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <BalanceCard :balance="balance" />
      <MonthlyChangeCard :monthly-income="monthlyIncome" :monthly-expenses="monthlyExpenses" />
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-0">Recent Transactions</h2>
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            @click="addIncome"
            class="flex items-center justify-center px-3 sm:px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <svg class="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            <span class="hidden xs:inline">Add </span>Income
          </button>
          <button
            @click="addExpense"
            class="flex items-center justify-center px-3 sm:px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <svg class="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
            <span class="hidden xs:inline">Add </span>Expense
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="space-y-2 sm:space-y-3">
        <TransactionItemSkeleton v-for="i in 3" :key="i" />
      </div>

      <div v-else class="space-y-2 sm:space-y-3">
        <TransactionItem
          v-for="transaction in transactions"
          :key="transaction.id"
          :transaction="transaction"
          @edit="editTransaction"
          @delete="deleteTransaction"
        />
      </div>
    </div>

    <TransactionModal
      :is-open="showModal"
      :type="modalType"
      :transaction="editingTransaction"
      @close="closeModal"
      @submit="handleTransactionSubmit"
    />

    <ConfirmationModal
      :is-open="showConfirmModal"
      title="Delete Transaction"
      message="Are you sure you want to delete this transaction? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDelete"
      @cancel="closeConfirmModal"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { dashboardApi, type Transaction, type CreateTransactionRequest, type UpdateTransactionRequest } from '@/api'
import TransactionModal from './TransactionModal.vue'
import ConfirmationModal from './ConfirmationModal.vue'
import TransactionItem from './TransactionItem.vue'
import TransactionItemSkeleton from './TransactionItemSkeleton.vue'
import BalanceCard from './BalanceCard.vue'
import MonthlyChangeCard from './MonthlyChangeCard.vue'
import BalanceCardSkeleton from './BalanceCardSkeleton.vue'
import MonthlyChangeCardSkeleton from './MonthlyChangeCardSkeleton.vue'

const authStore = useAuthStore()

const isLoading = ref(true)
const balance = ref<number | null>(null)
const monthlyIncome = ref<number | null>(null)
const monthlyExpenses = ref<number | null>(null)
const transactions = ref<Transaction[]>([])


const showModal = ref(false)
const modalType = ref<'income' | 'expense'>('income')
const editingTransaction = ref<Transaction | null>(null)

const showConfirmModal = ref(false)
const transactionToDelete = ref<Transaction | null>(null)

const loadDashboardData = async () => {
  isLoading.value = true

  try {
    const [balanceResponse, monthlyDataResponse, historyResponse] = await Promise.all([
      dashboardApi.getTotalBalance(),
      dashboardApi.getMonthlyData(),
      dashboardApi.getHistory()
    ])

    if (balanceResponse.success && balanceResponse.data) {
      balance.value = balanceResponse.data.balance || 0
    }

    if (monthlyDataResponse.success && monthlyDataResponse.data) {
      monthlyIncome.value = monthlyDataResponse.data.income || 0
      monthlyExpenses.value = monthlyDataResponse.data.expenses || 0
    }

    if (historyResponse.success && historyResponse.data) {
      transactions.value = historyResponse.data || []
    }
  } catch (error) {
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

const deleteTransaction = (transaction: Transaction) => {
  transactionToDelete.value = transaction
  showConfirmModal.value = true
}

const confirmDelete = async () => {
  const transaction = transactionToDelete.value
  if (!transaction) return

  try {
    const response = await dashboardApi.deleteTransaction(transaction.id)

    if (response.success) {
      const index = transactions.value.findIndex(t => t.id === transaction.id)
      if (index !== -1) {
        transactions.value.splice(index, 1)

        if (transaction.type === 'income') {
          balance.value = (balance.value || 0) - transaction.amount
          monthlyIncome.value = (monthlyIncome.value || 0) - transaction.amount
        } else {
          balance.value = (balance.value || 0) + transaction.amount
          monthlyExpenses.value = (monthlyExpenses.value || 0) - transaction.amount
        }
      }
    } else {
      alert('Failed to delete transaction. Please try again.')
    }
  } catch (error) {
    alert('Error deleting transaction. Please try again.')
  } finally {
    closeConfirmModal()
  }
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  transactionToDelete.value = null
}

const closeModal = () => {
  showModal.value = false
  editingTransaction.value = null
}

const handleTransactionSubmit = async (data: CreateTransactionRequest & { id?: string }) => {
  try {
    if (data.id) {
      const updateData: UpdateTransactionRequest = {
        id: data.id,
        type: data.type,
        amount: data.amount,
        description: data.description
      }
      const response = await dashboardApi.updateTransaction(updateData)

      if (response.success && response.data) {
        const index = transactions.value.findIndex(t => t.id === data.id)
        if (index !== -1) {
          const oldTransaction = transactions.value[index]

          if (oldTransaction.type === 'income') {
            balance.value = (balance.value || 0) - oldTransaction.amount
            monthlyIncome.value = (monthlyIncome.value || 0) - oldTransaction.amount
          } else {
            balance.value = (balance.value || 0) + oldTransaction.amount
            monthlyExpenses.value = (monthlyExpenses.value || 0) - oldTransaction.amount
          }

          if (data.type === 'income') {
            balance.value = (balance.value || 0) + data.amount
            monthlyIncome.value = (monthlyIncome.value || 0) + data.amount
          } else {
            balance.value = (balance.value || 0) - data.amount
            monthlyExpenses.value = (monthlyExpenses.value || 0) + data.amount
          }

          transactions.value[index] = response.data
        }

        closeModal()
      } else {
      }
    } else {
      const response = await dashboardApi.createTransaction(data)

      if (response.success && response.data) {
        transactions.value.unshift(response.data)

        if (data.type === 'income') {
          balance.value = (balance.value || 0) + data.amount
          monthlyIncome.value = (monthlyIncome.value || 0) + data.amount
        } else {
          balance.value = (balance.value || 0) - data.amount
          monthlyExpenses.value = (monthlyExpenses.value || 0) + data.amount
        }

        closeModal()
      } else {
      }
    }
  } catch (error) {
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>