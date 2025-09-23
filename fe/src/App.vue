<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppNavigation from './components/AppNavigation.vue'
import { computed, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const showNavigation = computed(() => route.name !== 'auth')

onMounted(() => {
  authStore.initializeAuth()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppNavigation v-if="showNavigation" />
    <RouterView />
  </div>
</template>
