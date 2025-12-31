export interface Item {
    id: string;
    name: string;
    barcode: string | null;
    category: string;
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
    category: string;
    imageUrl: string;
    description: string;
    listPrice: number | null;
    purchasePrice: number | null;
}

export type NewItem = Omit<Item, 'id' | 'createdAt'>;
