import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { items } from '../db/schema'
import { desc, eq } from 'drizzle-orm'
import type { NewItem } from '../types'

const api = new Hono<{ Bindings: { DB: D1Database } }>()

// 一覧取得
api.get('/items', async (c) => {
    try {
        const db = drizzle(c.env.DB)
        const result = await db.select().from(items).orderBy(desc(items.createdAt))
        return c.json(result)
    } catch (e) {
        console.error('API Error (GET /items):', e);
        return c.json({ error: 'Failed to fetch items' }, 500);
    }
})

// 登録
api.post('/items', async (c) => {
    try {
        const db = drizzle(c.env.DB)
        const body: NewItem = await c.req.json()

        const newItem = {
            id: crypto.randomUUID(),
            name: body.name,
            barcode: body.barcode,
            category: body.category,
            imageUrl: body.imageUrl,
            status: body.status,
            description: body.description,
            createdAt: new Date(),
        }

        await db.insert(items).values(newItem)
        return c.json(newItem)
    } catch (e) {
        console.error('API Error (POST /items):', e);
        return c.json({ error: 'Failed to create item' }, 500);
    }
})

// 削除
api.delete('/items/:id', async (c) => {
    try {
        const db = drizzle(c.env.DB)
        const id = c.req.param('id')
        await db.delete(items).where(eq(items.id, id))
        return c.json({ success: true })
    } catch (e) {
        console.error('API Error (DELETE /items):', e);
        return c.json({ error: 'Failed to delete item' }, 500);
    }
})

export default api
