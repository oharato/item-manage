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
          <div style="margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: end;">
            <div class="input-group">
              <label style="font-size: 0.7rem; color: var(--text-muted)">カテゴリ</label>
              <select x-model="item.category" style="width: 80px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 4px; padding: 2px 4px; font-size: 0.8rem;">
                <option value="book">本</option>
                <option value="cd">CD</option>
                <option value="dvd">DVD</option>
                <option value="game">ゲーム</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div class="input-group">
              <label style="font-size: 0.7rem; color: var(--text-muted)">定価</label>
              <input type="number" x-model.number="item.listPrice" style="width: 70px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 4px; padding: 2px 4px;">
            </div>
            <div class="input-group">
              <label style="font-size: 0.7rem; color: var(--text-muted)">購入価格</label>
              <input type="number" x-model.number="item.purchasePrice" style="width: 70px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 4px; padding: 2px 4px;">
            </div>
          </div>
          <div class="actions" style="margin-top: 0.8rem;">
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
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
    <template x-for="item in savedItems" :key="item.id">
      <div class="glass-panel item-card" style="margin: 0;">
        <img :src="item.imageUrl || 'https://via.placeholder.com/60x80'" class="item-thumb">
        <div class="item-info">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.2rem;">
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              <span :class="'status-badge ' + (item.status === 'owned' ? 'status-owned' : 'status-wish')" 
                    x-text="item.status === 'owned' ? '所有中' : '欲しいもの'"></span>
              <span style="font-size: 1rem;" x-text="
                item.category === 'book' ? '📚' : 
                item.category === 'cd' ? '💿' : 
                item.category === 'dvd' ? '📀' : 
                item.category === 'game' ? '🎮' : '📦'
              "></span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-align: right;">
              <div x-show="item.listPrice" x-text="'定価: ¥' + item.listPrice.toLocaleString()"></div>
              <div x-show="item.purchasePrice" x-text="'購入: ¥' + item.purchasePrice.toLocaleString()" style="color: #60a5fa"></div>
            </div>
          </div>
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
</div>
`
