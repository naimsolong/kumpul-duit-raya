import { computed } from 'vue'

export function useWallet(memberId: Ref<string> | string) {
  const eventsStore = useEventsStore()
  const transactionsStore = useTransactionsStore()
  const membersStore = useMembersStore()

  const memberIdValue = computed(() =>
    typeof memberId === 'string' ? memberId : memberId.value,
  )

  const activeEventId = computed(() => eventsStore.activeEvent?.id ?? '')

  const member = computed(() => membersStore.getById(memberIdValue.value))

  const transactions = computed(() =>
    transactionsStore.forMember(memberIdValue.value, activeEventId.value),
  )

  const balance = computed(() =>
    transactionsStore.totalForMember(memberIdValue.value, activeEventId.value),
  )

  function addMoney(payload: {
    amount: number
    denominations: Record<string, number>
    fromName?: string
    note?: string
  }) {
    if (!activeEventId.value) return null
    return transactionsStore.addTransaction({
      eventId: activeEventId.value,
      memberId: memberIdValue.value,
      amount: payload.amount,
      denominations: payload.denominations,
      fromName: payload.fromName ?? '',
      note: payload.note ?? '',
    })
  }

  return { member, transactions, balance, addMoney, activeEventId }
}
