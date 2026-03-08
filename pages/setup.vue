<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="text-6xl mb-3">💰</div>
      <h1 class="text-3xl font-black" style="color: var(--color-primary)">{{ $t('setup.title') }}</h1>
      <p class="text-gray-500 mt-1">{{ $t('setup.subtitle') }}</p>
    </div>

    <!-- Step indicator -->
    <div class="flex items-center justify-center gap-2 mb-8">
      <div v-for="i in 3" :key="i"
        class="h-2 rounded-full transition-all duration-300"
        :class="step >= i ? 'w-8' : 'w-2 bg-gray-200'"
        :style="step >= i ? 'width: 2rem; background: var(--color-primary)' : ''"
      />
    </div>
    <p class="text-center text-sm text-gray-400 mb-6">{{ $t('setup.step') }} {{ step }} {{ $t('setup.of') }} 3</p>

    <!-- Step 1: Language -->
    <div v-if="step === 1" class="space-y-4">
      <h2 class="text-xl font-bold text-center text-gray-700">{{ $t('setup.step1Title') }}</h2>
      <div class="grid grid-cols-2 gap-3">
        <button v-for="lang in langs" :key="lang.code"
          class="p-4 rounded-2xl border-2 font-bold text-lg transition-all"
          :class="selectedLang === lang.code ? 'border-current text-white' : 'border-gray-200 text-gray-600'"
          :style="selectedLang === lang.code ? 'background: var(--color-primary); border-color: var(--color-primary)' : ''"
          @click="selectedLang = lang.code"
        >
          {{ lang.flag }} {{ lang.name }}
        </button>
      </div>
    </div>

    <!-- Step 2: Create Event -->
    <div v-if="step === 2" class="space-y-4">
      <h2 class="text-xl font-bold text-center text-gray-700">{{ $t('setup.step2Title') }}</h2>

      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">{{ $t('setup.eventName') }}</label>
        <input v-model="eventName" type="text" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none transition-all text-gray-800 font-semibold"
          :style="'focus-within: border-color: var(--color-primary)'"
          :placeholder="$t('setup.eventNamePlaceholder')"
          @focus="(e) => (e.target as HTMLElement).style.borderColor = 'var(--color-primary)'"
          @blur="(e) => (e.target as HTMLElement).style.borderColor = '#e5e7eb'"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-2">{{ $t('setup.eventEmoji') }}</label>
        <div class="flex flex-wrap gap-2">
          <button v-for="em in eventEmojis" :key="em"
            class="w-10 h-10 text-xl rounded-xl border-2 transition-all"
            :class="eventEmoji === em ? 'border-current scale-110' : 'border-gray-200'"
            :style="eventEmoji === em ? 'border-color: var(--color-primary); background: var(--color-primary)20' : ''"
            @click="eventEmoji = em"
          >{{ em }}</button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-2">{{ $t('setup.themeColor') }}</label>
        <div class="grid grid-cols-2 gap-2">
          <button v-for="preset in THEME_PRESETS" :key="preset.id"
            class="flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left"
            :class="selectedPreset === preset.id ? 'border-current' : 'border-gray-200'"
            :style="selectedPreset === preset.id ? `border-color: ${preset.colors.primary}` : ''"
            @click="selectPreset(preset)"
          >
            <div class="w-6 h-6 rounded-full flex-shrink-0" :style="{ background: `linear-gradient(135deg, ${preset.colors.primary}, ${preset.colors.secondary})` }" />
            <span class="text-xs font-semibold text-gray-700 truncate">{{ $t(preset.nameKey) }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Step 3: Add Members -->
    <div v-if="step === 3" class="space-y-4">
      <h2 class="text-xl font-bold text-center text-gray-700">{{ $t('setup.step3Title') }}</h2>

      <div v-for="(member, idx) in newMembers" :key="idx" class="p-4 rounded-2xl border-2 border-gray-100 space-y-3 bg-white">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl" :style="{ backgroundColor: memberColors[idx % memberColors.length] }">
            {{ member.avatar }}
          </div>
          <input v-model="member.name" type="text" class="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 font-semibold text-gray-800 focus:outline-none"
            :placeholder="$t('setup.memberNamePlaceholder')"
            @focus="(e) => (e.target as HTMLElement).style.borderColor = 'var(--color-primary)'"
            @blur="(e) => (e.target as HTMLElement).style.borderColor = '#e5e7eb'"
          />
          <button v-if="newMembers.length > 1" @click="newMembers.splice(idx, 1)" class="text-red-400 hover:text-red-600 text-xl">✕</button>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1">{{ $t('setup.memberAvatar') }}</label>
          <div class="flex flex-wrap gap-1.5">
            <button v-for="em in avatarEmojis" :key="em"
              class="w-8 h-8 text-lg rounded-lg border transition-all"
              :class="member.avatar === em ? 'border-current scale-110' : 'border-gray-200'"
              :style="member.avatar === em ? 'border-color: var(--color-primary); background: var(--color-primary)15' : ''"
              @click="member.avatar = em"
            >{{ em }}</button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-1">{{ $t('setup.memberRole') }}</label>
          <div class="flex flex-wrap gap-2">
            <button v-for="role in roles" :key="role.value"
              class="px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
              :class="member.role === role.value ? 'text-white' : 'border-gray-200 text-gray-600'"
              :style="member.role === role.value ? 'background: var(--color-primary); border-color: var(--color-primary)' : ''"
              @click="member.role = role.value"
            >{{ role.label }}</button>
          </div>
        </div>
      </div>

      <button class="w-full py-2.5 rounded-xl border-2 border-dashed text-sm font-semibold transition-all"
        style="border-color: var(--color-primary); color: var(--color-primary)"
        @click="addMember"
      >+ {{ $t('setup.addAnother') }}</button>
    </div>

    <!-- Navigation buttons -->
    <div class="flex gap-3 mt-8">
      <button v-if="step > 1" class="flex-1 py-3 rounded-xl border-2 font-bold text-gray-600 border-gray-200 tap-target" @click="step--">
        {{ $t('common.back') }}
      </button>
      <button
        class="flex-2 flex-grow py-3 rounded-xl font-black text-white tap-target transition-opacity"
        style="background: var(--color-primary)"
        :disabled="!canProceed"
        :class="!canProceed ? 'opacity-40' : ''"
        @click="proceed"
      >
        {{ step === 3 ? $t('setup.finishSetup') : $t('common.next') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { THEME_PRESETS, applyTheme } from '~/utils/theme'
import type { ThemePreset } from '~/utils/theme'

definePageMeta({ layout: 'setup', middleware: [] })
useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const { t, setLocale } = useI18n()
const router = useRouter()
const eventsStore = useEventsStore()
const membersStore = useMembersStore()
const settingsStore = useSettingsStore()

const step = ref(1)
const selectedLang = ref<'en' | 'ms'>('ms')
const eventName = ref(`Raya ${new Date().getFullYear()}`)
const eventEmoji = ref('🌙')
const selectedPreset = ref('hijau-raya')
const selectedTheme = ref(THEME_PRESETS[0].colors)

const memberColors = ['#16a34a', '#0284c7', '#dc2626', '#7c3aed', '#ca8a04', '#db2777']
const newMembers = ref([{ name: '', avatar: '👦', role: 'child' as const }])

const langs = [
  { code: 'ms' as const, name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'en' as const, name: 'English', flag: '🇬🇧' },
]

const eventEmojis = ['🌙', '⭐', '🕌', '🎊', '🌟', '💫', '🎁', '🌺', '🦋', '🌸']
const avatarEmojis = ['👦', '👧', '👨', '👩', '👴', '👵', '🧒', '👶', '🧑', '👱', '🧔', '👼']

const roles = computed(() => [
  { value: 'child' as const, label: t('setup.roles.child') },
  { value: 'parent' as const, label: t('setup.roles.parent') },
  { value: 'grandparent' as const, label: t('setup.roles.grandparent') },
  { value: 'relative' as const, label: t('setup.roles.relative') },
])

const canProceed = computed(() => {
  if (step.value === 1) return true
  if (step.value === 2) return eventName.value.trim().length > 0
  if (step.value === 3) return newMembers.value.every(m => m.name.trim().length > 0)
  return false
})

function selectPreset(preset: ThemePreset) {
  selectedPreset.value = preset.id
  selectedTheme.value = preset.colors
  applyTheme(preset.colors)
}

function addMember() {
  const avatars = ['👦', '👧', '🧒', '👼', '🧑', '👱']
  newMembers.value.push({ name: '', avatar: avatars[newMembers.value.length % avatars.length], role: 'child' })
}

async function proceed() {
  if (!canProceed.value) return

  if (step.value === 1) {
    settingsStore.setLanguage(selectedLang.value)
    await setLocale(selectedLang.value)
    step.value = 2
  } else if (step.value === 2) {
    step.value = 3
  } else {
    // Create event
    const event = eventsStore.createEvent({
      name: eventName.value.trim(),
      year: new Date().getFullYear(),
      startDate: `${new Date().getFullYear()}-03-01`,
      endDate: `${new Date().getFullYear()}-04-30`,
      theme: selectedTheme.value,
      emoji: eventEmoji.value,
    })
    eventsStore.setActive(event.id)

    // Create members
    for (let i = 0; i < newMembers.value.length; i++) {
      const m = newMembers.value[i]
      if (m.name.trim()) {
        membersStore.createMember({
          name: m.name.trim(),
          role: m.role,
          avatar: m.avatar,
          color: memberColors[i % memberColors.length],
        })
      }
    }

    settingsStore.completeSetup()
    router.push('/')
  }
}
</script>
