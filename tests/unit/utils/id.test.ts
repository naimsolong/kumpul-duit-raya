import { describe, it, expect } from 'vitest'
import { generateId } from '~/utils/id'

describe('generateId', () => {
  it('returns a string of the default length (12)', () => {
    expect(generateId()).toHaveLength(12)
  })

  it('returns a string of custom length', () => {
    expect(generateId(8)).toHaveLength(8)
    expect(generateId(20)).toHaveLength(20)
  })

  it('only uses URL-safe characters', () => {
    for (let i = 0; i < 100; i++) {
      expect(generateId()).toMatch(/^[A-Za-z0-9_-]+$/)
    }
  })

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 1000 }, () => generateId()))
    expect(ids.size).toBe(1000)
  })
})
