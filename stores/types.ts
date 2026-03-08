import type { ThemeColors } from '~/utils/theme'

export interface RayaEvent {
  id: string
  name: string
  year: number
  startDate: string
  endDate: string
  theme: ThemeColors
  emoji: string
  isActive: boolean
  createdAt: string
}

export type MemberRole = 'parent' | 'child' | 'grandparent' | 'relative'

export interface FamilyMember {
  id: string
  name: string
  role: MemberRole
  avatar: string   // emoji
  color: string    // hex for avatar background
  createdAt: string
}

export interface Transaction {
  id: string
  eventId: string
  memberId: string
  amount: number      // in sen
  denomination: string
  fromName: string
  note: string
  timestamp: string
}

export interface AppSettings {
  activeEventId: string | null
  setupComplete: boolean
  language: 'en' | 'ms'
}
