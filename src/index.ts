/// <reference types="@cloudflare/workers-types" />
import { Hono } from 'hono'
import api from './server/api'
import { Layout, MainView } from './server/views'

const app = new Hono<{ Bindings: { DB: D1Database } }>()

// API Mount
app.route('/api', api)

// Root View
app.get('/', (c) => {
  // Inject MainView into Layout
  // Note: Simple Layout implementation for now
  const content = Layout.toString().replace('<div id="root"></div>', `<div id="root">${MainView}</div>`)
  return c.html(content)
})

export default app
