import { defineStore } from 'pinia'
import type { FamilyMember, MemberRole } from './types'
import { generateId } from '~/utils/id'

const DEFAULT_COLORS = [
  '#16a34a', '#0284c7', '#dc2626', '#7c3aed',
  '#ca8a04', '#db2777', '#0f766e', '#ea580c',
]

export const useMembersStore = defineStore('members', {
  state: () => ({
    members: [] as FamilyMember[],
  }),

  getters: {
    sortedMembers(state): FamilyMember[] {
      return [...state.members].sort((a, b) => a.name.localeCompare(b.name))
    },

    getById: (state) => (id: string): FamilyMember | undefined =>
      state.members.find(m => m.id === id),
  },

  actions: {
    createMember(payload: { name: string; role: MemberRole; avatar: string; color?: string }): FamilyMember {
      const color = payload.color ?? DEFAULT_COLORS[this.members.length % DEFAULT_COLORS.length]
      const member: FamilyMember = {
        id: generateId(),
        name: payload.name,
        role: payload.role,
        avatar: payload.avatar,
        color,
        createdAt: new Date().toISOString(),
      }
      this.members.push(member)
      return member
    },

    updateMember(id: string, payload: Partial<Omit<FamilyMember, 'id' | 'createdAt'>>) {
      const idx = this.members.findIndex(m => m.id === id)
      if (idx !== -1) {
        this.members[idx] = { ...this.members[idx], ...payload }
      }
    },

    deleteMember(id: string) {
      this.members = this.members.filter(m => m.id !== id)
    },
  },

  persist: true,
})
