<template>
  <div data-testid="transaction-item" class="flex items-center justify-between py-2 sm:py-3 px-1 sm:px-2 rounded-lg hover:bg-gray-50 group">
    <div class="flex items-center flex-1 min-w-0">
      <div :class="[
        'w-8 sm:w-10 h-8 sm:h-10 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0',
        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
      ]">
        <svg :class="[
          'w-4 sm:w-5 h-4 sm:h-5',
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
      <div class="flex-1 min-w-0">
        <p class="font-medium text-gray-900 text-sm sm:text-base">{{ transaction.description }}</p>
        <p class="text-xs sm:text-sm text-gray-500 truncate">{{ new Date(transaction.date).toLocaleDateString() }}</p>
      </div>
    </div>

    <div class="flex items-center space-x-1 sm:space-x-4 flex-shrink-0">
      <p :class="[
        'font-semibold text-sm sm:text-base',
        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
      ]">
        {{ transaction.type === 'income' ? '+' : '-' }}${{ transaction.amount.toLocaleString() }}
      </p>

      <!-- Action buttons (always visible on mobile, hover on desktop) -->
      <div class="flex items-center space-x-1 sm:space-x-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          data-testid="edit-transaction-button"
          @click="$emit('edit', transaction)"
          class="p-1 sm:p-1.5 text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600"
          title="Edit transaction"
        >
          <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
        <button
          data-testid="delete-transaction-button"
          @click="$emit('delete', transaction)"
          class="p-1 sm:p-1.5 text-gray-400 hover:text-red-600 focus:outline-none focus:text-red-600"
          title="Delete transaction"
        >
          <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from '@/api'

interface Props {
  transaction: Transaction
}

interface Emits {
  (e: 'edit', transaction: Transaction): void
  (e: 'delete', transaction: Transaction): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>