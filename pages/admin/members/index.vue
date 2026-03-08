<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-black" style="color: var(--color-primary)">{{ $t('admin.manageMembers') }}</h1>
      <NuxtLink to="/admin/members/new"
        class="px-4 py-2 rounded-xl font-bold text-white text-sm"
        style="background: var(--color-primary)"
      >+ {{ $t('admin.createMember') }}</NuxtLink>
    </div>

    <div v-if="members.length > 0" class="space-y-3">
      <div v-for="m in members" :key="m.id"
        class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3"
      >
        <MemberAvatar :avatar="m.avatar" :color="m.color" size="md" />
        <div class="flex-1 min-w-0">
          <p class="font-bold text-gray-800">{{ m.name }}</p>
          <p class="text-xs text-gray-400">{{ $t(`setup.roles.${m.role}`) }}</p>
        </div>
        <div class="flex gap-2">
          <NuxtLink :to="`/admin/members/${m.id}`"
            class="px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-gray-200 text-gray-600"
          >{{ $t('common.edit') }}</NuxtLink>
          <button class="px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-red-100 text-red-400 hover:bg-red-50"
            @click="deleteMember(m.id)"
          >{{ $t('common.delete') }}</button>
        </div>
      </div>
    </div>

    <EmptyState v-else icon="👨‍👩‍👧" :title="$t('admin.noMembers')" />
  </div>
</template>

<script setup lang="ts">
const membersStore = useMembersStore()
const members = computed(() => membersStore.sortedMembers)

function deleteMember(id: string) {
  if (confirm(useI18n().t('admin.confirmDelete'))) {
    membersStore.deleteMember(id)
  }
}
</script>
