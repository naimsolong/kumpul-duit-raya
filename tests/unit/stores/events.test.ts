import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useEventsStore } from '~/stores/events'
import { useSettingsStore } from '~/stores/settings'
import { THEME_PRESETS } from '~/utils/theme'

const SAMPLE_EVENT_PAYLOAD = {
  name: 'Raya 2026',
  year: 2026,
  startDate: '2026-03-01',
  endDate: '2026-04-30',
  theme: THEME_PRESETS[0].colors,
  emoji: '🌙',
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useEventsStore — createEvent', () => {
  it('adds the event to the events array', () => {
    const store = useEventsStore()
    store.createEvent(SAMPLE_EVENT_PAYLOAD)
    expect(store.events).toHaveLength(1)
  })

  it('returns the created event with an id and createdAt', () => {
    const store = useEventsStore()
    const event = store.createEvent(SAMPLE_EVENT_PAYLOAD)
    expect(event.id).toBeTruthy()
    expect(event.createdAt).toBeTruthy()
  })

  it('sets isActive to false on the returned event', () => {
    const store = useEventsStore()
    const event = store.createEvent(SAMPLE_EVENT_PAYLOAD)
    expect(event.isActive).toBe(false)
  })

  it('preserves all provided fields', () => {
    const store = useEventsStore()
    const event = store.createEvent(SAMPLE_EVENT_PAYLOAD)
    expect(event.name).toBe('Raya 2026')
    expect(event.year).toBe(2026)
    expect(event.emoji).toBe('🌙')
  })
})

describe('useEventsStore — updateEvent', () => {
  it('updates the target event fields', () => {
    const store = useEventsStore()
    const event = store.createEvent(SAMPLE_EVENT_PAYLOAD)
    store.updateEvent(event.id, { name: 'Raya Updated' })
    expect(store.events[0].name).toBe('Raya Updated')
  })

  it('does not affect other events', () => {
    const store = useEventsStore()
    const e1 = store.createEvent(SAMPLE_EVENT_PAYLOAD)
    const e2 = store.createEvent({ ...SAMPLE_EVENT_PAYLOAD, name: 'Raya 2025', year: 2025 })
    store.updateEvent(e1.id, { name: 'Changed' })
    const found = store.events.find(e => e.id === e2.id)
    expect(found?.name).toBe('Raya 2025')
  })

  it('is a no-op for unknown id', () => {
    const store = useEventsStore()
    store.createEvent(SAMPLE_EVENT_PAYLOAD)
    expect(() => store.updateEvent('unknown-id', { name: 'X' })).not.toThrow()
    expect(store.events[0].name).toBe('Raya 2026')
  })
})

describe('useEventsStore — deleteEvent', () => {
  it('removes the target event', () => {
    const store = useEventsStore()
    const event = store.createEvent(SAMPLE_EVENT_PAYLOAD)
    store.deleteEvent(event.id)
    expect(store.events).toHaveLength(0)
  })

  it('does not remove other events', () => {
    const store = useEventsStore()
    const e1 = store.createEvent(SAMPLE_EVENT_PAYLOAD)
    const e2 = store.createEvent({ ...SAMPLE_EVENT_PAYLOAD, year: 2025 })
    store.deleteEvent(e1.id)
    expect(store.events).toHaveLength(1)
    expect(store.events[0].id).toBe(e2.id)
  })

  it('clears settingsStore.activeEventId when deleting the active event', () => {
    const eventsStore = useEventsStore()
    const settingsStore = useSettingsStore()
    const event = eventsStore.createEvent(SAMPLE_EVENT_PAYLOAD)
    eventsStore.setActive(event.id)
    eventsStore.deleteEvent(event.id)
    expect(settingsStore.activeEventId).toBeNull()
  })

  it('does not clear settingsStore.activeEventId when deleting a non-active event', () => {
    const eventsStore = useEventsStore()
    const settingsStore = useSettingsStore()
    const e1 = eventsStore.createEvent(SAMPLE_EVENT_PAYLOAD)
    const e2 = eventsStore.createEvent({ ...SAMPLE_EVENT_PAYLOAD, year: 2025 })
    eventsStore.setActive(e1.id)
    eventsStore.deleteEvent(e2.id)
    expect(settingsStore.activeEventId).toBe(e1.id)
  })
})

describe('useEventsStore — sortedEvents', () => {
  it('returns events sorted by year descending', () => {
    const store = useEventsStore()
    store.createEvent({ ...SAMPLE_EVENT_PAYLOAD, year: 2024 })
    store.createEvent({ ...SAMPLE_EVENT_PAYLOAD, year: 2026 })
    store.createEvent({ ...SAMPLE_EVENT_PAYLOAD, year: 2025 })
    const years = store.sortedEvents.map(e => e.year)
    expect(years).toEqual([2026, 2025, 2024])
  })
})

describe('useEventsStore — activeEvent getter', () => {
  it('returns null when no activeEventId is set', () => {
    const store = useEventsStore()
    store.createEvent(SAMPLE_EVENT_PAYLOAD)
    expect(store.activeEvent).toBeNull()
  })

  it('returns the correct event matching activeEventId', () => {
    const eventsStore = useEventsStore()
    const event = eventsStore.createEvent(SAMPLE_EVENT_PAYLOAD)
    eventsStore.setActive(event.id)
    expect(eventsStore.activeEvent?.id).toBe(event.id)
  })
})

describe('useEventsStore — createDefaultEvent', () => {
  it('creates an event with the current year', () => {
    const store = useEventsStore()
    const event = store.createDefaultEvent()
    expect(event.year).toBe(new Date().getFullYear())
  })

  it('uses the first theme preset', () => {
    const store = useEventsStore()
    const event = store.createDefaultEvent()
    expect(event.theme).toEqual(THEME_PRESETS[0].colors)
  })
})
