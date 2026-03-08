import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMembersStore } from '~/stores/members'

const DEFAULT_COLORS = [
  '#16a34a', '#0284c7', '#dc2626', '#7c3aed',
  '#ca8a04', '#db2777', '#0f766e', '#ea580c',
]

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useMembersStore — createMember', () => {
  it('adds the member to the members array', () => {
    const store = useMembersStore()
    store.createMember({ name: 'Arif', role: 'child', avatar: '👦' })
    expect(store.members).toHaveLength(1)
  })

  it('returns the created member with id and createdAt', () => {
    const store = useMembersStore()
    const member = store.createMember({ name: 'Arif', role: 'child', avatar: '👦' })
    expect(member.id).toBeTruthy()
    expect(member.createdAt).toBeTruthy()
  })

  it('assigns the first default color to the first member', () => {
    const store = useMembersStore()
    const member = store.createMember({ name: 'Arif', role: 'child', avatar: '👦' })
    expect(member.color).toBe(DEFAULT_COLORS[0])
  })

  it('cycles through default colors for subsequent members', () => {
    const store = useMembersStore()
    const m1 = store.createMember({ name: 'A', role: 'child', avatar: '👦' })
    const m2 = store.createMember({ name: 'B', role: 'child', avatar: '👧' })
    expect(m1.color).toBe(DEFAULT_COLORS[0])
    expect(m2.color).toBe(DEFAULT_COLORS[1])
  })

  it('uses a provided custom color instead of the default', () => {
    const store = useMembersStore()
    const member = store.createMember({ name: 'Arif', role: 'child', avatar: '👦', color: '#aabbcc' })
    expect(member.color).toBe('#aabbcc')
  })

  it('preserves all provided fields', () => {
    const store = useMembersStore()
    const member = store.createMember({ name: 'Arif', role: 'child', avatar: '👦' })
    expect(member.name).toBe('Arif')
    expect(member.role).toBe('child')
    expect(member.avatar).toBe('👦')
  })
})

describe('useMembersStore — updateMember', () => {
  it('updates the target member', () => {
    const store = useMembersStore()
    const m = store.createMember({ name: 'Arif', role: 'child', avatar: '👦' })
    store.updateMember(m.id, { name: 'Arif Updated' })
    expect(store.members[0].name).toBe('Arif Updated')
  })

  it('does not affect other members', () => {
    const store = useMembersStore()
    const m1 = store.createMember({ name: 'Arif', role: 'child', avatar: '👦' })
    const m2 = store.createMember({ name: 'Hana', role: 'child', avatar: '👧' })
    store.updateMember(m1.id, { name: 'Changed' })
    const found = store.members.find(m => m.id === m2.id)
    expect(found?.name).toBe('Hana')
  })
})

describe('useMembersStore — deleteMember', () => {
  it('removes only the target member', () => {
    const store = useMembersStore()
    const m1 = store.createMember({ name: 'Arif', role: 'child', avatar: '👦' })
    const m2 = store.createMember({ name: 'Hana', role: 'child', avatar: '👧' })
    store.deleteMember(m1.id)
    expect(store.members).toHaveLength(1)
    expect(store.members[0].id).toBe(m2.id)
  })
})

describe('useMembersStore — sortedMembers', () => {
  it('returns members sorted alphabetically by name', () => {
    const store = useMembersStore()
    store.createMember({ name: 'Zara', role: 'child', avatar: '👧' })
    store.createMember({ name: 'Arif', role: 'child', avatar: '👦' })
    store.createMember({ name: 'Mia', role: 'child', avatar: '👧' })
    const names = store.sortedMembers.map(m => m.name)
    expect(names).toEqual(['Arif', 'Mia', 'Zara'])
  })
})

describe('useMembersStore — getById', () => {
  it('returns the correct member for a valid id', () => {
    const store = useMembersStore()
    const m = store.createMember({ name: 'Arif', role: 'child', avatar: '👦' })
    expect(store.getById(m.id)?.name).toBe('Arif')
  })

  it('returns undefined for an unknown id', () => {
    const store = useMembersStore()
    expect(store.getById('does-not-exist')).toBeUndefined()
  })
})
