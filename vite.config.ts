import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Bundle analyzer for production builds
// Uncomment to analyze bundle size: npm run build -- --mode production
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "analyze" && visualizer({ open: true, filename: 'dist/stats.html' }),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enhanced code splitting optimization
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React and related
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // UI libraries
            if (id.includes('lucide-react') || id.includes('framer-motion') || id.includes('sonner')) {
              return 'ui-library';
            }
            // Form libraries
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
              return 'form-library';
            }
            // Date library
            if (id.includes('date-fns')) {
              return 'date-library';
            }
            // Tanstack Query
            if (id.includes('@tanstack')) {
              return 'query-library';
            }
            // Other node modules
            return 'vendor';
          }
        },
        // Asset naming for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Source maps
    sourcemap: mode === 'development' ? true : false,
    // Minify in production
    minify: mode === 'production',
    terserOptions: mode === 'production' ? {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
    } : undefined,
    // CSS code splitting
    cssCodeSplit: true,
    // Target modern browsers for better performance
    target: 'es2015',
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'framer-motion',
      'react-hook-form',
      'date-fns',
      'sonner',
      'zod',
      '@hookform/resolvers',
      '@tanstack/react-query',
    ],
  },
  // Preview settings
  preview: {
    port: 8080,
    host: true,
  },
}));
