import { describe, it, expect } from 'vitest'
import { formatMYR, formatMYRCompact, COINS, NOTES, ALL_DENOMINATIONS } from '~/utils/currency'

describe('formatMYR', () => {
  it('returns "RM 0" for zero', () => {
    expect(formatMYR(0)).toBe('RM 0')
  })

  it('formats sub-ringgit amounts as sen', () => {
    expect(formatMYR(5)).toBe('5 sen')
    expect(formatMYR(10)).toBe('10 sen')
    expect(formatMYR(50)).toBe('50 sen')
    expect(formatMYR(99)).toBe('99 sen')
  })

  it('formats exactly RM1 without decimals', () => {
    expect(formatMYR(100)).toBe('RM 1')
  })

  it('formats fractional ringgit with 2 decimal places', () => {
    expect(formatMYR(150)).toBe('RM 1.50')
    expect(formatMYR(550)).toBe('RM 5.50')
    expect(formatMYR(1050)).toBe('RM 10.50')
  })

  it('formats whole ringgit amounts without decimals', () => {
    expect(formatMYR(500)).toBe('RM 5')
    expect(formatMYR(1000)).toBe('RM 10')
    expect(formatMYR(5000)).toBe('RM 50')
    expect(formatMYR(10000)).toBe('RM 100')
  })
})

describe('formatMYRCompact', () => {
  it('formats sub-ringgit amounts as sen', () => {
    expect(formatMYRCompact(0)).toBe('0 sen')
    expect(formatMYRCompact(99)).toBe('99 sen')
  })

  it('formats ringgit amounts without decimals when whole', () => {
    expect(formatMYRCompact(100)).toBe('RM 1')
    expect(formatMYRCompact(500)).toBe('RM 5')
  })

  it('formats fractional ringgit with 2 decimal places', () => {
    expect(formatMYRCompact(150)).toBe('RM 1.50')
  })

  it('formats thousands as "k"', () => {
    expect(formatMYRCompact(100000)).toBe('RM 1.0k')
    expect(formatMYRCompact(150000)).toBe('RM 1.5k')
    expect(formatMYRCompact(1000000)).toBe('RM 10.0k')
  })
})

describe('COINS', () => {
  it('has exactly 4 coins', () => {
    expect(COINS).toHaveLength(4)
  })

  it('all items have type "coin"', () => {
    COINS.forEach(c => expect(c.type).toBe('coin'))
  })

  it('has correct values in sen', () => {
    const values = COINS.map(c => c.value)
    expect(values).toEqual([5, 10, 20, 50])
  })

  it('each coin has required fields', () => {
    COINS.forEach(c => {
      expect(c).toHaveProperty('label')
      expect(c).toHaveProperty('value')
      expect(c).toHaveProperty('color')
      expect(c).toHaveProperty('bgGradient')
    })
  })
})

describe('NOTES', () => {
  it('has exactly 6 notes', () => {
    expect(NOTES).toHaveLength(6)
  })

  it('all items have type "note"', () => {
    NOTES.forEach(n => expect(n.type).toBe('note'))
  })

  it('has correct values in sen', () => {
    const values = NOTES.map(n => n.value)
    expect(values).toEqual([100, 500, 1000, 2000, 5000, 10000])
  })

  it('each note has required fields', () => {
    NOTES.forEach(n => {
      expect(n).toHaveProperty('label')
      expect(n).toHaveProperty('value')
      expect(n).toHaveProperty('color')
      expect(n).toHaveProperty('bgGradient')
    })
  })
})

describe('ALL_DENOMINATIONS', () => {
  it('combines coins and notes (10 total)', () => {
    expect(ALL_DENOMINATIONS).toHaveLength(10)
  })

  it('is sorted smallest to largest by value', () => {
    const values = ALL_DENOMINATIONS.map(d => d.value)
    const sorted = [...values].sort((a, b) => a - b)
    expect(values).toEqual(sorted)
  })
})
