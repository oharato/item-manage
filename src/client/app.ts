import scanner from './components/scanner';
import type { Item } from '../types';

export default function app() {
    return {
        ...scanner(),
        savedItems: [] as Item[],
        searchQuery: '',
        searchCategory: 'all',
        searchStatus: 'all',
        searchTags: '',
        showSearch: false,

        editingItem: null as Item | null,
        isModalOpen: false,

        async init() {
            console.log('App initialized');
            await this.loadItems();
        },

        get filteredItems(): Item[] {
            return this.savedItems.filter(item => {
                const matchesQuery = !this.searchQuery ||
                    item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    (item.description && item.description.toLowerCase().includes(this.searchQuery.toLowerCase()));

                const matchesCategory = this.searchCategory === 'all' || item.category === this.searchCategory;

                const matchesStatus = this.searchStatus === 'all' || item.status === this.searchStatus;

                const tags = item.tags ? item.tags.split(',').map(t => t.trim().toLowerCase()) : [];
                const searchTagList = this.searchTags ? this.searchTags.split(',').map(t => t.trim().toLowerCase()) : [];
                const matchesTags = searchTagList.length === 0 ||
                    searchTagList.every(st => tags.some(t => t.includes(st)));

                return matchesQuery && matchesCategory && matchesStatus && matchesTags;
            });
        },

        openEditModal(item: Item) {
            this.editingItem = JSON.parse(JSON.stringify(item));
            this.isModalOpen = true;
        },

        closeModal() {
            this.isModalOpen = false;
            this.editingItem = null;
        },

        async updateItem() {
            if (!this.editingItem) return;

            try {
                const res = await fetch(`/api/items/${this.editingItem.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.editingItem)
                });

                if (res.ok) {
                    await this.loadItems();
                    this.closeModal();
                } else {
                    alert('更新に失敗しました');
                }
            } catch (e) {
                console.error('Failed to update item', e);
                alert('通信エラーが発生しました');
            }
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
                    if (this.isModalOpen) this.closeModal();
                    await this.loadItems();
                }
            } catch (e) {
                console.error('Failed to delete item', e);
                alert('削除に失敗しました');
            }
        },

        resetSearch() {
            this.searchQuery = '';
            this.searchCategory = 'all';
            this.searchStatus = 'all';
            this.searchTags = '';
        }
    };
}
