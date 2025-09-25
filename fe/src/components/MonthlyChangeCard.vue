<template>
  <div class="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 h-24 sm:h-32">
    <div class="flex items-center h-full">
      <div :class="[
        'w-10 sm:w-14 h-10 sm:h-14 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0',
        (monthlyChange || 0) >= 0 ? 'bg-blue-100' : 'bg-orange-100'
      ]">
        <svg :class="[
          'w-5 sm:w-6 h-5 sm:h-6',
          (monthlyChange || 0) >= 0 ? 'text-blue-600' : 'text-orange-600'
        ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="(monthlyChange || 0) >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'"></path>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-xs sm:text-sm text-gray-600">This Month's Change</p>
        <p :class="[
          'text-lg sm:text-2xl font-bold mb-1 sm:mb-2',
          (monthlyChange || 0) >= 0 ? 'text-blue-600' : 'text-orange-600'
        ]">
          {{ (monthlyChange || 0) >= 0 ? '+' : '' }}${{ monthlyChange?.toLocaleString() || '0.00' }}
        </p>
        <div class="flex justify-between text-xs sm:text-sm">
          <div class="flex items-center text-green-600">
            <svg class="w-2.5 sm:w-3 h-2.5 sm:h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            <span class="truncate">+${{ monthlyIncome?.toLocaleString() || '0.00' }}</span>
          </div>
          <div class="flex items-center text-red-600">
            <svg class="w-2.5 sm:w-3 h-2.5 sm:h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
            <span class="truncate">-${{ monthlyExpenses?.toLocaleString() || '0.00' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  monthlyIncome: number | null
  monthlyExpenses: number | null
}

const props = defineProps<Props>()

const monthlyChange = computed(() => {
  if (props.monthlyIncome === null || props.monthlyExpenses === null) return null
  return props.monthlyIncome - props.monthlyExpenses
})
</script>