import { html } from 'hono/html'

export const Layout = html`
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Item Manage</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <script type="module" src="/src/client/main.ts"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`

export const MainView = html`
<div class="container" x-data="app">
  <header>
    <h1>Item Manage</h1>
    <p style="color: var(--text-muted)">自分だけのプレミアム・アーカイブ</p>
  </header>

  <div class="glass-panel">
    <template x-if="!isScanning">
      <button class="btn-primary" @click="startScanner">
        スキャンを開始する
      </button>
    </template>
    
    <div x-show="isScanning" style="display: none;">
      <div id="reader"></div>
      <button @click="stopScanner" style="margin-top: 1rem; background: transparent; color: var(--text-muted); border: none; width: 100%;">
        キャンセル
      </button>
    </div>
  </div>

  <!-- 一時リスト -->
  <div x-show="tempItems.length > 0" style="margin-top: 2rem;">
    <h2 style="font-size: 1.1rem; margin-bottom: 1rem; color: #60a5fa">一時リスト (Inbox)</h2>
    <template x-for="item in tempItems" :key="item.id">
      <div class="glass-panel item-card">
        <img :src="item.imageUrl || 'https://via.placeholder.com/60x80'" class="item-thumb">
        <div class="item-info">
          <div class="item-name" x-text="item.name"></div>
          <div class="actions">
            <button class="badge-btn" @click="registerItem(item.id, 'owned')" style="color: #10b981">
              持ち物へ
            </button>
            <button class="badge-btn" @click="registerItem(item.id, 'wishlist')" style="color: #f59e0b">
              欲しいものへ
            </button>
            <button class="badge-btn" @click="removeItem(item.id)">
              削除
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>

  <!-- 登録済みリスト -->
  <div style="margin-top: 3rem;">
    <h2 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--text-muted)">アーカイブ</h2>
    <template x-for="item in savedItems" :key="item.id">
      <div class="glass-panel item-card">
        <img :src="item.imageUrl || 'https://via.placeholder.com/60x80'" class="item-thumb">
        <div class="item-info">
          <span :class="'status-badge ' + (item.status === 'owned' ? 'status-owned' : 'status-wish')" 
                x-text="item.status === 'owned' ? '所有中' : '欲しいもの'"></span>
          <div class="item-name" x-text="item.name"></div>
          <div class="actions">
            <button class="badge-btn" @click="deleteSavedItem(item.id)" style="border-color: rgba(239, 68, 68, 0.4); color: #f87171;">
              削除
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</div>
`
