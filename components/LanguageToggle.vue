<template>
  <button
    class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors tap-target"
    style="border-color: var(--color-primary); color: var(--color-primary)"
    @click="toggle"
    :aria-label="$t('nav.language')"
  >
    <span>🌐</span>
    <span>{{ locale === 'ms' ? 'BM' : 'EN' }}</span>
  </button>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()
const settingsStore = useSettingsStore()

function toggle() {
  const next = locale.value === 'ms' ? 'en' : 'ms'
  setLocale(next)
  settingsStore.setLanguage(next)
}
</script>
