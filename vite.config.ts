import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'

import viteCompression from 'vite-plugin-compression'

export default defineConfig({
    server: {
        host: true,
        allowedHosts: ['raises-looksmart-tried-weather.trycloudflare.com'],
    },
    plugins: [
        devServer({
            adapter,
            entry: 'src/index.ts', // Dev server still needs this
        }),
        viteCompression(),
    ],
    build: {
        minify: true,
        outDir: './dist',
        emptyOutDir: true, // Clear dist before client build
        rollupOptions: {
            input: './src/client/main.ts',
            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]',
            },
        },
    }
})
