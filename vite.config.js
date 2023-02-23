/* eslint-env node */

import { defineConfig } from 'vite';
import path, { resolve } from 'path';

export default defineConfig({
  base: '/js-os/',
  root: resolve('js-os'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
      '@assets' : path.resolve(__dirname, '/assets'),
      '@constants' : path.resolve(__dirname, '/constants'),
      '@styles' : path.resolve(__dirname, '/styles'),
      '@templates' : path.resolve(__dirname, '/templates'),
      '@defs' : path.resolve(__dirname, '/types'),
      '@utils' : path.resolve(__dirname, '/utils')
    }
  },
  server: {
    port: 8000,
    host: '0.0.0.0'
  }
});
