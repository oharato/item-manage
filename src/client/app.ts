import scanner from './components/scanner';
import type { Item } from '../types';

export default function app() {
    return {
        ...scanner(),
        savedItems: [] as Item[],

        async init() {
            console.log('App initialized');
            await this.loadItems();
        },

        async loadItems() {
            try {
                const res = await fetch('/api/items');
                if (res.ok) {
                    this.savedItems = await res.json();
                }
            } catch (e) {
                console.error('Failed to load items', e);
            }
        },

        async registerItem(id: string, status: 'owned' | 'wishlist') {
            const item = this.tempItems.find(i => i.id === id);
            if (!item) return;

            try {
                const res = await fetch('/api/items', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...item, status })
                });

                if (res.ok) {
                    this.removeItem(id);
                    await this.loadItems();
                }
            } catch (e) {
                console.error('Failed to register item', e);
                alert('登録に失敗しました');
            }
        },

        async deleteSavedItem(id: string) {
            if (!confirm('削除してよろしいですか？')) return;

            try {
                const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    await this.loadItems();
                }
            } catch (e) {
                console.error('Failed to delete item', e);
                alert('削除に失敗しました');
            }
        }
    };
}
