
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Garante que o SDK do Gemini encontre a variável de ambiente necessária
    'process.env': {
      API_KEY: process.env.API_KEY || ''
    }
  },
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: false // Desativado para builds menores e mais rápidos
  }
});
