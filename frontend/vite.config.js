import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,      // For debugging readable output
    sourcemap: true     // Enable source maps for stack trace mapping
  },
  server: {
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
});