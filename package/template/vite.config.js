import { optimizeGLTF } from '@iwsdk/vite-plugin-gltf-optimizer';
import { injectIWER } from '@iwsdk/vite-plugin-iwer';

import {
  discoverComponents,
  generateGLXF
} from '@iwsdk/vite-plugin-metaspatial';

import { compileUIKit } from '@iwsdk/vite-plugin-uikitml';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [
    mkcert(),
    injectIWER({
      device: 'metaQuest3',
      activation: 'localhost',
      verbose: true 
    }),
    
    discoverComponents({
      outputDir: 'metaspatial/components',
      include: /\.(js|ts|jsx|tsx)$/,
      exclude: /node_modules/,
      verbose: false
    }),
    generateGLXF({
      metaSpatialDir: 'metaspatial',
      outputDir: 'public/glxf',
      verbose: false,
      enableWatcher: true
    }),
    
    compileUIKit({ sourceDir: 'ui', outputDir: 'public/ui', verbose: true }),
    optimizeGLTF({
      level: 'medium'
    }),
  ],
  server: { host: '0.0.0.0', port: 8080, open: true },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    target: 'esnext',
    rollupOptions: { input: './index.html' }
  },
  esbuild: { target: 'esnext' },
  optimizeDeps: {
    exclude: ['@babylonjs/havok'],
    esbuildOptions: { target: 'esnext' }
  },
  publicDir: 'public',
  base: './'
});
