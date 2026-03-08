<template>
  <div
    class="flex items-center justify-center rounded-full font-bold select-none flex-shrink-0"
    :style="{ backgroundColor: color, width: sizeMap[size], height: sizeMap[size] }"
  >
    <span :style="{ fontSize: fontSizeMap[size] }">{{ avatar }}</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  avatar: string
  color: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  size: 'md',
})

const sizeMap = { sm: '32px', md: '44px', lg: '56px', xl: '80px' }
const fontSizeMap = { sm: '16px', md: '22px', lg: '28px', xl: '40px' }
</script>
