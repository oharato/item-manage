import { Hono } from 'hono'
import { html } from 'hono/html'

const app = new Hono<{ Bindings: { DB: D1Database } }>()

app.get('/', (c) => {
    return c.html(html`
    <!DOCTYPE html>
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Item Manage</title>
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
        <style>
          body {
            font-family: 'Inter', sans-serif;
            background: #0f172a;
            color: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            padding: 2rem;
            border-radius: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="card" x-data="{ count: 0 }">
          <h1>Item Manage</h1>
          <p>プレミアムな持ち物管理体験をここから。</p>
          <button 
             @click="count++" 
             style="background: #3b82f6; border: none; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer;"
          >
            Count: <span x-text="count"></span>
          </button>
        </div>
      </body>
    </html>
  `)
})

export default app
