// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules : [
    '@nuxt/image',
    '@nuxtjs/google-fonts',
    'nuxt-icon'
  ],
  googleFonts: {
    families: {
      Roboto: [400, 500, 600, 700],
      Inter: [300],
      'Source+Sans+Pro': [400]
    },
    prefetch: true,
    preconnect: true
  },
  app: {
    head: {
      title: 'Les recettes de Brigitte',
      meta: [
        {name: 'description', content: 'Retrouver sur ce site toutes les recettes de Brigitte'}
      ],
      link: [
        { rel: 'stylesheet', href: '/style/default.css'}
      ]
    }
  },
  runtimeConfig: {
    APIPassword: process.env.API_PASSWORD,
    APIUrl: process.env.API_URL
  }
})
