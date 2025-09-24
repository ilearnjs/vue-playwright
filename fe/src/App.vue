<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Show loading during auth initialization -->
    <div v-if="authStore.isLoading && !authStore.user" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Initializing...</p>
      </div>
    </div>

    <!-- Main app content -->
    <div v-else>
      <AppNavigation v-if="showNavigation" />
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavigation from './components/AppNavigation.vue'
import { computed, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const showNavigation = computed(() => authStore.isAuthenticated)

onMounted(async () => {
  await authStore.initializeAuth()
})
</script>
