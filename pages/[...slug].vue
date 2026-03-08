<template>
  <div class="flex flex-col items-center justify-center py-20 text-center">
    <div class="text-7xl mb-4">🌙</div>
    <h1 class="text-2xl font-black text-gray-700 mb-2">404</h1>
    <p class="text-gray-400 mb-6">Halaman tidak dijumpai / Page not found</p>
    <NuxtLink to="/"
      class="px-6 py-3 rounded-xl font-bold text-white"
      style="background: var(--color-primary)"
    >{{ $t('common.back') }}</NuxtLink>
  </div>
</template>
