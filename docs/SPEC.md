# Item Manage 技術仕様書 (SPEC.md)

## 1. システム概要
バーコードスキャンによって書籍・CD・ゲームの情報を取得し、持ち物および欲しいものを管理する PWA 指向の Web アプリケーション。

## 2. ディレクトリ構成
```text
/
├── docs/               # ドキュメント (計画、仕様、ウォークスルー)
├── migrations/         # D1 データベースマイグレーション
├── src/
│   ├── index.ts        # Hono エントリーポイント
│   ├── types.ts        # 共通型定義
│   ├── client/         # フロントエンド (Alpine.js, CSS)
│   │   ├── main.ts     # クライアント統合
│   │   ├── app.ts      # Alpine.js ロジック
│   │   ├── main.css    # スタイル定義
│   │   ├── components/ # コンポーネント (scanner.ts等)
│   │   └── utils/      # ユーティリティ (api-client.ts等)
│   ├── server/         # バックエンド (Hono)
│   │   ├── api.ts      # API エンドポイント
│   │   └── views.ts    # HTML テンプレート (View)
│   └── db/
│       └── schema.ts   # Drizzle Schema
└── tests/              # テストコード
```

## 3. データベース仕様 (Cloudflare D1)
### Table: `items`
| Column | Type | Nullable | Description |
| :--- | :--- | :--- | :--- |
| id | TEXT (UUID) | No | Primary Key |
| name | TEXT | No | 商品名・タイトル |
| barcode | TEXT | Yes | JAN/ISBNコード |
| category | TEXT | No | 'book', 'cd', 'game' 等 |
| image_url | TEXT | Yes | 商品画像URL |
| status | TEXT | No | 'owned', 'wishlist' |
| description | TEXT | Yes | 商品概要 |
| tags | TEXT | Yes | カンマ区切りのタグ |
| created_at | INTEGER | No | 作成日時 (Timestamp) |

## 4. API 仕様
### `GET /api/items`
登録済みのアイテム一覧を取得する。
- Response: `Item[]`

### `POST /api/items`
アイテムを新規登録する。
- Request: `NewItem`
- Response: `Item`

### `DELETE /api/items/:id`
アイテムを削除する。
- Response: `{ success: true }`

### `GET /api/lookup/:code` [NEW]
JAN/ISBNコードから商品情報を取得する（サーバーサイドで楽天APIを呼び出し）。
- Response: `BookInfo`
- 特徴: 取得したデータ（タイトル、説明文、ジャンルID）からカテゴリを自動推定する。

### `PUT /api/items/:id` [NEW]
既存のアイテム情報を更新する。
- Response: `{ success: true }`

## 5. フロントエンド仕様
- **Framework**: Alpine.js
- **UI Components**:
  - `scanner`: バーコード読み取りと一次リスト管理
  - `app`: 全体の一覧表示と登録・削除、および編集モーダルの制御、検索・フィルタリングのロジックを管理。
## Priority 2: ユーザー体験（UX）の向上
- [x] **アイテム編集**: モーダルによるタグ、購入価格、メモの事後編集機能の実装。
- [x] **検索・フィルタリング**: キーワード、カテゴリ、タグによる検索。
の組み合わせによるクライアントサイドフィルタリング。
- **Detail & Editing**: アーカイブのアイテムをクリックして詳細を表示し、タグ、購入価格、メモ等を編集可能。
- **Delete**: 詳細モーダル内からアイテムを削除。
- **Tagging**: 自由入力のタグ（カンマ区切り）をサポート。
- **External Integration**: 楽天ブックス総合検索API (サーバーサイド経由)。
- **Category Estimation**: `genreId` に加え、タイトルや商品説明文のキーワードからカテゴリを自動推定。

## 6. セキュリティ
- **認証**: 本番環境では Cloudflare Access を使用。アプリケーション層での認証実装は行わない。
- **バリデーション**: Drizzle ORM および Hono のボディパース時に最低限の整合性チェックを行う。
