<template>
  <div class="flex items-center justify-between py-2 sm:py-3 px-1 sm:px-2 rounded-lg">
    <div class="flex items-center flex-1 min-w-0">
      <div class="w-8 sm:w-10 h-8 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
        <div class="animate-spin rounded-full h-4 sm:h-5 w-4 sm:w-5 border-b-2 border-gray-400"></div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="h-4 sm:h-5 bg-gray-200 rounded animate-pulse mb-1 w-16 sm:w-20"></div>
        <div class="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-20 sm:w-24"></div>
      </div>
    </div>
    <div class="flex items-center space-x-1 sm:space-x-4 flex-shrink-0">
      <div class="h-4 sm:h-5 bg-gray-200 rounded animate-pulse w-12 sm:w-16"></div>
      <div class="flex items-center space-x-1 sm:space-x-2">
        <div class="w-6 sm:w-8 h-6 sm:h-8 bg-gray-100 rounded"></div>
        <div class="w-6 sm:w-8 h-6 sm:h-8 bg-gray-100 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props or emits needed for skeleton component
</script>