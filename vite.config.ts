import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'

export default defineConfig({
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
