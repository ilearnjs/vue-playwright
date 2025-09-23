<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <RouterLink to="/" class="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
            Vue App
          </RouterLink>
        </div>

        <div class="flex space-x-8">
          <RouterLink
            to="/"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            active-class="text-indigo-600 font-semibold"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/about"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            active-class="text-indigo-600 font-semibold"
          >
            About
          </RouterLink>
          <RouterLink
            to="/auth"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>