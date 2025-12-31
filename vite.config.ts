import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'

export default defineConfig({
    server: {
        host: true,
        allowedHosts: ['raises-looksmart-tried-weather.trycloudflare.com'],
    },
    plugins: [
        devServer({
            adapter,
            entry: 'src/index.ts',
        }),
    ],
    build: {
        minify: true,
        outDir: 'dist',
    }
})
