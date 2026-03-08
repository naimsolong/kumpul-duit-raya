import { describe, it, expect } from 'vitest'
import { hexToRgb, lightenColor, buildThemeColors, THEME_PRESETS } from '~/utils/theme'

describe('hexToRgb', () => {
  it('converts red correctly', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('converts green correctly', () => {
    expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 })
  })

  it('converts blue correctly', () => {
    expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 })
  })

  it('converts #16a34a (primary green) correctly', () => {
    const result = hexToRgb('#16a34a')
    expect(result).toEqual({ r: 22, g: 163, b: 74 })
  })

  it('returns null for invalid hex', () => {
    expect(hexToRgb('invalid')).toBeNull()
    expect(hexToRgb('#gg0000')).toBeNull()
    expect(hexToRgb('')).toBeNull()
  })

  it('handles hex without leading #', () => {
    // nanoid format — hexToRgb regex handles optional #
    const result = hexToRgb('ff0000')
    expect(result).toEqual({ r: 255, g: 0, b: 0 })
  })
})

describe('lightenColor', () => {
  it('lightens black toward white with default amount', () => {
    const result = lightenColor('#000000')
    const rgb = hexToRgb(result)
    // With amount=0.8, each channel should be 204 (255 * 0.8)
    expect(rgb?.r).toBeGreaterThan(190)
    expect(rgb?.g).toBeGreaterThan(190)
    expect(rgb?.b).toBeGreaterThan(190)
  })

  it('leaves white unchanged', () => {
    const result = lightenColor('#ffffff')
    expect(result).toBe('#ffffff')
  })

  it('returns input unchanged for invalid hex', () => {
    expect(lightenColor('invalid')).toBe('invalid')
  })

  it('produces a lighter shade of primary green', () => {
    const original = hexToRgb('#16a34a')!
    const lightened = hexToRgb(lightenColor('#16a34a'))!
    expect(lightened.g).toBeGreaterThan(original.g)
  })
})

describe('buildThemeColors', () => {
  const colors = buildThemeColors('#16a34a', '#ca8a04', '#dc2626', '#f0fdf4')

  it('returns an object with all 7 required keys', () => {
    expect(colors).toHaveProperty('primary')
    expect(colors).toHaveProperty('secondary')
    expect(colors).toHaveProperty('accent')
    expect(colors).toHaveProperty('bg')
    expect(colors).toHaveProperty('text')
    expect(colors).toHaveProperty('primaryLight')
    expect(colors).toHaveProperty('secondaryLight')
  })

  it('preserves the primary color', () => {
    expect(colors.primary).toBe('#16a34a')
  })

  it('preserves the secondary color', () => {
    expect(colors.secondary).toBe('#ca8a04')
  })

  it('preserves the accent color', () => {
    expect(colors.accent).toBe('#dc2626')
  })

  it('preserves the bg color', () => {
    expect(colors.bg).toBe('#f0fdf4')
  })

  it('derives primaryLight as a lighter shade', () => {
    const primaryRgb = hexToRgb('#16a34a')!
    const lightRgb = hexToRgb(colors.primaryLight)!
    expect(lightRgb.g).toBeGreaterThan(primaryRgb.g)
  })
})

describe('THEME_PRESETS', () => {
  it('has exactly 4 presets', () => {
    expect(THEME_PRESETS).toHaveLength(4)
  })

  it('each preset has id, nameKey, and colors', () => {
    THEME_PRESETS.forEach(preset => {
      expect(preset).toHaveProperty('id')
      expect(preset).toHaveProperty('nameKey')
      expect(preset).toHaveProperty('colors')
    })
  })

  it('each preset colors has all 7 required fields', () => {
    const requiredKeys = ['primary', 'secondary', 'accent', 'bg', 'text', 'primaryLight', 'secondaryLight']
    THEME_PRESETS.forEach(preset => {
      requiredKeys.forEach(key => {
        expect(preset.colors).toHaveProperty(key)
      })
    })
  })

  it('preset IDs are unique', () => {
    const ids = THEME_PRESETS.map(p => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('first preset is hijau-raya', () => {
    expect(THEME_PRESETS[0].id).toBe('hijau-raya')
  })
})
