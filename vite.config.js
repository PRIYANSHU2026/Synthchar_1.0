import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths instead of absolute paths
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV !== 'production',
    chunkSizeWarningLimit: 1000, // Increase warning limit for larger chunks
    rollupOptions: {
      external: ['next/dynamic'], // Explicitly mark next/dynamic as external
      output: {
        // Ensure assets use relative paths
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        manualChunks: (id) => {
          // React and core libraries
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/react-router-dom/')) {
            return 'vendor-react';
          }
          
          // UI libraries
          if (id.includes('node_modules/@radix-ui/') || 
              id.includes('node_modules/class-variance-authority/') ||
              id.includes('node_modules/clsx/') ||
              id.includes('node_modules/lucide-react/') ||
              id.includes('node_modules/tailwind-merge/') ||
              id.includes('node_modules/tailwindcss-animate/')) {
            return 'vendor-ui';
          }
          
          // 3D libraries
          if (id.includes('node_modules/three/') ||
              id.includes('node_modules/@react-three/')) {
            return 'vendor-3d';
          }
          
          // Plotting libraries
          if (id.includes('node_modules/plotly.js') ||
              id.includes('node_modules/react-plotly.js')) {
            return 'vendor-plotly';
          }
          
          // PDF generation
          if (id.includes('node_modules/jspdf') ||
              id.includes('node_modules/html2canvas')) {
            return 'vendor-pdf';
          }
          
          // Animation libraries
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-animation';
          }
        }
      },
    },
  },
})