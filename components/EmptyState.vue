<template>
  <div class="flex flex-col items-center justify-center py-12 px-6 text-center">
    <div class="text-6xl mb-4">{{ icon }}</div>
    <h3 class="font-bold text-lg text-gray-700 mb-1">{{ title }}</h3>
    <p v-if="description" class="text-sm text-gray-400 mb-4 max-w-xs">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  description?: string
}>()
</script>
