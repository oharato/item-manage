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
        ssr: './src/index.ts',
        outDir: './dist',
        emptyOutDir: false, // Keep client assets
        rollupOptions: {
            output: {
                entryFileNames: '_worker.js',
            },
        },
    }
})
