import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// App Tables - Simple structure for personal use
export const items = sqliteTable("items", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    barcode: text("barcode"),
    category: text("category").notNull(), // 'book', 'cd', 'game', etc.
    imageUrl: text("image_url"),
    status: text("status").notNull(), // 'owned', 'wishlist'
    description: text("description"),
    listPrice: integer("list_price"),
    purchasePrice: integer("purchase_price"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
