<template>
  <div class="space-y-5">
    <div class="flex items-center gap-3">
      <NuxtLink to="/admin/events" class="text-gray-400 hover:text-gray-600 text-xl">←</NuxtLink>
      <h1 class="text-xl font-black" style="color: var(--color-primary)">
        {{ isNew ? $t('admin.createEvent') : $t('admin.editEvent') }}
      </h1>
    </div>

    <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
      <!-- Name -->
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{{ $t('admin.eventName') }}</label>
        <input v-model="form.name" type="text" class="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-gray-800 focus:outline-none"
          @focus="(e) => (e.target as HTMLElement).style.borderColor = 'var(--color-primary)'"
          @blur="(e) => (e.target as HTMLElement).style.borderColor = '#e5e7eb'"
        />
      </div>

      <!-- Year -->
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{{ $t('admin.eventYear') }}</label>
        <input v-model.number="form.year" type="number" class="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-gray-800 focus:outline-none"
          @focus="(e) => (e.target as HTMLElement).style.borderColor = 'var(--color-primary)'"
          @blur="(e) => (e.target as HTMLElement).style.borderColor = '#e5e7eb'"
        />
      </div>

      <!-- Emoji -->
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{{ $t('admin.eventEmoji') }}</label>
        <div class="flex flex-wrap gap-2">
          <button v-for="em in emojis" :key="em"
            class="w-10 h-10 text-xl rounded-xl border-2 transition-all"
            :class="form.emoji === em ? 'scale-110' : 'border-gray-200'"
            :style="form.emoji === em ? `border-color: ${form.theme.primary}; background: ${form.theme.primary}20` : ''"
            @click="form.emoji = em"
          >{{ em }}</button>
        </div>
      </div>

      <!-- Theme presets -->
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{{ $t('admin.presets') }}</label>
        <div class="grid grid-cols-2 gap-2">
          <button v-for="preset in THEME_PRESETS" :key="preset.id"
            class="flex items-center gap-2 p-3 rounded-xl border-2 transition-all"
            :class="selectedPreset === preset.id ? 'border-current' : 'border-gray-200'"
            :style="selectedPreset === preset.id ? `border-color: ${preset.colors.primary}` : ''"
            @click="selectPreset(preset)"
          >
            <div class="w-5 h-5 rounded-full flex-shrink-0" :style="{ background: `linear-gradient(135deg, ${preset.colors.primary}, ${preset.colors.secondary})` }" />
            <span class="text-xs font-semibold text-gray-700 truncate">{{ $t(preset.nameKey) }}</span>
          </button>
        </div>
      </div>

      <!-- Custom colors -->
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{{ $t('admin.themeColors') }}</label>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="key in colorKeys" :key="key" class="flex items-center gap-2">
            <input type="color" v-model="form.theme[key as keyof typeof form.theme]"
              class="w-10 h-10 rounded-xl border-2 border-gray-200 cursor-pointer p-0.5"
              @input="selectedPreset = 'custom'"
            />
            <span class="text-xs font-semibold text-gray-600">{{ $t(`admin.${key === 'bg' ? 'bgColor' : key}`) }}</span>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="rounded-xl p-4 text-white text-center font-bold" :style="{ background: `linear-gradient(135deg, ${form.theme.primary}, ${form.theme.secondary})` }">
        {{ form.emoji }} {{ form.name || '...' }}
      </div>
    </div>

    <button
      class="w-full py-3 rounded-xl font-black text-white tap-target"
      style="background: var(--color-primary)"
      :disabled="!form.name.trim()"
      :class="!form.name.trim() ? 'opacity-40' : ''"
      @click="save"
    >{{ $t('common.save') }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { THEME_PRESETS, applyTheme, buildThemeColors } from '~/utils/theme'
import type { ThemePreset } from '~/utils/theme'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()
const settingsStore = useSettingsStore()

const isNew = computed(() => route.params.id === 'new')
const existing = computed(() => isNew.value ? null : eventsStore.events.find(e => e.id === route.params.id))

const selectedPreset = ref('hijau-raya')
const emojis = ['🌙', '⭐', '🕌', '🎊', '🌟', '💫', '🎁', '🌺', '🦋', '🌸']
const colorKeys = ['primary', 'secondary', 'accent', 'bg']

const form = ref({
  name: existing.value?.name ?? `Raya ${new Date().getFullYear()}`,
  year: existing.value?.year ?? new Date().getFullYear(),
  emoji: existing.value?.emoji ?? '🌙',
  theme: { ...(existing.value?.theme ?? THEME_PRESETS[0].colors) },
})

function selectPreset(preset: ThemePreset) {
  selectedPreset.value = preset.id
  form.value.theme = { ...preset.colors }
  applyTheme(preset.colors)
}

function save() {
  if (!form.value.name.trim()) return
  const theme = buildThemeColors(form.value.theme.primary, form.value.theme.secondary, form.value.theme.accent, form.value.theme.bg)
  if (isNew.value) {
    const ev = eventsStore.createEvent({
      name: form.value.name.trim(),
      year: form.value.year,
      startDate: `${form.value.year}-03-01`,
      endDate: `${form.value.year}-04-30`,
      theme,
      emoji: form.value.emoji,
    })
    if (!settingsStore.activeEventId) eventsStore.setActive(ev.id)
  } else if (existing.value) {
    eventsStore.updateEvent(existing.value.id, {
      name: form.value.name.trim(),
      year: form.value.year,
      emoji: form.value.emoji,
      theme,
    })
    if (settingsStore.activeEventId === existing.value.id) applyTheme(theme)
  }
  router.push('/admin/events')
}
</script>
