<template>
  <div class="space-y-6">
    <!-- SEO: allow indexing on landing/home page only -->
    <Head>
      <Meta name="robots" content="index, follow" />
      <Title>{{ $t('common.appName') }} — {{ $t('common.tagline') }}</Title>
    </Head>

    <!-- Active Event Banner -->
    <div v-if="activeEvent"
      class="rounded-2xl p-5 text-white relative overflow-hidden"
      style="background: linear-gradient(135deg, var(--color-primary), var(--color-secondary))"
    >
      <div class="absolute top-0 right-0 text-8xl opacity-10 -translate-y-2 translate-x-2 pointer-events-none select-none">{{ activeEvent.emoji }}</div>
      <p class="text-white/70 text-sm font-semibold uppercase tracking-wide mb-1">{{ $t('home.activeEvent') }}</p>
      <h1 class="text-2xl font-black">{{ activeEvent.emoji }} {{ activeEvent.name }}</h1>
      <div class="mt-3 flex items-end justify-between">
        <div>
          <p class="text-white/70 text-xs">{{ $t('home.totalCollected') }}</p>
          <p class="text-3xl font-black">{{ eventTotalFormatted }}</p>
        </div>
        <div class="flex gap-2">
          <NuxtLink to="/leaderboard"
            class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >🏆 {{ $t('nav.leaderboard') }}</NuxtLink>
          <NuxtLink to="/export"
            class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >📄 {{ $t('export.title') }}</NuxtLink>
        </div>
      </div>
    </div>

    <!-- No events at all: onboarding wizard or plain fallback after skip -->
    <template v-else-if="noEvents">
      <OnboardingFlow v-if="!onboardingDismissed" @dismiss="onboardingDismissed = true" />
      <div v-else class="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center space-y-3">
        <div class="text-5xl">🌙</div>
        <p class="font-bold text-gray-600">{{ $t('home.noEvent') }}</p>
        <p class="text-sm text-gray-400">{{ $t('home.createEventPrompt') }}</p>
        <NuxtLink to="/admin/events/new"
          class="inline-block mt-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm"
          style="background: var(--color-primary)"
        >{{ $t('home.goToAdmin') }}</NuxtLink>
      </div>
    </template>

    <!-- Events exist but none active -->
    <div v-else class="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center space-y-3">
      <div class="text-5xl">🌙</div>
      <p class="font-bold text-gray-600">{{ $t('home.noEvent') }}</p>
      <p class="text-sm text-gray-400">{{ $t('home.createEventPrompt') }}</p>
      <NuxtLink to="/admin/events"
        class="inline-block mt-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm"
        style="background: var(--color-primary)"
      >{{ $t('home.goToAdmin') }}</NuxtLink>
    </div>

    <!-- Members grid -->
    <div v-if="members.length > 0">
      <h2 class="font-black text-gray-700 mb-3">{{ $t('home.allMembers') }}</h2>
      <div class="grid grid-cols-2 gap-3">
        <NuxtLink
          v-for="member in members"
          :key="member.id"
          :to="`/wallet/${member.id}`"
          class="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-shadow border border-gray-100 active:scale-95 transition-transform"
        >
          <MemberAvatar :avatar="member.avatar" :color="member.color" size="lg" />
          <p class="font-bold text-gray-800 text-sm text-center">{{ member.name }}</p>
          <p class="font-black text-sm" style="color: var(--color-primary)">
            {{ memberBalance(member.id) }}
          </p>
          <span class="text-xs px-2 py-0.5 rounded-full font-semibold" style="background: var(--color-primary)15; color: var(--color-primary)">
            {{ $t('home.viewWallet') }} →
          </span>
        </NuxtLink>
      </div>
    </div>

    <EmptyState v-else-if="settingsStore.setupComplete"
      icon="👨‍👩‍👧‍👦"
      :title="$t('home.noMembers')"
      :description="$t('home.addMemberPrompt')"
    >
      <NuxtLink to="/admin/members/new"
        class="inline-block px-5 py-2.5 rounded-xl font-bold text-white text-sm"
        style="background: var(--color-primary)"
      >{{ $t('common.add') }}</NuxtLink>
    </EmptyState>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatMYR } from '~/utils/currency'

const eventsStore = useEventsStore()
const onboardingDismissed = ref(false)
const membersStore = useMembersStore()
const transactionsStore = useTransactionsStore()
const settingsStore = useSettingsStore()

const activeEvent = computed(() => eventsStore.activeEvent)
const noEvents = computed(() => eventsStore.events.length === 0)
const members = computed(() => membersStore.sortedMembers)

const eventTotalFormatted = computed(() => {
  const id = activeEvent.value?.id ?? ''
  return formatMYR(transactionsStore.totalForEvent(id))
})

function memberBalance(memberId: string) {
  const id = activeEvent.value?.id ?? ''
  return formatMYR(transactionsStore.totalForMember(memberId, id))
}
</script>
