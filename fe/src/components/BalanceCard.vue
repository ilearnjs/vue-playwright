<template>
  <div class="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 h-24 sm:h-32">
    <div class="flex items-center h-full">
      <div class="w-10 sm:w-14 h-10 sm:h-14 bg-green-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
        <svg class="w-5 sm:w-6 h-5 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
        </svg>
      </div>
      <div>
        <p class="text-xs sm:text-sm text-gray-600">Total Balance</p>
        <p class="text-xl sm:text-2xl font-bold text-gray-900">${{ balance?.toLocaleString() || '0.00' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  balance: number | null
}

defineProps<Props>()
</script>