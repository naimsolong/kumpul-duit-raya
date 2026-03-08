<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 backdrop-blur-md" style="background: var(--color-bg)ee">
    <div class="max-w-xl mx-auto flex items-center justify-around h-16">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center gap-0.5 flex-1 py-2 transition-all tap-target"
        :class="isActive(item.to) ? 'active-nav' : 'text-gray-400'"
        :aria-label="item.label"
      >
        <span class="text-xl">{{ item.icon }}</span>
        <span class="text-xs font-semibold">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

const navItems = computed(() => [
  { to: '/', icon: '🏠', label: t('nav.home') },
  { to: '/leaderboard', icon: '🏆', label: t('nav.leaderboard') },
  { to: '/admin', icon: '⚙️', label: t('nav.admin') },
])

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.active-nav {
  color: var(--color-primary);
}
.active-nav span:first-child {
  filter: drop-shadow(0 0 4px var(--color-primary));
}
</style>
