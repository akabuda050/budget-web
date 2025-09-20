import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

// Proxy API to the syncer service during dev
export default defineConfig({
  plugins: [vue()],
  base: '/budget-web/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
