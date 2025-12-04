import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 7777,
    host: true,
  },
  resolve: {
    alias: {
      '@pod/sdk': path.resolve(__dirname, '../src'),
    },
  },
});

