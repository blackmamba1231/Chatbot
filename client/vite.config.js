import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
<<<<<<< HEAD


export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist', // or wherever you want to output your build files
    rollupOptions: {
      input: '../client/index.html', // Update this path as needed
    },
=======

