export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase', '@nuxtjs/tailwindcss'],
  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY,
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY || '',
      whatsappNumber: process.env.NUXT_PUBLIC_WHATSAPP_NUMBER || '59176590871',
      adminPassword: process.env.NUXT_PUBLIC_ADMIN_PASSWORD || 'fabellas-admin',
    },
  },
  compatibilityDate: '2026-10-30',
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Catálogo Isa | Cosméticos',
      meta: [
        { name: 'description', content: 'Catálogo de cosméticos premium con cuidado facial, maquillaje y labiales.' },
      ],
    },
  },
});
