# Item Manage

家庭内の物品管理アプリケーション。書籍、CD、ゲーム、DVDなどをバーコードスキャンで簡単に登録し、所有状況（所有中/欲しいもの）を管理できます。

## 主な機能

- **バーコードスキャン登録**: スマートフォンのカメラでJAN/ISBNコードを読み取り、楽天ブックスAPIから自動で商品情報を取得して登録します。
- **リスト管理**: 登録したアイテムを一覧表示。カテゴリ、ステータス、タグでのフィルタリングや、名前・登録日順での並び替えが可能です。
- **検索機能**: キーワード検索に加え、タグによる絞り込みもサポート。
- **ステータス管理**: 「所有中」と「欲しいもの」を切り替え可能。
- **レスポンシブデザイン**: PC、スマートフォンどちらでも快適に動作するモダンなUI。

## 技術スタック

- **Frontend**: Alpine.js, HTML, CSS (No build framework for logic, utilizing Vite for bundling)
- **Backend**: Hono
- **Database**: Cloudflare D1
- **Deployment**: Cloudflare Workers
- **API**: Rakuten Books Total Search API
- **CI/CD**: GitHub Actions

## セットアップと起動

### 必要条件

- Node.js (v20+)
- pnpm

### インストール

```bash
pnpm install
```

### 環境設定

`.dev.vars` ファイルを作成し、楽天APIのアプリIDを設定します（開発用）。

```env
RAKUTEN_APP_ID=your_rakuten_app_id
```

### データベース設定

```bash
# マイグレーションファイルの生成
pnpm db:generate

# ローカルDBへのマイグレーション適用
pnpm db:migrate
```

### 開発サーバーの起動

```bash
pnpm dev
```

`http://localhost:5173` でアプリケーションにアクセスできます。

## テスト

```bash
pnpm test
```

## デプロイ (CI/CD)

GitHub Actions を使用して、`main` ブランチへのプッシュ時に自動的に Cloudflare Workers へデプロイされます。また、以下の処理が自動実行されます。

1. **Build**: クライアントアセットの圧縮ビルドとサーバーコードのビルド
2. **Migration**: 本番DB (`item-manage-db`) へのマイグレーション適用
3. **Deploy**: Cloudflare Workers へのデプロイ

### 必要な GitHub Secrets

リポジトリの Settings > Secrets and variables > Actions に以下を設定してください。

- `CLOUDFLARE_API_TOKEN`: Cloudflare Workers および D1 に対する編集権限を持つトークン (Permission: Workers Scripts: Edit, D1: Edit, Account Settings: Read)
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare アカウント ID
