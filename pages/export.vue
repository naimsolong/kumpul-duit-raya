<template>
  <div class="space-y-5 pb-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <NuxtLink to="/" class="text-gray-400 hover:text-gray-600 text-xl leading-none">←</NuxtLink>
        <h1 class="text-xl font-black" style="color: var(--color-primary)">{{ $t('export.title') }}</h1>
      </div>
      <button
        v-if="activeEvent"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black text-white shadow-md transition-opacity"
        :class="generating ? 'opacity-60 pointer-events-none' : ''"
        style="background: linear-gradient(135deg, var(--color-primary), var(--color-secondary))"
        @click="downloadPDF"
      >
        <span>{{ generating ? $t('export.generating') : '📄 ' + $t('export.downloadPdf') }}</span>
      </button>
    </div>

    <!-- No active event -->
    <EmptyState v-if="!activeEvent" icon="📭" :title="$t('export.noEvent')" />

    <template v-else>
      <!-- Event summary card -->
      <div
        class="rounded-2xl p-5 text-white relative overflow-hidden"
        style="background: linear-gradient(135deg, var(--color-primary), var(--color-secondary))"
      >
        <div class="absolute top-0 right-0 text-8xl opacity-10 -translate-y-2 translate-x-2 pointer-events-none select-none">{{ activeEvent.emoji }}</div>
        <h2 class="text-2xl font-black">{{ activeEvent.emoji }} {{ activeEvent.name }}</h2>
        <p class="text-white/70 text-sm mt-1">{{ activeEvent.year }}</p>
        <div class="mt-3 flex gap-6">
          <div>
            <p class="text-white/60 text-xs uppercase tracking-wide">{{ $t('home.totalCollected') }}</p>
            <p class="text-2xl font-black">{{ eventTotalFormatted }}</p>
          </div>
          <div>
            <p class="text-white/60 text-xs uppercase tracking-wide">{{ $t('common.member') }}</p>
            <p class="text-2xl font-black">{{ members.length }}</p>
          </div>
          <div>
            <p class="text-white/60 text-xs uppercase tracking-wide">{{ $t('export.totalTransactions') }}</p>
            <p class="text-2xl font-black">{{ allTxCount }}</p>
          </div>
        </div>
      </div>

      <!-- Leaderboard -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-4 pt-4 pb-2">
          <h2 class="font-black text-gray-700">🏆 {{ $t('export.leaderboard') }}</h2>
        </div>
        <div class="divide-y divide-gray-50">
          <div
            v-for="entry in entries"
            :key="entry.member.id"
            class="flex items-center gap-3 px-4 py-3"
          >
            <span class="text-sm font-black w-6 text-center" :class="rankColor(entry.rank)">
              {{ rankEmoji(entry.rank) }}
            </span>
            <MemberAvatar :avatar="entry.member.avatar" :color="entry.member.color" size="sm" />
            <div class="flex-1 min-w-0">
              <p class="font-bold text-sm text-gray-800 truncate">{{ entry.member.name }}</p>
              <div class="mt-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div class="h-full rounded-full transition-all" :style="{ width: entry.share + '%', background: 'var(--color-primary)' }" />
              </div>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="font-black text-sm" style="color: var(--color-primary)">{{ entry.totalFormatted }}</p>
              <p class="text-xs text-gray-400">{{ entry.share }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions section -->
      <div class="space-y-4">
        <!-- Sort controls -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">{{ $t('export.sortBy') }}:</span>
          <button
            v-for="opt in sortOptions"
            :key="opt.key"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border"
            :class="sortKey === opt.key
              ? 'text-white border-transparent'
              : 'text-gray-500 border-gray-200 bg-white hover:bg-gray-50'"
            :style="sortKey === opt.key ? 'background: var(--color-primary); border-color: var(--color-primary)' : ''"
            @click="setSort(opt.key)"
          >
            {{ opt.label }} {{ sortKey === opt.key ? (sortDir === 'asc' ? '↑' : '↓') : '' }}
          </button>
        </div>

        <!-- Per-member transaction tables -->
        <div
          v-for="entry in entries"
          :key="entry.member.id"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <!-- Member header -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <div class="flex items-center gap-2">
              <MemberAvatar :avatar="entry.member.avatar" :color="entry.member.color" size="sm" />
              <p class="font-black text-gray-800">{{ entry.member.name }}</p>
            </div>
            <p class="font-black text-sm" style="color: var(--color-primary)">{{ entry.totalFormatted }}</p>
          </div>

          <!-- Transaction rows -->
          <div v-if="memberTxns(entry.member.id).length > 0">
            <!-- Column headers -->
            <div class="grid grid-cols-[1fr_1fr_auto] gap-2 px-4 py-2 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wide">
              <span>{{ $t('export.sortDate') }} / {{ $t('export.sortGiver') }}</span>
              <span>{{ $t('export.denominations') }}</span>
              <span class="text-right">{{ $t('export.sortAmount') }}</span>
            </div>
            <div class="divide-y divide-gray-50">
              <div
                v-for="tx in memberTxns(entry.member.id)"
                :key="tx.id"
                class="grid grid-cols-[1fr_1fr_auto] gap-2 px-4 py-2.5 items-start"
              >
                <div class="min-w-0">
                  <p class="text-xs text-gray-500">{{ formatDate(tx.timestamp) }}</p>
                  <p class="text-sm font-semibold text-gray-700 truncate">{{ tx.fromName || '—' }}</p>
                  <p v-if="tx.note" class="text-xs text-gray-400 truncate">{{ tx.note }}</p>
                </div>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(qty, label) in tx.denominations"
                    :key="label"
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-white text-[10px] font-bold leading-none"
                    :style="getDenomStyle(label as string)"
                  >{{ label }}×{{ qty }}</span>
                </div>
                <p class="text-sm font-black text-right" style="color: var(--color-primary)">{{ formatMYR(tx.amount) }}</p>
              </div>
            </div>
          </div>
          <p v-else class="px-4 py-3 text-sm text-gray-400">{{ $t('export.noTransactions') }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatMYR, ALL_DENOMINATIONS } from '~/utils/currency'

const { t } = useI18n()
const eventsStore = useEventsStore()
const transactionsStore = useTransactionsStore()
const membersStore = useMembersStore()

const activeEvent = computed(() => eventsStore.activeEvent)
const members = computed(() => membersStore.sortedMembers)
const { entries, eventTotalFormatted, eventTotal } = useLeaderboard()

const allTxCount = computed(() =>
  activeEvent.value ? transactionsStore.forEvent(activeEvent.value.id).length : 0
)

// ── Sort ──────────────────────────────────────────────────────────────────
type SortKey = 'timestamp' | 'amount' | 'fromName'
const sortKey = ref<SortKey>('timestamp')
const sortDir = ref<'asc' | 'desc'>('desc')

const sortOptions = computed(() => [
  { key: 'timestamp' as SortKey, label: t('export.sortDate') },
  { key: 'amount' as SortKey, label: t('export.sortAmount') },
  { key: 'fromName' as SortKey, label: t('export.sortGiver') },
])

function setSort(key: SortKey) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'desc'
  }
}

function memberTxns(memberId: string) {
  const eventId = activeEvent.value?.id ?? ''
  const raw = transactionsStore.forMember(memberId, eventId)
  return [...raw].sort((a, b) => {
    let cmp = 0
    if (sortKey.value === 'timestamp') cmp = a.timestamp.localeCompare(b.timestamp)
    else if (sortKey.value === 'amount') cmp = a.amount - b.amount
    else cmp = (a.fromName || '').localeCompare(b.fromName || '')
    return sortDir.value === 'asc' ? cmp : -cmp
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

function getDenomStyle(label: string) {
  const found = ALL_DENOMINATIONS.find(d => d.label === label)
  return { background: found?.bgGradient ?? 'var(--color-primary)' }
}

function rankEmoji(rank: number) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}

function rankColor(rank: number) {
  if (rank === 1) return 'text-yellow-500'
  if (rank === 2) return 'text-gray-400'
  if (rank === 3) return 'text-amber-600'
  return 'text-gray-400'
}

function formatDenominations(denominations: Record<string, number>) {
  return Object.entries(denominations)
    .map(([label, qty]) => `${label}×${qty}`)
    .join(', ')
}

// ── PDF generation ────────────────────────────────────────────────────────
const generating = ref(false)

async function downloadPDF() {
  if (!activeEvent.value || generating.value) return
  generating.value = true

  try {
    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default

    const primary = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-primary').trim() || '#16a34a'
    // Ensure hex format for jsPDF
    const primaryHex = primary.startsWith('#') ? primary : '#16a34a'

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const margin = 14
    let y = margin

    // ── Cover / event header ────────────────────────────────────────────
    doc.setFillColor(primaryHex)
    doc.roundedRect(margin, y, pageW - margin * 2, 28, 3, 3, 'F')
    doc.setTextColor('#ffffff')
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(`${activeEvent.value.emoji}  ${activeEvent.value.name}`, margin + 4, y + 10)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`${t('home.totalCollected')}: ${eventTotalFormatted.value}   ·   ${members.value.length} ${t('export.members')}   ·   ${allTxCount.value} ${t('export.totalTransactions')}`, margin + 4, y + 18)
    doc.text(`${t('export.generatedOn')}: ${new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}`, margin + 4, y + 24)
    y += 34

    // ── Leaderboard ──────────────────────────────────────────────────────
    doc.setTextColor('#1f2937')
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`🏆  ${t('export.leaderboard')}`, margin, y)
    y += 5

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [[t('export.rank'), t('common.member'), t('common.total'), t('export.share')]],
      body: entries.value.map(e => [
        rankEmoji(e.rank),
        `${e.member.avatar}  ${e.member.name}`,
        e.totalFormatted,
        `${e.share}%`,
      ]),
      headStyles: { fillColor: primaryHex, textColor: '#ffffff', fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: '#f9fafb' },
      columnStyles: { 0: { cellWidth: 14 }, 2: { halign: 'right' }, 3: { halign: 'right', cellWidth: 16 } },
    })

    y = (doc as any).lastAutoTable.finalY + 10

    // ── Per-member transaction tables ─────────────────────────────────────
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor('#1f2937')
    doc.text(`💸  ${t('export.transactions')}`, margin, y)
    y += 6

    for (const entry of entries.value) {
      // Check if we need a new page
      if (y > 250) { doc.addPage(); y = margin }

      // Member heading row
      doc.setFillColor('#f3f4f6')
      doc.roundedRect(margin, y, pageW - margin * 2, 8, 2, 2, 'F')
      doc.setTextColor(primaryHex)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(`${entry.member.avatar}  ${entry.member.name}`, margin + 3, y + 5.5)
      doc.setTextColor('#1f2937')
      doc.text(entry.totalFormatted, pageW - margin - 3, y + 5.5, { align: 'right' })
      y += 10

      const txns = memberTxns(entry.member.id)

      if (txns.length === 0) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor('#9ca3af')
        doc.text(t('export.noTransactions'), margin + 3, y + 4)
        y += 10
        continue
      }

      autoTable(doc, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [[t('common.date'), t('export.sortGiver'), t('export.denominations'), t('export.sortAmount'), t('common.note')]],
        body: txns.map(tx => [
          formatDateShort(tx.timestamp),
          tx.fromName || '—',
          formatDenominations(tx.denominations),
          formatMYR(tx.amount),
          tx.note || '',
        ]),
        headStyles: { fillColor: '#6b7280', textColor: '#ffffff', fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: '#f9fafb' },
        columnStyles: {
          0: { cellWidth: 28 },
          3: { halign: 'right', cellWidth: 20 },
          4: { cellWidth: 30 },
        },
      })

      y = (doc as any).lastAutoTable.finalY + 6
    }

    // ── Footer on each page ──────────────────────────────────────────────
    const totalPages = (doc.internal as any).getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor('#9ca3af')
      doc.text(
        `${t('common.appName')} — ${t('export.generatedOn')} ${new Date().toLocaleDateString()}   |   ${i} / ${totalPages}`,
        pageW / 2, doc.internal.pageSize.getHeight() - 8,
        { align: 'center' }
      )
    }

    const slug = activeEvent.value.name.replace(/\s+/g, '-').toLowerCase()
    doc.save(`kumpul-duit-raya-${slug}-${new Date().toISOString().slice(0, 10)}.pdf`)
  } finally {
    generating.value = false
  }
}
</script>
