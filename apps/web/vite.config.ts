import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: "Track'N Share",
        short_name: "Track'N Share",
        description:
          'Suivez, partagez et comparez vos performances de jeu : stats, score, leaderboard et équipes.',
        display: 'standalone',
        start_url: '/',
        lang: 'fr',
        theme_color: '#090d19',
        background_color: '#090d19',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Les routes API ne doivent jamais servir le fallback SPA.
        navigateFallbackDenylist: [/\/api\//],
        runtimeCaching: [
          {
            // Seules les données publiques (leaderboard) sont mises en cache.
            // Les endpoints authentifiés (profil, amis, stats, messages…) ne
            // doivent jamais l'être : le cache est indexé par URL, une réponse
            // cachée pourrait être servie à un autre utilisateur du navigateur.
            urlPattern: ({ url }) =>
              url.pathname.includes('/api/leaderboards'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 5 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
})
