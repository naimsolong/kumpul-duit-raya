<template>
  <div class="space-y-4">
    <div class="text-center py-4">
      <h1 class="text-2xl font-black" style="color: var(--color-primary)">{{ $t('leaderboard.title') }}</h1>
      <p class="text-gray-400 text-sm">{{ $t('leaderboard.subtitle') }}</p>
    </div>

    <!-- Total pool -->
    <div v-if="entries.length > 0" class="rounded-2xl p-4 text-center text-white" style="background: linear-gradient(135deg, var(--color-primary), var(--color-secondary))">
      <p class="text-white/70 text-xs font-semibold uppercase tracking-wide">{{ $t('common.total') }}</p>
      <p class="text-3xl font-black mt-1">{{ eventTotalFormatted }}</p>
    </div>

    <!-- Leaderboard rows -->
    <div v-if="entries.length > 0" class="space-y-2">
      <LeaderboardRow v-for="entry in entries" :key="entry.member.id" :entry="entry" />
    </div>

    <EmptyState v-else
      icon="🏆"
      :title="$t('leaderboard.noData')"
      :description="$t('leaderboard.noDataDesc')"
    />
  </div>
</template>

<script setup lang="ts">
const { entries, eventTotalFormatted } = useLeaderboard()
</script>
