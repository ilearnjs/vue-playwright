<template>
  <div class="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 h-24 sm:h-32">
    <div class="flex items-center h-full">
      <div class="w-10 sm:w-14 h-10 sm:h-14 bg-gray-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
        <div class="animate-spin rounded-full h-5 sm:h-6 w-5 sm:w-6 border-b-2 border-gray-400"></div>
      </div>
      <div>
        <p class="text-xs sm:text-sm text-gray-600">Total Balance</p>
        <div class="h-6 sm:h-8 bg-gray-200 rounded animate-pulse mt-1 w-24 sm:w-32"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props or emits needed for skeleton component
</script>