<template>
  <!-- Modal backdrop -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"
    @click="closeModal"
  >
    <!-- Modal content -->
    <div
      class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md"
      @click.stop
    >
      <!-- Modal header -->
      <div class="flex justify-between items-center mb-4 sm:mb-6">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-900">
          {{ isEdit ? 'Edit' : 'Add' }} {{ type === 'income' ? 'Income' : 'Expense' }}
        </h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
        >
          <svg class="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Error message -->
      <div v-if="error" class="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-xs sm:text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <div class="mb-4 sm:mb-4">
          <label for="amount" class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Amount ($)
          </label>
          <input
            id="amount"
            v-model="amount"
            type="number"
            step="0.01"
            min="0"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-base sm:text-sm"
            placeholder="0.00"
          />
        </div>

        <!-- Form buttons -->
        <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            type="button"
            @click="closeModal"
            :disabled="isLoading"
            class="px-4 py-2.5 sm:py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoading || !amount || Number(amount) <= 0"
            :class="[
              'px-4 py-2.5 sm:py-2 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm',
              isEdit
                ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                : type === 'income'
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
            ]"
          >
            <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? (isEdit ? 'Updating...' : 'Adding...') : `${isEdit ? 'Update' : 'Add'} ${type === 'income' ? 'Income' : 'Expense'}` }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  date: string
  timestamp: string
}

interface Props {
  isOpen: boolean
  type: 'income' | 'expense'
  transaction?: Transaction | null
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: { type: 'income' | 'expense'; amount: number; id?: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const amount = ref('')
const isLoading = ref(false)
const error = ref('')

const isEdit = computed(() => !!props.transaction)

const closeModal = () => {
  emit('close')
}

const handleSubmit = async () => {
  if (!amount.value || Number(amount.value) <= 0) {
    error.value = 'Please enter a valid amount'
    return
  }

  error.value = ''
  isLoading.value = true

  try {
    emit('submit', {
      type: props.type,
      amount: Number(amount.value),
      id: props.transaction?.id
    })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to save transaction'
  } finally {
    isLoading.value = false
  }
}

// Reset form when modal opens/closes
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    // Reset form when opening
    if (props.transaction) {
      // Edit mode - populate with existing data
      amount.value = props.transaction.amount.toString()
    } else {
      // Add mode - reset form
      amount.value = ''
    }
    error.value = ''
    isLoading.value = false
  }
})
</script>