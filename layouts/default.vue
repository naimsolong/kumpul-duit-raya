<template>
  <div class="min-h-dvh flex flex-col" style="background: var(--color-bg)">
    <AppNav />
    <main class="flex-1 max-w-xl mx-auto w-full px-4 pt-4 pb-24">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>
