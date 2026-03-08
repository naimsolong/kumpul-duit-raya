<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-black" style="color: var(--color-primary)">{{ $t('admin.title') }}</h1>

    <NuxtLink to="/admin/events"
      class="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow active:scale-95 transition-transform"
    >
      <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style="background: var(--color-primary)15">🌙</div>
      <div class="flex-1">
        <p class="font-bold text-gray-800">{{ $t('admin.manageEvents') }}</p>
        <p class="text-xs text-gray-400">{{ eventsCount }} {{ $t('common.event') }}</p>
      </div>
      <span class="text-gray-300 text-xl">›</span>
    </NuxtLink>

    <NuxtLink to="/admin/members"
      class="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow active:scale-95 transition-transform"
    >
      <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style="background: var(--color-secondary)15">👨‍👩‍👧</div>
      <div class="flex-1">
        <p class="font-bold text-gray-800">{{ $t('admin.manageMembers') }}</p>
        <p class="text-xs text-gray-400">{{ membersCount }} {{ $t('common.member') }}</p>
      </div>
      <span class="text-gray-300 text-xl">›</span>
    </NuxtLink>

    <NuxtLink to="/admin/transactions"
      class="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow active:scale-95 transition-transform"
    >
      <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style="background: var(--color-accent)15">📋</div>
      <div class="flex-1">
        <p class="font-bold text-gray-800">{{ $t('admin.allTransactions') }}</p>
        <p class="text-xs text-gray-400">{{ transactionsCount }} {{ $t('common.total').toLowerCase() }}</p>
      </div>
      <span class="text-gray-300 text-xl">›</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const eventsStore = useEventsStore()
const membersStore = useMembersStore()
const transactionsStore = useTransactionsStore()

const eventsCount = computed(() => eventsStore.events.length)
const membersCount = computed(() => membersStore.members.length)
const transactionsCount = computed(() => transactionsStore.transactions.length)
</script>
