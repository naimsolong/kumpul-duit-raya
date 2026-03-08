import { computed } from 'vue'
import { formatMYR } from '~/utils/currency'

export interface LeaderboardEntry {
  rank: number
  member: { id: string; name: string; avatar: string; color: string; role: string }
  total: number
  totalFormatted: string
  share: number  // percentage of total pool
}

export function useLeaderboard(eventId?: Ref<string> | string) {
  const eventsStore = useEventsStore()
  const transactionsStore = useTransactionsStore()
  const membersStore = useMembersStore()

  const resolvedEventId = computed(() => {
    if (!eventId) return eventsStore.activeEvent?.id ?? ''
    return typeof eventId === 'string' ? eventId : eventId.value
  })

  const entries = computed((): LeaderboardEntry[] => {
    const eid = resolvedEventId.value
    if (!eid) return []

    const eventTotal = transactionsStore.totalForEvent(eid)

    return [...membersStore.members]
      .map(m => ({
        member: m,
        total: transactionsStore.totalForMember(m.id, eid),
      }))
      .sort((a, b) => b.total - a.total)
      .map((entry, idx) => ({
        rank: idx + 1,
        member: entry.member,
        total: entry.total,
        totalFormatted: formatMYR(entry.total),
        share: eventTotal > 0 ? Math.round((entry.total / eventTotal) * 100) : 0,
      }))
  })

  const leader = computed(() => entries.value[0] ?? null)
  const eventTotal = computed(() => transactionsStore.totalForEvent(resolvedEventId.value))
  const eventTotalFormatted = computed(() => formatMYR(eventTotal.value))

  return { entries, leader, eventTotal, eventTotalFormatted }
}
