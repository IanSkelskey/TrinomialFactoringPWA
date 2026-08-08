import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/TrinomialFactoringPWA/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo192.png', 'logo512.png'],
      manifest: {
        name: 'Factor a Trinomial',
        short_name: 'Factor',
        description: 'Factor quadratic trinomials and follow the working step by step.',
        start_url: '.',
        display: 'standalone',
        theme_color: '#0f1729',
        background_color: '#0f1729',
        icons: [
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' },
          { src: 'logo192.png', sizes: '192x192', type: 'image/png' },
          { src: 'logo512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});
