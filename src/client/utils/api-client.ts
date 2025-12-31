import { type BookInfo } from "../../types";

interface GoogleBooksResponse {
    totalItems: number;
    items?: {
        volumeInfo: {
            title: string;
            imageLinks?: {
                thumbnail?: string;
            };
            description?: string;
        };
    }[];
}

export async function fetchBookInfo(isbn: string): Promise<BookInfo | null> {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    try {
        const response = await fetch(url);
        const data = (await response.json()) as GoogleBooksResponse;

        if (data.totalItems > 0 && data.items && data.items.length > 0) {
            const book = data.items[0].volumeInfo;
            return {
                name: book.title,
                barcode: isbn,
                category: 'book',
                imageUrl: book.imageLinks?.thumbnail || '',
                description: book.description || '',
            };
        }
    } catch (error) {
        console.error('Failed to fetch book info:', error);
    }
    return null;
}
