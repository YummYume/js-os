/* eslint-env node */

import { defineConfig } from 'vite';
import path, { resolve } from 'path';

export default defineConfig({
    root: resolve('sources'),
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '/src'),
            '@assets' : path.resolve(__dirname, '/assets'),
            '@styles' : path.resolve(__dirname, '/styles'),
            '@templates' : path.resolve(__dirname, '/templates'),
            '@utils' : path.resolve(__dirname, '/utils')
        }
    },
    server: {
        port: 8000,
        host: '0.0.0.0'
    }
});
