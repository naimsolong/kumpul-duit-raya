export interface Denomination {
  label: string
  value: number  // in sen
  type: 'coin' | 'note'
  color: string  // primary color for the card
  bgGradient: string
}

export const COINS: Denomination[] = [
  {
    label: '5 sen',
    value: 5,
    type: 'coin',
    color: '#94a3b8',
    bgGradient: 'linear-gradient(135deg, #94a3b8, #64748b)',
  },
  {
    label: '10 sen',
    value: 10,
    type: 'coin',
    color: '#94a3b8',
    bgGradient: 'linear-gradient(135deg, #cbd5e1, #94a3b8)',
  },
  {
    label: '20 sen',
    value: 20,
    type: 'coin',
    color: '#d4af37',
    bgGradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  {
    label: '50 sen',
    value: 50,
    type: 'coin',
    color: '#d4af37',
    bgGradient: 'linear-gradient(135deg, #fbbf24, #ca8a04)',
  },
]

export const NOTES: Denomination[] = [
  {
    label: 'RM1',
    value: 100,
    type: 'note',
    color: '#1d4ed8',
    bgGradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  },
  {
    label: 'RM5',
    value: 500,
    type: 'note',
    color: '#15803d',
    bgGradient: 'linear-gradient(135deg, #22c55e, #15803d)',
  },
  {
    label: 'RM10',
    value: 1000,
    type: 'note',
    color: '#b91c1c',
    bgGradient: 'linear-gradient(135deg, #ef4444, #b91c1c)',
  },
  {
    label: 'RM20',
    value: 2000,
    type: 'note',
    color: '#7c3aed',
    bgGradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
  },
  {
    label: 'RM50',
    value: 5000,
    type: 'note',
    color: '#0f766e',
    bgGradient: 'linear-gradient(135deg, #14b8a6, #0f766e)',
  },
  {
    label: 'RM100',
    value: 10000,
    type: 'note',
    color: '#92400e',
    bgGradient: 'linear-gradient(135deg, #f59e0b, #92400e)',
  },
]

export const ALL_DENOMINATIONS: Denomination[] = [...COINS, ...NOTES]

/**
 * Format an amount in sen to a human-readable MYR string
 */
export function formatMYR(sen: number): string {
  if (sen === 0) return 'RM 0'
  if (sen < 100) return `${sen} sen`
  const rm = sen / 100
  const formatted = rm % 1 === 0 ? rm.toFixed(0) : rm.toFixed(2)
  return `RM ${formatted}`
}

/**
 * Format a compact version (e.g. RM1.2k)
 */
export function formatMYRCompact(sen: number): string {
  const rm = sen / 100
  if (rm >= 1000) return `RM ${(rm / 1000).toFixed(1)}k`
  if (rm >= 1) return `RM ${rm % 1 === 0 ? rm.toFixed(0) : rm.toFixed(2)}`
  return `${sen} sen`
}
