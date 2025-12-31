# Better Auth Integration Strategy

Better AuthをCloudflare D1およびHonoと統合するための設計指針。

## セットアップ

### 必要なパッケージ
```bash
pnpm add better-auth hono drizzle-orm
pnpm add -D drizzle-kit
```

### 環境変数
`wrangler.toml` または `.dev.vars` に設定が必要。
- `BETTER_AUTH_SECRET`: ランダムな文字列
- `BETTER_AUTH_URL`: アプリのベースURL（例: `http://localhost:5173`）

## データベーススキーマ (Drizzle)

Better Authが要求する基本テーブル（User, Session, Account, Verification）をDrizzleで定義する。

```typescript
// schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
	image: text("image"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => user.id),
});

// ... Account, Verification も同様に定義
```

## Honoとの統合

Cloudflare Workers環境では、D1のバインディングがリクエストコンテキスト (`c.env.DB`) に入るため、リクエストごとにBetter Authインスタンスを初期化するか、ファクトリ関数を作成する必要がある。

```typescript
// server.ts
import { Hono } from 'hono';
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";

const app = new Hono<{ Bindings: { DB: D1Database } }>();

const getAuth = (db: D1Database) => betterAuth({
    database: drizzleAdapter(drizzle(db), {
        provider: "sqlite",
    }),
    emailAndPassword: {
        enabled: true
    }
});

app.on(["POST", "GET"], "/api/auth/*", async (c) => {
    const auth = getAuth(c.env.DB);
    return auth.handler(c.req.raw);
});

export default app;
```

## Alpine.jsからの利用

フロントエンドからはBetter AuthのクライアントSDK、またはシンプルな `fetch` を使用して認証状態を確認する。

```javascript
// main.js (Alpine.js component)
document.addEventListener('alpine:init', () => {
    Alpine.data('auth', () => ({
        user: null,
        async init() {
            const res = await fetch('/api/auth/get-session');
            if (res.ok) {
                this.user = await res.json();
            }
        },
        async login(email, password) {
            // Better Authのログインエンドポイントを叩く
        }
    }))
})
```
