<template>
  <header class="sticky top-0 z-50 w-full border-b border-black/5 backdrop-blur-md" style="background: var(--color-bg)cc">
    <div class="max-w-xl mx-auto flex items-center justify-between px-4 h-14">
      <!-- Logo / Home -->
      <NuxtLink to="/" class="flex items-center gap-2 font-black text-lg" style="color: var(--color-primary)">
        <span>💰</span>
        <span class="hidden sm:inline">{{ $t('common.appName') }}</span>
      </NuxtLink>

      <!-- Event switcher -->
      <div v-if="settingsStore.setupComplete && events.length > 0" class="flex-1 flex justify-center px-2">
        <select
          class="text-xs font-semibold rounded-full px-3 py-1.5 border max-w-[140px] truncate bg-white cursor-pointer"
          style="border-color: var(--color-primary); color: var(--color-primary)"
          :value="settingsStore.activeEventId"
          @change="onEventChange"
        >
          <option v-for="ev in events" :key="ev.id" :value="ev.id">
            {{ ev.emoji }} {{ ev.name }}
          </option>
        </select>
      </div>

      <!-- Right actions -->
      <div class="flex items-center gap-2">
        <LanguageToggle />
        <NuxtLink
          to="/admin"
          class="flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors"
          style="color: var(--color-primary)"
          :aria-label="$t('nav.admin')"
        >
          ⚙️
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const settingsStore = useSettingsStore()
const eventsStore = useEventsStore()
const events = computed(() => eventsStore.sortedEvents)

function onEventChange(e: Event) {
  const id = (e.target as HTMLSelectElement).value
  eventsStore.setActive(id)
}
</script>
