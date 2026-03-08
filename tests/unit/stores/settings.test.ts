import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSettingsStore } from '~/stores/settings'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useSettingsStore — initial state', () => {
  it('has null activeEventId', () => {
    const store = useSettingsStore()
    expect(store.activeEventId).toBeNull()
  })

  it('has setupComplete = false', () => {
    const store = useSettingsStore()
    expect(store.setupComplete).toBe(false)
  })

  it('has language = "ms"', () => {
    const store = useSettingsStore()
    expect(store.language).toBe('ms')
  })
})

describe('useSettingsStore — getters', () => {
  it('isSetupComplete mirrors setupComplete', () => {
    const store = useSettingsStore()
    expect(store.isSetupComplete).toBe(false)
    store.completeSetup()
    expect(store.isSetupComplete).toBe(true)
  })

  it('currentLanguage mirrors language', () => {
    const store = useSettingsStore()
    expect(store.currentLanguage).toBe('ms')
    store.setLanguage('en')
    expect(store.currentLanguage).toBe('en')
  })

  it('currentActiveEventId mirrors activeEventId', () => {
    const store = useSettingsStore()
    expect(store.currentActiveEventId).toBeNull()
    store.setActiveEvent('event-1')
    expect(store.currentActiveEventId).toBe('event-1')
  })
})

describe('useSettingsStore — actions', () => {
  it('setActiveEvent updates activeEventId', () => {
    const store = useSettingsStore()
    store.setActiveEvent('abc')
    expect(store.activeEventId).toBe('abc')
  })

  it('setActiveEvent accepts null', () => {
    const store = useSettingsStore()
    store.setActiveEvent('abc')
    store.setActiveEvent(null)
    expect(store.activeEventId).toBeNull()
  })

  it('completeSetup sets setupComplete to true', () => {
    const store = useSettingsStore()
    store.completeSetup()
    expect(store.setupComplete).toBe(true)
  })

  it('setLanguage updates language', () => {
    const store = useSettingsStore()
    store.setLanguage('en')
    expect(store.language).toBe('en')
    store.setLanguage('ms')
    expect(store.language).toBe('ms')
  })

  it('resetAll restores all defaults', () => {
    const store = useSettingsStore()
    store.setActiveEvent('abc')
    store.completeSetup()
    store.setLanguage('en')
    store.resetAll()
    expect(store.activeEventId).toBeNull()
    expect(store.setupComplete).toBe(false)
    expect(store.language).toBe('ms')
  })
})
