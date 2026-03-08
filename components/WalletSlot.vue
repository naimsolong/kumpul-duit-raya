<template>
  <div class="relative flex flex-col items-center">
    <!-- Wallet -->
    <div
      ref="walletRef"
      class="relative flex flex-col items-center justify-center rounded-2xl transition-all duration-200 cursor-default"
      :class="[isBouncing ? 'animate-wallet-bounce' : '', isGlowing ? 'animate-glow-pulse' : '']"
      style="width: 140px; height: 110px; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); box-shadow: 0 8px 32px var(--color-primary)66"
    >
      <!-- Wallet body -->
      <div class="text-center">
        <div style="font-size: 52px; line-height: 1;">👝</div>
      </div>
      <!-- Slot line -->
      <div
        class="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/30"
        style="width: 60px; height: 5px;"
      />
    </div>

    <!-- Floating +amount label -->
    <Transition name="float">
      <div
        v-if="floatLabel"
        class="absolute -top-10 left-1/2 -translate-x-1/2 font-black text-lg whitespace-nowrap pointer-events-none z-20"
        style="color: var(--color-primary); text-shadow: 0 1px 4px rgba(0,0,0,0.15);"
      >
        +{{ floatLabel }}
      </div>
    </Transition>

    <!-- Confetti dots -->
    <div v-if="showConfetti" class="absolute inset-0 pointer-events-none overflow-visible" aria-hidden="true">
      <span
        v-for="dot in confettiDots"
        :key="dot.id"
        class="absolute rounded-full animate-confetti-pop"
        :style="dot.style"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatMYR } from '~/utils/currency'

const isBouncing = ref(false)
const isGlowing = ref(false)
const floatLabel = ref('')
const showConfetti = ref(false)
const confettiDots = ref<{ id: number; style: Record<string, string> }[]>([])

const COLORS = ['#fbbf24', '#34d399', '#f87171', '#a78bfa', '#60a5fa', '#fb923c']

function trigger(amountSen: number) {
  // Bounce + glow
  isBouncing.value = true
  isGlowing.value = true
  setTimeout(() => { isBouncing.value = false }, 520)
  setTimeout(() => { isGlowing.value = false }, 1600)

  // Float label
  floatLabel.value = formatMYR(amountSen)
  setTimeout(() => { floatLabel.value = '' }, 900)

  // Confetti
  showConfetti.value = true
  confettiDots.value = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    style: {
      width: `${6 + Math.random() * 8}px`,
      height: `${6 + Math.random() * 8}px`,
      backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      top: `${20 + Math.random() * 60}%`,
      left: `${10 + Math.random() * 80}%`,
      animationDelay: `${Math.random() * 0.2}s`,
    },
  }))
  setTimeout(() => { showConfetti.value = false }, 700)
}

defineExpose({ trigger })
</script>

<style scoped>
.float-enter-active { animation: float-up 0.85s ease-out forwards; }
.float-leave-active { display: none; }
</style>
