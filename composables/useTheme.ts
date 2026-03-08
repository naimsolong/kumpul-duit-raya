import { watch } from 'vue'
import { applyTheme, THEME_PRESETS } from '~/utils/theme'

export function useTheme() {
  const eventsStore = useEventsStore()
  const settingsStore = useSettingsStore()

  function applyActiveTheme() {
    const event = eventsStore.activeEvent
    if (event?.theme) {
      applyTheme(event.theme)
    } else {
      applyTheme(THEME_PRESETS[0].colors)
    }
  }

  watch(() => settingsStore.activeEventId, applyActiveTheme, { immediate: true })

  return { applyActiveTheme }
}
