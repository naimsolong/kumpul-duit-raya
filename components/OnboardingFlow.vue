<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="text-center pt-2">
      <div class="text-5xl mb-2">🌙</div>
      <h2 class="text-2xl font-black" style="color: var(--color-primary)">{{ $t('onboarding.title') }}</h2>
      <p class="text-gray-400 text-sm mt-1">{{ $t('onboarding.subtitle') }}</p>
    </div>

    <!-- Step indicator -->
    <div class="flex items-center justify-center gap-2">
      <div v-for="i in 2" :key="i"
        class="h-2 rounded-full transition-all duration-300"
        :style="step >= i
          ? 'width: 2rem; background: var(--color-primary)'
          : 'width: 0.5rem; background: #e5e7eb'"
      />
    </div>
    <p class="text-center text-xs text-gray-400">{{ $t('setup.step') }} {{ step }} {{ $t('setup.of') }} 2</p>

    <!-- Step 1: Create Event -->
    <div v-if="step === 1" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h3 class="font-bold text-gray-700">{{ $t('setup.step2Title') }}</h3>

      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">{{ $t('setup.eventName') }}</label>
        <input
          v-model="eventName"
          type="text"
          class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none text-gray-800 font-semibold transition-colors"
          :placeholder="$t('setup.eventNamePlaceholder')"
          @focus="(e) => (e.target as HTMLElement).style.borderColor = 'var(--color-primary)'"
          @blur="(e) => (e.target as HTMLElement).style.borderColor = '#e5e7eb'"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-2">{{ $t('setup.eventEmoji') }}</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="em in eventEmojis"
            :key="em"
            class="w-10 h-10 text-xl rounded-xl border-2 transition-all"
            :class="eventEmoji === em ? 'scale-110' : 'border-gray-200'"
            :style="eventEmoji === em ? 'border-color: var(--color-primary); background: var(--color-primary)20' : ''"
            @click="eventEmoji = em"
          >{{ em }}</button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-2">{{ $t('setup.themeColor') }}</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="preset in THEME_PRESETS"
            :key="preset.id"
            class="flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left"
            :class="selectedPreset === preset.id ? '' : 'border-gray-200'"
            :style="selectedPreset === preset.id ? `border-color: ${preset.colors.primary}` : ''"
            @click="selectPreset(preset)"
          >
            <div
              class="w-5 h-5 rounded-full flex-shrink-0"
              :style="{ background: `linear-gradient(135deg, ${preset.colors.primary}, ${preset.colors.secondary})` }"
            />
            <span class="text-xs font-semibold text-gray-700 truncate">{{ $t(preset.nameKey) }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Step 2: Add Members -->
    <div v-if="step === 2" class="space-y-3">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 class="font-bold text-gray-700 mb-1">{{ $t('setup.step3Title') }}</h3>
        <p class="text-xs text-gray-400">{{ $t('onboarding.step2Desc') }}</p>
      </div>

      <div
        v-for="(member, idx) in newMembers"
        :key="idx"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-11 h-11 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
            :style="{ backgroundColor: memberColors[idx % memberColors.length] }"
          >{{ member.avatar }}</div>
          <input
            v-model="member.name"
            type="text"
            class="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 font-semibold text-gray-800 focus:outline-none transition-colors"
            :placeholder="$t('setup.memberNamePlaceholder')"
            @focus="(e) => (e.target as HTMLElement).style.borderColor = 'var(--color-primary)'"
            @blur="(e) => (e.target as HTMLElement).style.borderColor = '#e5e7eb'"
          />
          <button
            v-if="newMembers.length > 1"
            class="text-red-400 hover:text-red-600 text-xl flex-shrink-0"
            @click="newMembers.splice(idx, 1)"
          >✕</button>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1">{{ $t('setup.memberAvatar') }}</label>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="em in avatarEmojis"
              :key="em"
              class="w-8 h-8 text-lg rounded-lg border transition-all"
              :class="member.avatar === em ? 'scale-110' : 'border-gray-200'"
              :style="member.avatar === em ? 'border-color: var(--color-primary); background: var(--color-primary)15' : ''"
              @click="member.avatar = em"
            >{{ em }}</button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1">{{ $t('setup.memberRole') }}</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="role in roles"
              :key="role.value"
              class="px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
              :class="member.role === role.value ? 'text-white' : 'border-gray-200 text-gray-600'"
              :style="member.role === role.value ? 'background: var(--color-primary); border-color: var(--color-primary)' : ''"
              @click="member.role = role.value"
            >{{ role.label }}</button>
          </div>
        </div>
      </div>

      <button
        class="w-full py-2.5 rounded-xl border-2 border-dashed text-sm font-semibold"
        style="border-color: var(--color-primary); color: var(--color-primary)"
        @click="addMember"
      >+ {{ $t('setup.addAnother') }}</button>
    </div>

    <!-- Actions -->
    <div class="flex gap-3">
      <!-- Step 1: Skip all | Step 2: Back (no skip allowed) -->
      <button
        v-if="step === 1"
        class="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-500 text-sm"
        @click="emit('dismiss')"
      >{{ $t('onboarding.skipAll') }}</button>
      <button
        v-else
        class="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-500 text-sm"
        @click="step = 1"
      >{{ $t('common.back') }}</button>

      <!-- Next / Done -->
      <button
        class="flex-[2] py-3 rounded-xl font-black text-white transition-opacity text-sm"
        style="background: var(--color-primary)"
        :disabled="!canProceed"
        :class="!canProceed ? 'opacity-40' : ''"
        @click="onNext"
      >
        {{ step === 1 ? $t('common.next') : $t('onboarding.finish') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { THEME_PRESETS, applyTheme } from '~/utils/theme'
import type { ThemePreset } from '~/utils/theme'

const emit = defineEmits<{ dismiss: [] }>()

const { t } = useI18n()
const eventsStore = useEventsStore()
const membersStore = useMembersStore()

const step = ref(1)
const year = new Date().getFullYear()
const eventName = ref(`Raya ${year}`)
const eventEmoji = ref('🌙')
const selectedPreset = ref('hijau-raya')
const selectedTheme = ref(THEME_PRESETS[0].colors)

const memberColors = ['#16a34a', '#0284c7', '#dc2626', '#7c3aed', '#ca8a04', '#db2777']
const newMembers = ref([{ name: '', avatar: '👦', role: 'child' as const }])

const eventEmojis = ['🌙', '⭐', '🕌', '🎊', '🌟', '💫', '🎁', '🌺', '🦋', '🌸']
const avatarEmojis = ['👦', '👧', '👨', '👩', '👴', '👵', '🧒', '👶', '🧑', '👱', '🧔', '👼']

const roles = computed(() => [
  { value: 'child' as const, label: t('setup.roles.child') },
  { value: 'parent' as const, label: t('setup.roles.parent') },
  { value: 'grandparent' as const, label: t('setup.roles.grandparent') },
  { value: 'relative' as const, label: t('setup.roles.relative') },
])

const canProceed = computed(() => {
  if (step.value === 1) return eventName.value.trim().length > 0
  // At least one member with a name is required
  return newMembers.value.length > 0 && newMembers.value.every(m => m.name.trim().length > 0)
})

function selectPreset(preset: ThemePreset) {
  selectedPreset.value = preset.id
  selectedTheme.value = preset.colors
  applyTheme(preset.colors)
}

function addMember() {
  const avatars = ['👦', '👧', '🧒', '👼', '🧑', '👱']
  newMembers.value.push({
    name: '',
    avatar: avatars[newMembers.value.length % avatars.length],
    role: 'child',
  })
}

function onNext() {
  if (!canProceed.value) return
  if (step.value === 1) {
    // Move to member step — event is NOT created yet
    step.value = 2
  } else {
    // Create event + members together only when Done is confirmed
    const event = eventsStore.createEvent({
      name: eventName.value.trim(),
      year,
      startDate: `${year}-03-01`,
      endDate: `${year}-04-30`,
      theme: selectedTheme.value,
      emoji: eventEmoji.value,
    })
    eventsStore.setActive(event.id)

    newMembers.value.forEach((m, i) => {
      if (m.name.trim()) {
        membersStore.createMember({
          name: m.name.trim(),
          role: m.role,
          avatar: m.avatar,
          color: memberColors[i % memberColors.length],
        })
      }
    })

    emit('dismiss')
  }
}
</script>
