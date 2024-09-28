import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
   root: './client', // Adjust this path if your index.html is elsewhere
  build: {
    outDir: 'dist', // Specify the output directory if needed
  },
  plugins: [react()],
})
