import { describe, it, expect, vi, beforeEach } from 'vitest'
import app from '../index'

// drizzle-orm/d1 のモック
vi.mock('drizzle-orm/d1', () => ({
    drizzle: vi.fn(),
}))

import { drizzle } from 'drizzle-orm/d1'

describe('Item Management API', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('GET /api/items should return 200 and a list of items', async () => {
        const mockDbChain = {
            select: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            orderBy: vi.fn().mockResolvedValue([{ id: '1', name: 'Test Item' }]),
        };
        (drizzle as any).mockReturnValue(mockDbChain)

        const res = await app.request('/api/items', {
            method: 'GET',
        }, { DB: {} as any })

        expect(res.status).toBe(200)
        const data = await res.json() as any[]
        expect(Array.isArray(data)).toBe(true)
        expect(data[0].name).toBe('Test Item')
    })

    it('POST /api/items should return 200 and the created item', async () => {
        const mockDbChain = {
            insert: vi.fn().mockReturnThis(),
            values: vi.fn().mockResolvedValue({}),
        };
        (drizzle as any).mockReturnValue(mockDbChain)

        const res = await app.request('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'New Book',
                barcode: '123456789',
                category: 'book',
                status: 'owned'
            }),
        }, { DB: {} as any })

        expect(res.status).toBe(200)
        const data: any = await res.json()
        expect(data.name).toBe('New Book')
        expect(data.id).toBeDefined()
    })
})
