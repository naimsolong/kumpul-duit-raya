<template>
  <div class="space-y-5 pb-4">
    <!-- Member not found -->
    <EmptyState v-if="!member" icon="❓" :title="$t('common.empty')" />

    <template v-else>
      <!-- Header card -->
      <div class="rounded-2xl p-5 text-white" style="background: linear-gradient(135deg, var(--color-primary), var(--color-secondary))">
        <div class="flex items-center gap-3 mb-4">
          <MemberAvatar :avatar="member.avatar" :color="member.color + '44'" size="xl" />
          <div>
            <p class="text-white/70 text-sm">{{ $t('wallet.title') }}</p>
            <h1 class="text-2xl font-black">{{ member.name }}</h1>
          </div>
        </div>
        <p class="text-white/70 text-sm font-semibold uppercase tracking-wide">{{ $t('wallet.balance') }}</p>
        <p class="text-4xl font-black mt-1 transition-all" :key="balance">{{ formatMYR(balance) }}</p>
        <p class="text-white/50 text-xs mt-1">{{ transactions.length }} {{ $t('wallet.totalTransactions') }}</p>
      </div>

      <!-- From input -->
      <div class="bg-white rounded-2xl p-4 space-y-3 border border-gray-100 shadow-sm">
        <div>
          <label class="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">{{ $t('wallet.fromLabel') }}</label>
          <input
            v-model="fromName"
            type="text"
            class="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-gray-800 focus:outline-none text-sm"
            :placeholder="$t('wallet.fromPlaceholder')"
            @focus="(e) => (e.target as HTMLElement).style.borderColor = 'var(--color-primary)'"
            @blur="(e) => (e.target as HTMLElement).style.borderColor = '#e5e7eb'"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">{{ $t('wallet.noteLabel') }}</label>
          <input
            v-model="noteText"
            type="text"
            class="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 focus:outline-none text-sm"
            :placeholder="$t('wallet.notePlaceholder')"
            @focus="(e) => (e.target as HTMLElement).style.borderColor = 'var(--color-primary)'"
            @blur="(e) => (e.target as HTMLElement).style.borderColor = '#e5e7eb'"
          />
        </div>
      </div>

      <!-- Slide zone -->
      <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 text-center">{{ $t('wallet.slideInstruction') }}</p>

        <!-- Wallet slot centered -->
        <div class="flex justify-center mb-5">
          <WalletSlot ref="walletSlotRef" />
        </div>

        <!-- Coins -->
        <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{{ $t('wallet.coins') }}</p>
        <div class="flex gap-2 mb-4">
          <MoneyCard v-for="coin in COINS" :key="coin.label" :denomination="coin" @slide="onSlide" />
        </div>

        <!-- Notes -->
        <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{{ $t('wallet.notes') }}</p>
        <div class="grid grid-cols-3 gap-2">
          <MoneyCard
            v-for="note in NOTES"
            :key="note.label"
            :denomination="note"
            @slide="onSlide"
            class="h-16"
          />
        </div>
      </div>

      <!-- Transaction history -->
      <div v-if="transactions.length > 0" class="space-y-2">
        <h2 class="font-black text-gray-700">{{ $t('wallet.history') }}</h2>
        <div
          v-for="tx in transactions"
          :key="tx.id"
          class="bg-white rounded-2xl p-3 flex items-center gap-3 border border-gray-100 shadow-sm"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
            :style="getDenomStyle(tx.denomination)"
          >
            {{ tx.denomination }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-bold text-sm text-gray-800">{{ formatMYR(tx.amount) }}</p>
            <p class="text-xs text-gray-400 truncate">
              {{ $t('wallet.from') }} {{ tx.fromName || '—' }}
              <span v-if="tx.note"> · {{ tx.note }}</span>
            </p>
          </div>
          <div class="flex flex-col items-end gap-1">
            <p class="text-xs text-gray-400">{{ formatDate(tx.timestamp) }}</p>
            <button class="text-xs text-red-300 hover:text-red-500 transition-colors" @click="deleteTransaction(tx.id)">✕</button>
          </div>
        </div>
      </div>

      <EmptyState v-else icon="💸" :title="$t('wallet.noTransactions')" :description="$t('wallet.noTransactionsDesc')" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { COINS, NOTES, formatMYR } from '~/utils/currency'

const route = useRoute()
const memberId = computed(() => route.params.memberId as string)
const walletSlotRef = ref<InstanceType<typeof WalletSlot> | null>(null)

const { member, transactions, balance, addMoney } = useWallet(memberId)
const transactionsStore = useTransactionsStore()

const fromName = ref('')
const noteText = ref('')

function onSlide(denomination: (typeof COINS)[number] | (typeof NOTES)[number]) {
  if (!member.value) return
  addMoney({ amount: denomination.value, denomination: denomination.label, fromName: fromName.value || '—', note: noteText.value })
  walletSlotRef.value?.trigger(denomination.value)
}

function deleteTransaction(id: string) {
  transactionsStore.deleteTransaction(id)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function getDenomStyle(label: string) {
  const all = [...COINS, ...NOTES]
  const found = all.find(d => d.label === label)
  return { background: found?.bgGradient ?? 'var(--color-primary)' }
}
</script>
