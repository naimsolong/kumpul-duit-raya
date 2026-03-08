<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-black" style="color: var(--color-primary)">{{ $t('admin.manageEvents') }}</h1>
      <NuxtLink to="/admin/events/new"
        class="px-4 py-2 rounded-xl font-bold text-white text-sm"
        style="background: var(--color-primary)"
      >+ {{ $t('admin.createEvent') }}</NuxtLink>
    </div>

    <div v-if="events.length > 0" class="space-y-3">
      <div v-for="ev in events" :key="ev.id"
        class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
      >
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" :style="{ background: `linear-gradient(135deg, ${ev.theme.primary}, ${ev.theme.secondary})` }">
            {{ ev.emoji }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="font-bold text-gray-800 truncate">{{ ev.name }}</p>
              <span v-if="settingsStore.activeEventId === ev.id"
                class="text-xs px-2 py-0.5 rounded-full font-semibold text-white"
                style="background: var(--color-primary)"
              >{{ $t('admin.active') }}</span>
            </div>
            <p class="text-xs text-gray-400">{{ ev.year }}</p>
          </div>
        </div>
        <div class="flex gap-2 mt-3">
          <button v-if="settingsStore.activeEventId !== ev.id"
            class="flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-colors"
            style="border-color: var(--color-primary); color: var(--color-primary)"
            @click="setActive(ev.id)"
          >{{ $t('admin.setActive') }}</button>
          <NuxtLink :to="`/admin/events/${ev.id}`"
            class="flex-1 py-2 rounded-xl text-xs font-bold text-center border-2 border-gray-200 text-gray-600"
          >{{ $t('common.edit') }}</NuxtLink>
          <button class="px-3 py-2 rounded-xl text-xs font-bold border-2 border-red-100 text-red-400 hover:bg-red-50 transition-colors"
            @click="deleteEvent(ev.id)"
          >{{ $t('common.delete') }}</button>
        </div>
      </div>
    </div>

    <EmptyState v-else icon="🌙" :title="$t('admin.noEvents')" />
  </div>
</template>

<script setup lang="ts">
const eventsStore = useEventsStore()
const settingsStore = useSettingsStore()
const events = computed(() => eventsStore.sortedEvents)

function setActive(id: string) { eventsStore.setActive(id) }

function deleteEvent(id: string) {
  if (confirm(useI18n().t('admin.confirmDelete'))) {
    eventsStore.deleteEvent(id)
  }
}
</script>
