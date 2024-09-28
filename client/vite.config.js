import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './client', // Adjust this if needed
  build: {
    outDir: 'dist', // Output directory for the build
  },
});
