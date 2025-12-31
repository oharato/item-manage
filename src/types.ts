export interface Item {
    id: string;
    name: string;
    barcode: string | null;
    category: 'book' | 'cd' | 'dvd' | 'game' | 'other';
    imageUrl: string | null;
    status: 'owned' | 'wishlist' | 'temp';
    description: string | null;
    listPrice: number | null;
    purchasePrice: number | null;
    createdAt: Date;
}

export interface BookInfo {
    name: string;
    barcode: string;
    category: 'book' | 'cd' | 'dvd' | 'game' | 'other';
    imageUrl: string;
    description: string;
    listPrice: number | null;
    purchasePrice: number | null;
}

export type NewItem = Omit<Item, 'id' | 'createdAt'>;
