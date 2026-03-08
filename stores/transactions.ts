import { defineStore } from 'pinia'
import type { Transaction } from './types'
import { generateId } from '~/utils/id'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [] as Transaction[],
  }),

  getters: {
    forEvent: (state) => (eventId: string): Transaction[] =>
      state.transactions.filter(t => t.eventId === eventId),

    forMember: (state) => (memberId: string, eventId: string): Transaction[] =>
      state.transactions
        .filter(t => t.memberId === memberId && t.eventId === eventId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),

    totalForMember: (state) => (memberId: string, eventId: string): number =>
      state.transactions
        .filter(t => t.memberId === memberId && t.eventId === eventId)
        .reduce((sum, t) => sum + t.amount, 0),

    totalForEvent: (state) => (eventId: string): number =>
      state.transactions
        .filter(t => t.eventId === eventId)
        .reduce((sum, t) => sum + t.amount, 0),

    recentForEvent: (state) => (eventId: string, limit = 10): Transaction[] =>
      [...state.transactions.filter(t => t.eventId === eventId)]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit),
  },

  actions: {
    addTransaction(payload: Omit<Transaction, 'id' | 'timestamp'>): Transaction {
      const tx: Transaction = {
        ...payload,
        id: generateId(),
        timestamp: new Date().toISOString(),
      }
      this.transactions.push(tx)
      return tx
    },

    deleteTransaction(id: string) {
      this.transactions = this.transactions.filter(t => t.id !== id)
    },

    deleteAllForEvent(eventId: string) {
      this.transactions = this.transactions.filter(t => t.eventId !== eventId)
    },

    deleteAllForMember(memberId: string) {
      this.transactions = this.transactions.filter(t => t.memberId !== memberId)
    },
  },

  persist: true,
})
