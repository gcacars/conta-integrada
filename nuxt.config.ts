import { fileURLToPath } from 'node:url';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxt/hints', '@nuxt/fonts', '@nuxt/scripts', '@pinia/nuxt'],
  css: [
    '@/assets/styles/bootstrap.scss',
    '@/assets/styles/main.scss',
    '@/assets/styles/icons.scss',
  ],

  app: {
    baseURL: '/',
    head: {
      title: 'Conta Integrada',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
        // { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        // { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap', media: 'print', onload: 'this.media=\'all\'' },
      ],
    },
  },

  vite: {
    resolve: {
      alias: {
        '@modules': fileURLToPath(new URL('./node_modules', import.meta.url)),
      },
    },
    plugins: [
      ViteImageOptimizer({
        includePublic: true,
        svg: {
          multipass: true,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  cleanupNumericValues: false,
                  cleanupIds: {
                    minify: false,
                    remove: true,
                  },
                  convertPathData: false,
                },
              },
            },
            'sortAttrs',
            {
              name: 'addAttributesToSVGElement',
              params: {
                attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
              },
            },
          ],
        },
        png: { quality: 90 },
        jpeg: { quality: 80 },
        jpg: { quality: 80 },
        webp: { lossless: true },
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/variables.scss"; @import "@modules/bootstrap/scss/_functions.scss"; @import "@modules/bootstrap/scss/_variables.scss"; @import "@modules/bootstrap/scss/_mixins.scss";',
          silenceDeprecations: ['global-builtin', 'import'],
        },
      },
    },
    build: {
      cssCodeSplit: true,
      sourcemap: true,
      rollupOptions: {
        input: {
          bs: '@/assets/styles/bootstrap.scss',
          icons: '@/assets/styles/icons.scss',
          main: '@/assets/styles/main.scss',
        },
      },
    },
  },
})