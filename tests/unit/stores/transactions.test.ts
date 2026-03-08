import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTransactionsStore } from '~/stores/transactions'

const EVENT_A = 'event-a'
const EVENT_B = 'event-b'
const MEMBER_1 = 'member-1'
const MEMBER_2 = 'member-2'

function makeTx(overrides: Partial<Parameters<ReturnType<typeof useTransactionsStore>['addTransaction']>[0]> = {}) {
  return {
    eventId: EVENT_A,
    memberId: MEMBER_1,
    amount: 1000,
    denominations: { 'RM10': 1 },
    fromName: 'Pak Long',
    note: '',
    ...overrides,
  }
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useTransactionsStore — addTransaction', () => {
  it('adds the transaction to the array', () => {
    const store = useTransactionsStore()
    store.addTransaction(makeTx())
    expect(store.transactions).toHaveLength(1)
  })

  it('assigns an id and timestamp automatically', () => {
    const store = useTransactionsStore()
    const tx = store.addTransaction(makeTx())
    expect(tx.id).toBeTruthy()
    expect(tx.timestamp).toBeTruthy()
  })

  it('preserves all provided fields', () => {
    const store = useTransactionsStore()
    const tx = store.addTransaction(makeTx({ amount: 5000, fromName: 'Mak Teh', note: 'Happy Raya' }))
    expect(tx.amount).toBe(5000)
    expect(tx.fromName).toBe('Mak Teh')
    expect(tx.note).toBe('Happy Raya')
    expect(tx.eventId).toBe(EVENT_A)
    expect(tx.memberId).toBe(MEMBER_1)
  })
})

describe('useTransactionsStore — deleteTransaction', () => {
  it('removes only the target transaction', () => {
    const store = useTransactionsStore()
    const t1 = store.addTransaction(makeTx({ amount: 100 }))
    const t2 = store.addTransaction(makeTx({ amount: 500 }))
    store.deleteTransaction(t1.id)
    expect(store.transactions).toHaveLength(1)
    expect(store.transactions[0].id).toBe(t2.id)
  })
})

describe('useTransactionsStore — forEvent', () => {
  it('returns only transactions for the given event', () => {
    const store = useTransactionsStore()
    store.addTransaction(makeTx({ eventId: EVENT_A }))
    store.addTransaction(makeTx({ eventId: EVENT_B }))
    const result = store.forEvent(EVENT_A)
    expect(result).toHaveLength(1)
    expect(result[0].eventId).toBe(EVENT_A)
  })

  it('returns empty array when no transactions for event', () => {
    const store = useTransactionsStore()
    expect(store.forEvent('non-existent')).toEqual([])
  })
})

describe('useTransactionsStore — forMember', () => {
  it('returns only transactions for the given member and event', () => {
    const store = useTransactionsStore()
    store.addTransaction(makeTx({ memberId: MEMBER_1 }))
    store.addTransaction(makeTx({ memberId: MEMBER_2 }))
    const result = store.forMember(MEMBER_1, EVENT_A)
    expect(result).toHaveLength(1)
    expect(result[0].memberId).toBe(MEMBER_1)
  })

  it('returns transactions sorted newest first', () => {
    vi.useFakeTimers()
    const store = useTransactionsStore()
    const t1 = store.addTransaction(makeTx({ amount: 100 }))
    vi.advanceTimersByTime(1000)
    const t2 = store.addTransaction(makeTx({ amount: 500 }))
    const result = store.forMember(MEMBER_1, EVENT_A)
    expect(result[0].id).toBe(t2.id)
    expect(result[1].id).toBe(t1.id)
    vi.useRealTimers()
  })
})

describe('useTransactionsStore — totalForMember', () => {
  it('sums all amounts for a member in an event', () => {
    const store = useTransactionsStore()
    store.addTransaction(makeTx({ amount: 1000 }))
    store.addTransaction(makeTx({ amount: 5000 }))
    expect(store.totalForMember(MEMBER_1, EVENT_A)).toBe(6000)
  })

  it('returns 0 for a member with no transactions', () => {
    const store = useTransactionsStore()
    expect(store.totalForMember('ghost', EVENT_A)).toBe(0)
  })

  it('does not include transactions from other events', () => {
    const store = useTransactionsStore()
    store.addTransaction(makeTx({ eventId: EVENT_A, amount: 1000 }))
    store.addTransaction(makeTx({ eventId: EVENT_B, amount: 9999 }))
    expect(store.totalForMember(MEMBER_1, EVENT_A)).toBe(1000)
  })
})

describe('useTransactionsStore — totalForEvent', () => {
  it('sums all amounts across all members for an event', () => {
    const store = useTransactionsStore()
    store.addTransaction(makeTx({ memberId: MEMBER_1, amount: 1000 }))
    store.addTransaction(makeTx({ memberId: MEMBER_2, amount: 2000 }))
    expect(store.totalForEvent(EVENT_A)).toBe(3000)
  })

  it('returns 0 for an event with no transactions', () => {
    const store = useTransactionsStore()
    expect(store.totalForEvent('empty-event')).toBe(0)
  })

  it('does not include transactions from other events', () => {
    const store = useTransactionsStore()
    store.addTransaction(makeTx({ eventId: EVENT_A, amount: 1000 }))
    store.addTransaction(makeTx({ eventId: EVENT_B, amount: 9999 }))
    expect(store.totalForEvent(EVENT_A)).toBe(1000)
  })
})

describe('useTransactionsStore — recentForEvent', () => {
  it('returns at most 10 transactions by default', () => {
    const store = useTransactionsStore()
    for (let i = 0; i < 15; i++) {
      store.addTransaction(makeTx({ amount: 100 * i }))
    }
    expect(store.recentForEvent(EVENT_A)).toHaveLength(10)
  })

  it('respects a custom limit', () => {
    const store = useTransactionsStore()
    for (let i = 0; i < 10; i++) {
      store.addTransaction(makeTx({ amount: 100 }))
    }
    expect(store.recentForEvent(EVENT_A, 3)).toHaveLength(3)
  })

  it('returns transactions sorted newest first', () => {
    vi.useFakeTimers()
    const store = useTransactionsStore()
    const t1 = store.addTransaction(makeTx({ amount: 100 }))
    vi.advanceTimersByTime(1000)
    const t2 = store.addTransaction(makeTx({ amount: 500 }))
    const result = store.recentForEvent(EVENT_A)
    expect(result[0].id).toBe(t2.id)
    expect(result[1].id).toBe(t1.id)
    vi.useRealTimers()
  })
})

describe('useTransactionsStore — deleteAllForEvent', () => {
  it('removes all transactions for the given event', () => {
    const store = useTransactionsStore()
    store.addTransaction(makeTx({ eventId: EVENT_A }))
    store.addTransaction(makeTx({ eventId: EVENT_A }))
    store.addTransaction(makeTx({ eventId: EVENT_B }))
    store.deleteAllForEvent(EVENT_A)
    expect(store.transactions.filter(t => t.eventId === EVENT_A)).toHaveLength(0)
    expect(store.transactions.filter(t => t.eventId === EVENT_B)).toHaveLength(1)
  })
})

describe('useTransactionsStore — deleteAllForMember', () => {
  it('removes all transactions for the given member', () => {
    const store = useTransactionsStore()
    store.addTransaction(makeTx({ memberId: MEMBER_1 }))
    store.addTransaction(makeTx({ memberId: MEMBER_1 }))
    store.addTransaction(makeTx({ memberId: MEMBER_2 }))
    store.deleteAllForMember(MEMBER_1)
    expect(store.transactions.filter(t => t.memberId === MEMBER_1)).toHaveLength(0)
    expect(store.transactions.filter(t => t.memberId === MEMBER_2)).toHaveLength(1)
  })
})
