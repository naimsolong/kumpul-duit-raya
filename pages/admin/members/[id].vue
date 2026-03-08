<template>
  <div class="space-y-5">
    <div class="flex items-center gap-3">
      <NuxtLink to="/admin/members" class="text-gray-400 hover:text-gray-600 text-xl">←</NuxtLink>
      <h1 class="text-xl font-black" style="color: var(--color-primary)">
        {{ isNew ? $t('admin.createMember') : $t('admin.editMember') }}
      </h1>
    </div>

    <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
      <!-- Preview -->
      <div class="flex justify-center">
        <div class="flex flex-col items-center gap-2">
          <div class="w-20 h-20 rounded-full flex items-center justify-center text-4xl" :style="{ backgroundColor: form.color }">
            {{ form.avatar }}
          </div>
          <p class="font-bold text-gray-700">{{ form.name || '...' }}</p>
        </div>
      </div>

      <!-- Name -->
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{{ $t('admin.memberName') }}</label>
        <input v-model="form.name" type="text" class="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-gray-800 focus:outline-none"
          @focus="(e) => (e.target as HTMLElement).style.borderColor = 'var(--color-primary)'"
          @blur="(e) => (e.target as HTMLElement).style.borderColor = '#e5e7eb'"
        />
      </div>

      <!-- Role -->
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{{ $t('admin.memberRole') }}</label>
        <div class="flex flex-wrap gap-2">
          <button v-for="role in roles" :key="role.value"
            class="px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all"
            :class="form.role === role.value ? 'text-white' : 'border-gray-200 text-gray-600'"
            :style="form.role === role.value ? 'background: var(--color-primary); border-color: var(--color-primary)' : ''"
            @click="form.role = role.value"
          >{{ role.label }}</button>
        </div>
      </div>

      <!-- Avatar -->
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{{ $t('admin.memberAvatar') }}</label>
        <div class="flex flex-wrap gap-2">
          <button v-for="em in avatarEmojis" :key="em"
            class="w-10 h-10 text-xl rounded-xl border-2 transition-all"
            :class="form.avatar === em ? 'scale-110' : 'border-gray-200'"
            :style="form.avatar === em ? 'border-color: var(--color-primary); background: var(--color-primary)20' : ''"
            @click="form.avatar = em"
          >{{ em }}</button>
        </div>
      </div>

      <!-- Color -->
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{{ $t('admin.memberColor') }}</label>
        <div class="flex flex-wrap gap-2">
          <button v-for="c in presetColors" :key="c"
            class="w-9 h-9 rounded-full border-4 transition-all"
            :class="form.color === c ? 'scale-110 border-gray-700' : 'border-white'"
            :style="{ backgroundColor: c }"
            @click="form.color = c"
          />
          <input type="color" v-model="form.color" class="w-9 h-9 rounded-full cursor-pointer border-2 border-gray-200 p-0.5" title="Custom color" />
        </div>
      </div>
    </div>

    <button
      class="w-full py-3 rounded-xl font-black text-white tap-target"
      style="background: var(--color-primary)"
      :disabled="!form.name.trim()"
      :class="!form.name.trim() ? 'opacity-40' : ''"
      @click="save"
    >{{ $t('common.save') }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { MemberRole } from '~/stores/types'

const route = useRoute()
const router = useRouter()
const membersStore = useMembersStore()
const { t } = useI18n()

const isNew = computed(() => route.params.id === 'new')
const existing = computed(() => isNew.value ? null : membersStore.getById(route.params.id as string))

const presetColors = ['#16a34a', '#0284c7', '#dc2626', '#7c3aed', '#ca8a04', '#db2777', '#0f766e', '#ea580c', '#64748b', '#be185d']
const avatarEmojis = ['👦', '👧', '👨', '👩', '👴', '👵', '🧒', '👶', '🧑', '👱', '🧔', '👼', '🧙', '🦸', '🧝', '🧚']

const roles = computed(() => [
  { value: 'child' as MemberRole, label: t('setup.roles.child') },
  { value: 'parent' as MemberRole, label: t('setup.roles.parent') },
  { value: 'grandparent' as MemberRole, label: t('setup.roles.grandparent') },
  { value: 'relative' as MemberRole, label: t('setup.roles.relative') },
])

const form = ref({
  name: existing.value?.name ?? '',
  role: (existing.value?.role ?? 'child') as MemberRole,
  avatar: existing.value?.avatar ?? '👦',
  color: existing.value?.color ?? presetColors[0],
})

function save() {
  if (!form.value.name.trim()) return
  if (isNew.value) {
    membersStore.createMember({ name: form.value.name.trim(), role: form.value.role, avatar: form.value.avatar, color: form.value.color })
  } else if (existing.value) {
    membersStore.updateMember(existing.value.id, { name: form.value.name.trim(), role: form.value.role, avatar: form.value.avatar, color: form.value.color })
  }
  router.push('/admin/members')
}
</script>
