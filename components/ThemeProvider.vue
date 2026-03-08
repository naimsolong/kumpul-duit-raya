<template>
  <slot />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from '~/composables/useTheme'

const { applyActiveTheme } = useTheme()
onMounted(applyActiveTheme)
</script>
