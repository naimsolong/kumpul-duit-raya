<template>
  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold text-white" style="background: var(--color-primary)">
    <span>{{ event.emoji }}</span>
    <span>{{ event.name }}</span>
  </span>
</template>

<script setup lang="ts">
import type { RayaEvent } from '~/stores/types'
defineProps<{ event: RayaEvent }>()
</script>
