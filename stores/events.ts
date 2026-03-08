import { defineStore } from 'pinia'
import type { RayaEvent } from './types'
import { generateId } from '~/utils/id'
import { THEME_PRESETS } from '~/utils/theme'
import { useSettingsStore } from './settings'

export const useEventsStore = defineStore('events', {
  state: () => ({
    events: [] as RayaEvent[],
  }),

  getters: {
    activeEvent(state): RayaEvent | null {
      const settingsStore = useSettingsStore()
      if (!settingsStore.activeEventId) return null
      return state.events.find(e => e.id === settingsStore.activeEventId) ?? null
    },

    sortedEvents(state): RayaEvent[] {
      return [...state.events].sort((a, b) => b.year - a.year)
    },
  },

  actions: {
    createEvent(payload: Omit<RayaEvent, 'id' | 'createdAt' | 'isActive'>): RayaEvent {
      const event: RayaEvent = {
        ...payload,
        id: generateId(),
        isActive: false,
        createdAt: new Date().toISOString(),
      }
      this.events.push(event)
      return event
    },

    updateEvent(id: string, payload: Partial<Omit<RayaEvent, 'id' | 'createdAt'>>) {
      const idx = this.events.findIndex(e => e.id === id)
      if (idx !== -1) {
        this.events[idx] = { ...this.events[idx], ...payload }
      }
    },

    deleteEvent(id: string) {
      this.events = this.events.filter(e => e.id !== id)
      const settingsStore = useSettingsStore()
      if (settingsStore.activeEventId === id) {
        settingsStore.setActiveEvent(this.events[0]?.id ?? null)
      }
    },

    setActive(id: string) {
      const settingsStore = useSettingsStore()
      settingsStore.setActiveEvent(id)
    },

    createDefaultEvent(): RayaEvent {
      const year = new Date().getFullYear()
      const preset = THEME_PRESETS[0]
      return this.createEvent({
        name: `Raya ${year}`,
        year,
        startDate: `${year}-03-01`,
        endDate: `${year}-04-30`,
        theme: preset.colors,
        emoji: '🌙',
      })
    },
  },

  persist: true,
})
