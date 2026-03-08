<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <NuxtLink to="/admin" class="text-gray-400 hover:text-gray-600 text-xl">←</NuxtLink>
      <h1 class="text-xl font-black" style="color: var(--color-primary)">{{ $t('admin.allTransactions') }}</h1>
    </div>

    <!-- Filters -->
    <div class="flex gap-2">
      <select v-model="filterEventId" class="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 bg-white focus:outline-none">
        <option value="">{{ $t('admin.filterByEvent') }}</option>
        <option v-for="ev in events" :key="ev.id" :value="ev.id">{{ ev.emoji }} {{ ev.name }}</option>
      </select>
      <select v-model="filterMemberId" class="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 bg-white focus:outline-none">
        <option value="">{{ $t('admin.filterByMember') }}</option>
        <option v-for="m in members" :key="m.id" :value="m.id">{{ m.avatar }} {{ m.name }}</option>
      </select>
    </div>

    <p class="text-xs text-gray-400 font-semibold">{{ filtered.length }} {{ $t('common.total').toLowerCase() }}</p>

    <div v-if="filtered.length > 0" class="space-y-2">
      <div v-for="tx in filtered" :key="tx.id"
        class="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm"
      >
        <div class="flex items-start gap-3">
          <div class="flex-1 min-w-0 space-y-1">
            <!-- Denomination chips -->
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(qty, label) in tx.denominations"
                :key="label"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-white text-xs font-bold"
                :style="getDenomStyle(label as string)"
              >{{ label }} ×{{ qty }}</span>
            </div>
            <p class="font-bold text-sm text-gray-800">{{ formatMYR(tx.amount) }}</p>
            <p class="text-xs text-gray-500 truncate">
              {{ getMemberName(tx.memberId) }} · {{ $t('wallet.from') }} {{ tx.fromName || '—' }}
            </p>
            <p class="text-xs text-gray-400">{{ getEventName(tx.eventId) }} · {{ formatDate(tx.timestamp) }}</p>
          </div>
          <button class="text-xs text-red-300 hover:text-red-500 transition-colors p-1 flex-shrink-0" @click="deleteTransaction(tx.id)">✕</button>
        </div>
      </div>
    </div>

    <EmptyState v-else icon="📋" :title="$t('common.empty')" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatMYR, ALL_DENOMINATIONS } from '~/utils/currency'

const transactionsStore = useTransactionsStore()
const eventsStore = useEventsStore()
const membersStore = useMembersStore()

const filterEventId = ref('')
const filterMemberId = ref('')

const events = computed(() => eventsStore.sortedEvents)
const members = computed(() => membersStore.sortedMembers)

const filtered = computed(() => {
  return [...transactionsStore.transactions]
    .filter(t => !filterEventId.value || t.eventId === filterEventId.value)
    .filter(t => !filterMemberId.value || t.memberId === filterMemberId.value)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

function getMemberName(id: string) {
  return membersStore.getById(id)?.name ?? id
}
function getEventName(id: string) {
  return eventsStore.events.find(e => e.id === id)?.name ?? id
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function getDenomStyle(label: string) {
  const found = ALL_DENOMINATIONS.find(d => d.label === label)
  return { background: found?.bgGradient ?? 'var(--color-primary)' }
}
function deleteTransaction(id: string) {
  if (confirm(useI18n().t('admin.confirmDelete'))) {
    transactionsStore.deleteTransaction(id)
  }
}
</script>
