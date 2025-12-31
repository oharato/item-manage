export interface Item {
    id: string;
    name: string;
    barcode: string | null;
    category: string;
    imageUrl: string | null;
    status: 'owned' | 'wishlist' | 'temp';
    description: string | null;
    createdAt: Date;
}

export interface BookInfo {
    name: string;
    barcode: string;
    category: string;
    imageUrl: string;
    description: string;
}

export type NewItem = Omit<Item, 'id' | 'createdAt'>;
