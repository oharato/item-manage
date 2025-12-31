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
    it('PUT /api/items/:id should return 200 and success', async () => {
        const mockDbChain = {
            update: vi.fn().mockReturnThis(),
            set: vi.fn().mockReturnThis(),
            where: vi.fn().mockResolvedValue({ success: true }),
        };
        (drizzle as any).mockReturnValue(mockDbChain)

        const res = await app.request('/api/items/123', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Updated Name',
                status: 'wishlist'
            }),
        }, { DB: {} as any })

        expect(res.status).toBe(200)
        const data: any = await res.json()
        expect(data.success).toBe(true)
    })

    it('DELETE /api/items/:id should return 200 and success', async () => {
        const mockDbChain = {
            delete: vi.fn().mockReturnThis(),
            where: vi.fn().mockResolvedValue({ success: true }),
        };
        (drizzle as any).mockReturnValue(mockDbChain)

        const res = await app.request('/api/items/123', {
            method: 'DELETE',
        }, { DB: {} as any })

        expect(res.status).toBe(200)
        const data: any = await res.json()
        expect(data.success).toBe(true)
    })

    it('GET /api/lookup/:code should return item info from Rakuten API', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                Items: [
                    {
                        Item: {
                            title: 'Sample Book',
                            largeImageUrl: 'http://example.com/image.jpg',
                            itemCaption: 'Description',
                            itemPrice: 1000,
                            genreId: '001001', // Book
                        }
                    }
                ]
            })
        })
        global.fetch = mockFetch

        const res = await app.request('/api/lookup/9784000000000', {
            method: 'GET',
        }, { RAKUTEN_APP_ID: 'test-app-id' } as any)

        expect(res.status).toBe(200)
        const data: any = await res.json()
        expect(data.name).toBe('Sample Book')
        expect(data.category).toBe('book')
    })
})
