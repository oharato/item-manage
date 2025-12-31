import { type BookInfo } from "../../types";

export async function fetchItemInfo(code: string): Promise<BookInfo | null> {
    try {
        const response = await fetch(`/api/lookup/${code}`);
        if (!response.ok) {
            console.warn(`Lookup failed with status: ${response.status}`);
            return null;
        }

        return (await response.json()) as BookInfo;
    } catch (error) {
        console.error('Failed to fetch item info from server:', error);
    }
    return null;
}
