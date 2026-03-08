import { defineStore } from 'pinia'
import type { AppSettings } from './types'

export const useSettingsStore = defineStore('settings', {
  state: (): AppSettings => ({
    activeEventId: null,
    setupComplete: false,
    language: 'en',
  }),

  getters: {
    isSetupComplete: (state) => state.setupComplete,
    currentLanguage: (state) => state.language,
    currentActiveEventId: (state) => state.activeEventId,
  },

  actions: {
    setActiveEvent(eventId: string | null) {
      this.activeEventId = eventId
    },

    completeSetup() {
      this.setupComplete = true
    },

    setLanguage(lang: 'en' | 'ms') {
      this.language = lang
    },

    resetAll() {
      this.activeEventId = null
      this.setupComplete = false
      this.language = 'en'
    },
  },

  persist: true,
})
