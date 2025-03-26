import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    outDir: '../assets',
    rollupOptions: {
      output: {
        entryFileNames: 'query-builder-bundle.js',
        format: 'iife',
        name: 'QueryBuilderApp'
      }
    }
  }
});
