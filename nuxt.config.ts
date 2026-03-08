export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ],

  css: ['~/assets/css/main.css'],

  i18n: {
    locales: [
      { code: 'en', file: 'en.json', name: 'English' },
      { code: 'ms', file: 'ms.json', name: 'Bahasa Melayu' },
    ],
    defaultLocale: 'ms',
    langDir: 'i18n/',
    strategy: 'no_prefix',
    vueI18n: './i18n.config.ts',
  },

  nitro: {
    preset: 'cloudflare-pages',
  },

  imports: {
    dirs: ['stores', 'composables'],
  },
})
