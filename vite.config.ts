import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            return 'vendor';
          }

          if (id.includes('src/components')) {
            if (id.includes('InvestorPresentation') || id.includes('PresentationDownloader')) {
              return 'presentations';
            }
            if (id.includes('Dashboard') || id.includes('AIPersonality') || id.includes('AIRecommendations')) {
              return 'dashboard';
            }
            if (id.includes('Communication') || id.includes('Messaging') || id.includes('VoiceMessage')) {
              return 'communication';
            }
            if (id.includes('Registration') || id.includes('AuthModal')) {
              return 'auth';
            }
            return 'components';
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(extType)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    },
    assetsInlineLimit: 4096,
  },
  define: {
    __DEV__: false
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@supabase/supabase-js', 'react', 'react-dom']
  }
});
