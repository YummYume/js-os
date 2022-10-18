/* eslint-env node */

import { defineConfig } from 'vite';
import path, { resolve } from 'path';

export default defineConfig({
    root: resolve('sources'),
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '/src'),
            '@templates' : path.resolve(__dirname, '/templates')
        }
    },
    server: {
        port: 8000,
        host: '0.0.0.0'
    }
});
