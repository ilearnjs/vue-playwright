<template>
  <!-- Modal backdrop -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"
    @click="handleCancel"
  >
    <!-- Modal content -->
    <div
      class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md"
      @click.stop
    >
      <!-- Modal header -->
      <div class="flex items-center mb-4 sm:mb-6">
        <div class="flex-shrink-0">
          <svg class="w-8 h-8 sm:w-10 sm:h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <div class="ml-3 sm:ml-4">
          <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
            {{ title }}
          </h3>
        </div>
      </div>

      <!-- Modal message -->
      <div class="mb-4 sm:mb-6">
        <p class="text-sm sm:text-base text-gray-700">
          {{ message }}
        </p>
      </div>

      <!-- Modal buttons -->
      <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2.5 sm:py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm font-medium"
        >
          {{ cancelText }}
        </button>
        <button
          type="button"
          @click="handleConfirm"
          class="px-4 py-2.5 sm:py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-sm font-medium"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  message: 'Are you sure you want to continue?',
  confirmText: 'Confirm',
  cancelText: 'Cancel'
})

const emit = defineEmits<Emits>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>