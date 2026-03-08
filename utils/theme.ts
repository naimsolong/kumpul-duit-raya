export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  bg: string
  text: string
  primaryLight: string
  secondaryLight: string
}

export interface ThemePreset {
  id: string
  nameKey: string
  colors: ThemeColors
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'hijau-raya',
    nameKey: 'theme.hijauRaya',
    colors: {
      primary: '#16a34a',
      secondary: '#ca8a04',
      accent: '#dc2626',
      bg: '#f0fdf4',
      text: '#14532d',
      primaryLight: '#bbf7d0',
      secondaryLight: '#fef9c3',
    },
  },
  {
    id: 'biru-langit',
    nameKey: 'theme.biruLangit',
    colors: {
      primary: '#0284c7',
      secondary: '#7c3aed',
      accent: '#db2777',
      bg: '#f0f9ff',
      text: '#0c4a6e',
      primaryLight: '#bae6fd',
      secondaryLight: '#ede9fe',
    },
  },
  {
    id: 'merah-merdeka',
    nameKey: 'theme.merahMerdeka',
    colors: {
      primary: '#dc2626',
      secondary: '#16a34a',
      accent: '#ca8a04',
      bg: '#fff1f2',
      text: '#881337',
      primaryLight: '#fecdd3',
      secondaryLight: '#bbf7d0',
    },
  },
  {
    id: 'ungu-mewah',
    nameKey: 'theme.unguMewah',
    colors: {
      primary: '#7c3aed',
      secondary: '#ca8a04',
      accent: '#db2777',
      bg: '#fdf4ff',
      text: '#4a044e',
      primaryLight: '#ede9fe',
      secondaryLight: '#fef9c3',
    },
  },
]

export function applyTheme(colors: ThemeColors): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.style.setProperty('--color-primary', colors.primary)
  root.style.setProperty('--color-secondary', colors.secondary)
  root.style.setProperty('--color-accent', colors.accent)
  root.style.setProperty('--color-bg', colors.bg)
  root.style.setProperty('--color-text', colors.text)
  root.style.setProperty('--color-primary-light', colors.primaryLight)
  root.style.setProperty('--color-secondary-light', colors.secondaryLight)
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Derive a light variant of a hex color
 */
export function lightenColor(hex: string, amount = 0.8): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const r = Math.round(rgb.r + (255 - rgb.r) * amount)
  const g = Math.round(rgb.g + (255 - rgb.g) * amount)
  const b = Math.round(rgb.b + (255 - rgb.b) * amount)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/**
 * Build a full ThemeColors from minimal primary/secondary/accent/bg inputs
 */
export function buildThemeColors(
  primary: string,
  secondary: string,
  accent: string,
  bg: string,
): ThemeColors {
  return {
    primary,
    secondary,
    accent,
    bg,
    text: darkenColor(primary, 0.4),
    primaryLight: lightenColor(primary, 0.8),
    secondaryLight: lightenColor(secondary, 0.8),
  }
}

function darkenColor(hex: string, amount = 0.4): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const r = Math.round(rgb.r * (1 - amount))
  const g = Math.round(rgb.g * (1 - amount))
  const b = Math.round(rgb.b * (1 - amount))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
