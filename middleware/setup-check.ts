export default defineNuxtRouteMiddleware((to) => {
  const settingsStore = useSettingsStore()
  if (!settingsStore.setupComplete && to.path !== '/setup') {
    return navigateTo('/setup')
  }
  if (settingsStore.setupComplete && to.path === '/setup') {
    return navigateTo('/')
  }
})
