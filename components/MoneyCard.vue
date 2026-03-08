<template>
  <button
    class="relative overflow-hidden rounded-xl select-none tap-target active:scale-95 transition-transform duration-100 focus:outline-none focus:ring-2 focus:ring-white/50"
    :class="[denomination.type === 'coin' ? 'rounded-full' : 'rounded-xl', isSliding ? 'animate-slide-in pointer-events-none' : '']"
    :style="cardStyle"
    @click="handleTap"
    :aria-label="denomination.label"
  >
    <!-- Shimmer overlay -->
    <div class="absolute inset-0 note-shimmer opacity-30 rounded-[inherit]" />

    <!-- Coin layout -->
    <template v-if="denomination.type === 'coin'">
      <div class="relative z-10 flex flex-col items-center justify-center p-3" :style="coinSize">
        <span class="font-black text-white leading-none" :style="{ fontSize: coinFontSize }">
          {{ denomination.label.replace(' sen', '') }}
        </span>
        <span class="text-white/80 font-semibold leading-none mt-0.5" style="font-size: 9px">SEN</span>
      </div>
    </template>

    <!-- Note layout -->
    <template v-else>
      <div class="relative z-10 flex flex-col justify-between p-3 h-full">
        <div class="flex justify-between items-start">
          <span class="text-white/70 text-xs font-medium">MALAYSIA</span>
          <span class="text-white/70 text-xs">🏛</span>
        </div>
        <div class="flex items-end justify-between">
          <span class="font-black text-white leading-none" :style="noteFontSize">
            {{ denomination.label }}
          </span>
          <span class="text-white/60 text-xs font-medium">RINGGIT</span>
        </div>
      </div>
    </template>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Denomination } from '~/utils/currency'

const props = defineProps<{ denomination: Denomination }>()
const emit = defineEmits<{ slide: [denomination: Denomination] }>()

const isSliding = ref(false)

const cardStyle = computed(() => ({
  background: props.denomination.bgGradient,
  boxShadow: `0 4px 12px ${props.denomination.color}66`,
}))

const coinSize = { width: '72px', height: '72px' }
const coinFontSize = computed(() => props.denomination.value >= 20 ? '18px' : '16px')
const noteFontSize = computed(() => ({
  fontSize: props.denomination.value >= 5000 ? '22px' : '20px',
}))

function handleTap() {
  if (isSliding.value) return
  isSliding.value = true
  emit('slide', props.denomination)
  setTimeout(() => { isSliding.value = false }, 520)
}
</script>
