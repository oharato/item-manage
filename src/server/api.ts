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
            listPrice: body.listPrice,
            purchasePrice: body.purchasePrice,
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

// 楽天APIによるアイテム検索
api.get('/lookup/:code', async (c) => {
    const code = c.req.param('code');
    // 環境変数の取得をより確実に
    const env = c.env as any;
    let appId = env.RAKUTEN_APP_ID || env.VITE_RAKUTEN_APP_ID;

    // スペースなどの混入を防ぐ
    if (appId) {
        appId = appId.trim();
    }

    console.log(`[Lookup] Searching for code: ${code}`);

    if (!appId) {
        console.error('[Lookup] RAKUTEN_APP_ID is not defined in environment variables');
        return c.json({ error: 'Server configuration error' }, 500);
    }

    // 日本の書籍・ゲームなどの検索
    const url = `https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?format=json&applicationId=${appId}&isbnjan=${code}`;

    console.log(`[Lookup] Requesting Rakuten API...`);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Lookup] Rakuten API Error (${response.status}): ${errorText}`);
            return c.json({ error: 'Failed to fetch from Rakuten API' }, response.status as any);
        }

        const data = await response.json() as any;

        if (data.Items && data.Items.length > 0) {
            const item = data.Items[0].Item;

            // カテゴリ推定ロジック
            const estimateCategory = (item: any): 'book' | 'cd' | 'dvd' | 'game' | 'other' => {
                const genreId = item.genreId || '';
                // 優先度1: ジャンルID
                if (genreId.startsWith('001')) return 'book';
                if (genreId.startsWith('002')) return 'cd';
                if (genreId.startsWith('003')) return 'dvd';
                if (genreId.startsWith('005')) return 'game';

                // 優先度2: キーワード
                const text = ((item.title || '') + ' ' + (item.itemCaption || '')).toLowerCase();
                if (text.includes('ゲーム') || text.includes('switch') || text.includes('nintendo') || text.includes('ps4') || text.includes('ps5') || text.includes('ソフト')) {
                    return 'game';
                }
                if (text.includes('dvd') || text.includes('ブルーレイ') || text.includes('blu-ray') || text.includes('映画') || text.includes('映像')) {
                    return 'dvd';
                }
                if (text.includes('cd') || text.includes('アルバム') || text.includes('シングル') || text.includes('音楽') || text.includes('ミュージック')) {
                    return 'cd';
                }
                if (text.includes('本') || text.includes('雑誌') || text.includes('コミック') || text.includes('文庫') || text.includes('コミックス') || text.includes('漫画')) {
                    return 'book';
                }

                return 'other';
            };

            const category = estimateCategory(item);

            const result = {
                name: item.title,
                barcode: code,
                category,
                imageUrl: item.largeImageUrl,
                description: item.itemCaption || '',
                listPrice: item.itemPrice || null,
                purchasePrice: null,
            };

            console.log(`[Lookup] Found item: ${result.name} (Estimated Category: ${result.category})`);
            return c.json(result);
        } else {
            console.log(`[Lookup] No items found for code: ${code}`);
            return c.json({ error: 'Item not found' }, 404);
        }
    } catch (e) {
        console.error('[Lookup] Unexpected Error:', e);
        return c.json({ error: 'Internal server error' }, 500);
    }
})

export default api
