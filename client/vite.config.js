import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
<<<<<<< HEAD


export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist', // or wherever you want to output your build files
    rollupOptions: {
      input: './client/index.html', // Update this path as needed
    },
=======

export default defineConfig({
  plugins: [react()],
  
  build: {
    outDir: 'dist', // Output directory for the build
>>>>>>> e9c646ab6c8aafa62e96873eb7b6909e5f0e67d0
  },
});
