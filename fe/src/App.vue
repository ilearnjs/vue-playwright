<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppNavigation from './components/AppNavigation.vue'
import { computed } from 'vue'

const route = useRoute()
const showNavigation = computed(() => route.name !== 'auth')
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppNavigation v-if="showNavigation" />
    <RouterView />
  </div>
</template>
