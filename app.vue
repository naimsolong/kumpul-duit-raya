<template>
  <ThemeProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ThemeProvider>
</template>

<script setup lang="ts">
const settingsStore = useSettingsStore()
const { locale, setLocale } = useI18n()

// Sync saved language on app start
onMounted(() => {
  if (settingsStore.language && settingsStore.language !== locale.value) {
    setLocale(settingsStore.language)
  }
})
</script>
