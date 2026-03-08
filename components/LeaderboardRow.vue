<template>
  <div
    class="flex items-center gap-3 rounded-2xl p-3 transition-all duration-300"
    :class="rankClass"
  >
    <!-- Rank badge -->
    <div class="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full font-black text-sm" :class="rankBadgeClass">
      <span v-if="entry.rank === 1">👑</span>
      <span v-else-if="entry.rank === 2">🥈</span>
      <span v-else-if="entry.rank === 3">🥉</span>
      <span v-else class="text-gray-500">{{ entry.rank }}</span>
    </div>

    <!-- Avatar -->
    <MemberAvatar :avatar="entry.member.avatar" :color="entry.member.color" size="md" />

    <!-- Name + bar -->
    <div class="flex-1 min-w-0">
      <p class="font-bold truncate text-sm" :class="entry.rank === 1 ? 'text-yellow-700' : 'text-gray-800'">
        {{ entry.member.name }}
      </p>
      <div class="mt-1 h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-700"
          :style="{ width: `${entry.share}%`, background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }"
        />
      </div>
    </div>

    <!-- Amount -->
    <div class="flex-shrink-0 text-right">
      <p class="font-black text-sm" style="color: var(--color-primary)">{{ entry.totalFormatted }}</p>
      <p class="text-xs text-gray-400">{{ entry.share }}%</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LeaderboardEntry } from '~/composables/useLeaderboard'

const props = defineProps<{ entry: LeaderboardEntry }>()

const rankClass = computed(() => {
  if (props.entry.rank === 1) return 'bg-yellow-50 border-2 border-yellow-300 shadow-md'
  if (props.entry.rank === 2) return 'bg-slate-50 border border-slate-200'
  if (props.entry.rank === 3) return 'bg-orange-50 border border-orange-200'
  return 'bg-white border border-gray-100'
})

const rankBadgeClass = computed(() => {
  if (props.entry.rank === 1) return 'bg-yellow-100 text-xl'
  if (props.entry.rank === 2) return 'bg-slate-100 text-xl'
  if (props.entry.rank === 3) return 'bg-orange-100 text-xl'
  return 'bg-gray-100'
})
</script>
