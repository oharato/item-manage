# Item Manage 開発計画

持ち物（本、CD、ゲーム等）をバーコードスキャンで手軽に登録し、所有物と「欲しいもの」を管理するアプリケーション。

## コア機能

- **バーコードスキャン登録**: 本、CD、ゲームなどのバーコードをスキャンし、外部APIから書誌情報や商品情報を自動取得。
- **一時リストフロー**: スキャン直後に「一時リスト」へ表示。内容を確認しつつ「持ち物」または「欲しいもの」タグを選択して本登録。
- **カテゴリ・タグ管理**: 「本」「CD」「ゲーム」などのプリセットカテゴリ、および自由なタグ付け。
- **ステータス管理**: 「所有（持ち物）」と「未所有（欲しいもの）」の明確な区分け。
- **検索・フィルタリング**: キーワード、カテゴリ、タグ、ステータス（持ち物/欲しいもの）による検索。

## 技術スタック

- **Package Manager**: pnpm
- **Runtime/Compiler**: @typescript/native-preview
- **Frontend**: Alpine.js
- **Styling**: Vanilla CSS
- **Framework**: Hono (Cloudflare Workers)
- **Database**: Cloudflare D1
- **Authentication**: Better Auth (with Drizzle ORM)
- **Lint/Format**: oxlint, oxfmt
- **Testing**: Vitest

## 登録フローのイメージ

1. バーコードスキャン実行
2. 外部APIから情報を取得し、一時的なリスト（インボックス）に追加
3. ユーザーが一時的なリストを確認
4. 「持ち物」として登録するか「欲しいもの」として登録するかを選択
5. D1データベースに本登録。一時リストから削除。
