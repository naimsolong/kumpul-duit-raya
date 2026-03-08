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

      <!-- Giver + Note inputs -->
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

      <!-- Denomination picker -->
      <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 text-center">{{ $t('wallet.slideInstruction') }}</p>

        <div class="flex justify-center mb-5">
          <WalletSlot ref="walletSlotRef" />
        </div>

        <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{{ $t('wallet.coins') }}</p>
        <div class="flex gap-2 mb-4">
          <MoneyCard
            v-for="coin in COINS"
            :key="coin.label"
            :denomination="coin"
            :count="basket[coin.label] ?? 0"
            @slide="onSlide"
          />
        </div>

        <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{{ $t('wallet.notes') }}</p>
        <div class="grid grid-cols-3 gap-2">
          <MoneyCard
            v-for="note in NOTES"
            :key="note.label"
            :denomination="note"
            :count="basket[note.label] ?? 0"
            @slide="onSlide"
            class="h-16"
          />
        </div>

        <!-- Basket summary -->
        <template v-if="basketHasItems">
          <div class="mt-4 pt-4 border-t border-gray-100">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{{ $t('wallet.basket') }}</p>
            <div class="space-y-2">
              <div v-for="item in basketItems" :key="item.label" class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0" :style="getDenomStyle(item.label)">{{ item.shortLabel }}</div>
                <span class="text-sm text-gray-500 flex-1">× {{ item.count }}</span>
                <span class="text-sm font-bold text-gray-800 mr-2">{{ formatMYR(item.subtotal) }}</span>
                <button class="w-6 h-6 rounded-full bg-gray-100 text-gray-500 font-bold flex items-center justify-center hover:bg-gray-200 transition-colors text-base leading-none" @click="decrement(item.label)">−</button>
                <button class="w-6 h-6 rounded-full bg-gray-100 text-gray-500 font-bold flex items-center justify-center hover:bg-gray-200 transition-colors text-base leading-none" @click="increment(item.label)">+</button>
              </div>
            </div>
            <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide">{{ $t('common.total') }}</p>
                <p class="text-2xl font-black" style="color: var(--color-primary)">{{ formatMYR(basketTotal) }}</p>
              </div>
              <div class="flex gap-2">
                <button class="px-3 py-2 rounded-xl text-xs font-bold text-gray-400 border border-gray-200 hover:bg-gray-50 transition-colors" @click="clearBasket">{{ $t('wallet.clear') }}</button>
                <button class="px-5 py-2 rounded-xl text-sm font-black text-white transition-colors shadow-md" style="background: linear-gradient(135deg, var(--color-primary), var(--color-secondary))" @click="saveTransaction">{{ $t('wallet.saveTransaction') }}</button>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Transaction history -->
      <div v-if="transactions.length > 0" class="space-y-2">
        <h2 class="font-black text-gray-700">{{ $t('wallet.history') }}</h2>
        <div
          v-for="tx in transactions"
          :key="tx.id"
          class="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm"
        >
          <div class="flex items-start gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap gap-1 mb-1.5">
                <span
                  v-for="(qty, label) in tx.denominations"
                  :key="label"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-white text-xs font-bold"
                  :style="getDenomStyle(label as string)"
                >{{ label }} ×{{ qty }}</span>
              </div>
              <p class="font-bold text-sm text-gray-800">{{ formatMYR(tx.amount) }}</p>
              <p class="text-xs text-gray-400 truncate">
                {{ $t('wallet.from') }} {{ tx.fromName || '—' }}
                <span v-if="tx.note"> · {{ tx.note }}</span>
              </p>
            </div>
            <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
              <p class="text-xs text-gray-400">{{ formatDate(tx.timestamp) }}</p>
              <div class="flex gap-2">
                <button class="text-xs text-blue-400 hover:text-blue-600 transition-colors font-semibold" @click="openEdit(tx)">{{ $t('common.edit') }}</button>
                <button class="text-xs text-red-300 hover:text-red-500 transition-colors" @click="deleteTransaction(tx.id)">✕</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EmptyState v-else icon="💸" :title="$t('wallet.noTransactions')" :description="$t('wallet.noTransactionsDesc')" />
    </template>

    <!-- Edit modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="editingTx" class="fixed inset-0 z-50 flex items-end justify-center">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeEdit" />

          <!-- Sheet -->
          <div class="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <!-- Handle -->
            <div class="flex justify-center pt-3 pb-1">
              <div class="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div class="p-5 space-y-4">
              <!-- Header -->
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-black text-gray-800">{{ $t('wallet.editTransaction') }}</h2>
                <button class="text-gray-400 hover:text-gray-600 text-xl leading-none" @click="closeEdit">×</button>
              </div>

              <!-- Giver + Note -->
              <div class="space-y-3">
                <div>
                  <label class="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">{{ $t('wallet.fromLabel') }}</label>
                  <input
                    v-model="editFromName"
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
                    v-model="editNote"
                    type="text"
                    class="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 focus:outline-none text-sm"
                    :placeholder="$t('wallet.notePlaceholder')"
                    @focus="(e) => (e.target as HTMLElement).style.borderColor = 'var(--color-primary)'"
                    @blur="(e) => (e.target as HTMLElement).style.borderColor = '#e5e7eb'"
                  />
                </div>
              </div>

              <!-- Denomination picker -->
              <div>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{{ $t('wallet.coins') }}</p>
                <div class="flex gap-2 mb-3">
                  <MoneyCard
                    v-for="coin in COINS"
                    :key="coin.label"
                    :denomination="coin"
                    :count="editBasket[coin.label] ?? 0"
                    @slide="onEditSlide"
                  />
                </div>

                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{{ $t('wallet.notes') }}</p>
                <div class="grid grid-cols-3 gap-2">
                  <MoneyCard
                    v-for="note in NOTES"
                    :key="note.label"
                    :denomination="note"
                    :count="editBasket[note.label] ?? 0"
                    @slide="onEditSlide"
                    class="h-16"
                  />
                </div>
              </div>

              <!-- Edit basket summary -->
              <template v-if="editBasketHasItems">
                <div class="pt-3 border-t border-gray-100 space-y-2">
                  <div v-for="item in editBasketItems" :key="item.label" class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0" :style="getDenomStyle(item.label)">{{ item.shortLabel }}</div>
                    <span class="text-sm text-gray-500 flex-1">× {{ item.count }}</span>
                    <span class="text-sm font-bold text-gray-800 mr-2">{{ formatMYR(item.subtotal) }}</span>
                    <button class="w-6 h-6 rounded-full bg-gray-100 text-gray-500 font-bold flex items-center justify-center hover:bg-gray-200 transition-colors text-base leading-none" @click="editDecrement(item.label)">−</button>
                    <button class="w-6 h-6 rounded-full bg-gray-100 text-gray-500 font-bold flex items-center justify-center hover:bg-gray-200 transition-colors text-base leading-none" @click="editIncrement(item.label)">+</button>
                  </div>
                </div>
              </template>

              <!-- Total + actions -->
              <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p class="text-xs text-gray-400 uppercase tracking-wide">{{ $t('common.total') }}</p>
                  <p class="text-2xl font-black" style="color: var(--color-primary)">{{ formatMYR(editBasketTotal) }}</p>
                </div>
                <div class="flex gap-2">
                  <button class="px-3 py-2 rounded-xl text-xs font-bold text-gray-400 border border-gray-200 hover:bg-gray-50 transition-colors" @click="closeEdit">{{ $t('common.cancel') }}</button>
                  <button
                    class="px-5 py-2 rounded-xl text-sm font-black text-white transition-colors shadow-md disabled:opacity-50"
                    style="background: linear-gradient(135deg, var(--color-primary), var(--color-secondary))"
                    :disabled="!editBasketHasItems"
                    @click="saveEdit"
                  >{{ $t('wallet.saveChanges') }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { COINS, NOTES, ALL_DENOMINATIONS, formatMYR } from '~/utils/currency'
import type { Transaction } from '~/stores/types'

const route = useRoute()
const memberId = computed(() => route.params.memberId as string)
const walletSlotRef = ref<InstanceType<typeof WalletSlot> | null>(null)

const { member, transactions, balance, addMoney } = useWallet(memberId)
const transactionsStore = useTransactionsStore()

// ── Add transaction state ──────────────────────────────────────────────────
const fromName = ref('')
const noteText = ref('')
const basket = ref<Record<string, number>>({})

const basketItems = computed(() =>
  ALL_DENOMINATIONS
    .filter(d => (basket.value[d.label] ?? 0) > 0)
    .map(d => ({
      label: d.label,
      shortLabel: d.type === 'coin' ? d.label.replace(' sen', '') : d.label,
      count: basket.value[d.label],
      subtotal: basket.value[d.label] * d.value,
    }))
)
const basketHasItems = computed(() => basketItems.value.length > 0)
const basketTotal = computed(() => basketItems.value.reduce((sum, i) => sum + i.subtotal, 0))

function onSlide(denomination: (typeof COINS)[number] | (typeof NOTES)[number]) {
  if (!member.value) return
  basket.value[denomination.label] = (basket.value[denomination.label] ?? 0) + 1
}
function increment(label: string) { basket.value[label] = (basket.value[label] ?? 0) + 1 }
function decrement(label: string) {
  if ((basket.value[label] ?? 0) <= 1) { const u = { ...basket.value }; delete u[label]; basket.value = u }
  else basket.value[label]--
}
function clearBasket() { basket.value = {} }
function saveTransaction() {
  if (!member.value || !basketHasItems.value) return
  addMoney({ amount: basketTotal.value, denominations: { ...basket.value }, fromName: fromName.value, note: noteText.value })
  walletSlotRef.value?.trigger(basketTotal.value)
  clearBasket()
}

// ── Edit transaction state ─────────────────────────────────────────────────
const editingTx = ref<Transaction | null>(null)
const editFromName = ref('')
const editNote = ref('')
const editBasket = ref<Record<string, number>>({})

const editBasketItems = computed(() =>
  ALL_DENOMINATIONS
    .filter(d => (editBasket.value[d.label] ?? 0) > 0)
    .map(d => ({
      label: d.label,
      shortLabel: d.type === 'coin' ? d.label.replace(' sen', '') : d.label,
      count: editBasket.value[d.label],
      subtotal: editBasket.value[d.label] * d.value,
    }))
)
const editBasketHasItems = computed(() => editBasketItems.value.length > 0)
const editBasketTotal = computed(() => editBasketItems.value.reduce((sum, i) => sum + i.subtotal, 0))

function openEdit(tx: Transaction) {
  editingTx.value = tx
  editFromName.value = tx.fromName
  editNote.value = tx.note
  editBasket.value = { ...tx.denominations }
}
function closeEdit() {
  editingTx.value = null
  editBasket.value = {}
}
function onEditSlide(denomination: (typeof COINS)[number] | (typeof NOTES)[number]) {
  editBasket.value[denomination.label] = (editBasket.value[denomination.label] ?? 0) + 1
}
function editIncrement(label: string) { editBasket.value[label] = (editBasket.value[label] ?? 0) + 1 }
function editDecrement(label: string) {
  if ((editBasket.value[label] ?? 0) <= 1) { const u = { ...editBasket.value }; delete u[label]; editBasket.value = u }
  else editBasket.value[label]--
}
function saveEdit() {
  if (!editingTx.value || !editBasketHasItems.value) return
  transactionsStore.updateTransaction(editingTx.value.id, {
    denominations: { ...editBasket.value },
    amount: editBasketTotal.value,
    fromName: editFromName.value,
    note: editNote.value,
  })
  closeEdit()
}

// ── Shared helpers ─────────────────────────────────────────────────────────
function deleteTransaction(id: string) { transactionsStore.deleteTransaction(id) }
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
function getDenomStyle(label: string) {
  const found = ALL_DENOMINATIONS.find(d => d.label === label)
  return { background: found?.bgGradient ?? 'var(--color-primary)' }
}
</script>

<style scoped>
.modal-enter-active { transition: opacity 0.2s ease; }
.modal-leave-active { transition: opacity 0.15s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .relative,
.modal-leave-active .relative { transition: transform 0.25s ease; }
.modal-enter-from .relative { transform: translateY(100%); }
.modal-leave-to .relative { transform: translateY(100%); }
</style>
