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
    ${import.meta.env.PROD ? html`
    <link rel="stylesheet" href="/assets/main.css">
    <script type="module" src="/assets/main.js"></script>
    ` : html`
    <script type="module" src="/src/client/main.ts"></script>
    `}
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`

export const MainView = html`
<div x-data="app">
  <div class="container" style="padding-top: 0rem; padding-bottom: 5rem;">

    <!-- 一時リスト -->
    <div x-show="tempItems.length > 0" style="margin-top: 1rem; margin-bottom: 3rem;">
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
                  <option value="bluray">Blu-ray</option>
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
              <div class="input-group">
                <label style="font-size: 0.7rem; color: var(--text-muted)">タグ (カンマ区切り)</label>
                <input type="text" x-model="item.tags" placeholder="限定版, 完結済み..." style="width: 150px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 4px; padding: 2px 4px; font-size: 0.8rem;">
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
    <div style="margin-top: 0rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h2 style="font-size: 1.1rem; color: var(--text-muted); margin: 0;">Item Manage</h2>
        <div style="font-size: 0.8rem; color: var(--text-muted)" x-text="filteredItems.length + ' 件該当'"></div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
      <template x-for="item in filteredItems" :key="item.id">
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
                  item.category === 'bluray' ? '🔵' : 
                  item.category === 'game' ? '🎮' : '📦'
                "></span>
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-align: right;">
                <div x-show="item.listPrice" x-text="item.listPrice ? '定価: ¥' + item.listPrice.toLocaleString() : ''"></div>
                <div x-show="item.purchasePrice" x-text="item.purchasePrice ? '購入: ¥' + item.purchasePrice.toLocaleString() : ''" style="color: #60a5fa"></div>
              </div>
            </div>
            <div class="item-name" x-text="item.name"></div>
            <!-- タグ表示 -->
            <div x-show="item.tags" style="margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.3rem;">
              <template x-for="tag in (item.tags || '').split(',').map(t => t.trim()).filter(t => t)" :key="tag">
                  <span style="font-size: 0.65rem; background: rgba(96, 165, 250, 0.2); color: #93c5fd; padding: 1px 6px; border-radius: 10px; border: 1px solid rgba(96, 165, 250, 0.3);" x-text="tag"></span>
              </template>
            </div>
            <div style="font-size: 0.7rem; color: #64748b; margin-top: 0.5rem; text-align: right;" x-text="item.createdAt ? new Date(item.createdAt).toLocaleDateString('ja-JP') : ''"></div>
            <div class="actions">
              <button class="badge-btn" @click="openEditModal(item)">
                詳細・編集
              </button>
            </div>
          </div>
        </div>
      </template>
      </div>
    </div>
  </div>

  <!-- 固定要素 (Modals, FABs) -->
  
  <!-- 浮遊アクションボタン (FAB) -->
  <button class="fab" @click="startScanner()" x-show="!isScanning" title="スキャンを開始">＋</button>
  <button class="fab fab-left" @click="showSearch = !showSearch" x-show="!isScanning" title="検索を切り替え">🔍</button>

  <!-- スキャンパネル (ボトムシート) -->
  <div x-show="isScanning" class="modal-backdrop" x-transition.opacity></div>
  <div x-show="isScanning" 
       class="bottom-sheet"
       x-transition:enter="transition ease-out duration-300 transform"
       x-transition:enter-start="translate-y-full"
       x-transition:enter-end="translate-y-0"
       x-transition:leave="transition ease-in duration-200 transform"
       x-transition:leave-start="translate-y-0"
       x-transition:leave-end="translate-y-full">
    <div class="bottom-sheet-handle"></div>
    <div id="reader"></div>
    <button @click="stopScanner" style="margin-top: 1.5rem; background: transparent; color: var(--text-muted); border: none; width: 100%; font-size: 0.9rem; font-weight: 600;">
      スキャンを終了
    </button>
  </div>

  <!-- 検索パネル (ボトムシート) -->
  <div x-show="showSearch" class="modal-backdrop" @click="showSearch = false" x-transition.opacity></div>
  <div x-show="showSearch" 
       class="bottom-sheet"
       x-transition:enter="transition ease-out duration-300 transform"
       x-transition:enter-start="translate-y-full"
       x-transition:enter-end="translate-y-0"
       x-transition:leave="transition ease-in duration-200 transform"
       x-transition:leave-start="translate-y-0"
       x-transition:leave-end="translate-y-full">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
      <div class="bottom-sheet-handle" style="margin: 0; flex: 1;"></div>
      <button @click="resetSearch" style="background: transparent; border: none; color: var(--accent-color); font-size: 0.8rem; font-weight: 600; cursor: pointer;">
        すべてクリア
      </button>
    </div>
    <div class="filter-grid">
      <!-- 1行目: キーワード & タグ -->
      <div class="filter-row">
        <div class="input-group">
          <label style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.3rem; display: block;">キーワード</label>
          <input type="text" x-model="searchQuery" placeholder="タイトル、説明文..." class="filter-input">
        </div>
        <div class="input-group">
          <label style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.3rem; display: block;">タグ検索</label>
          <input type="text" x-model="searchTags" placeholder="タグ名..." class="filter-input">
        </div>
      </div>
      <!-- 2行目: カテゴリ -->
      <div class="input-group">
        <label style="font-size: 0.7rem; color: var(--text-muted); display: block;">カテゴリ</label>
        <div class="filter-group">
          <template x-for="cat in [
            {v: 'all', l: 'すべて'},
            {v: 'book', l: '本'},
            {v: 'cd', l: 'CD'},
            {v: 'dvd', l: 'DVD'},
            {v: 'bluray', l: 'Blu-ray'},
            {v: 'game', l: 'ゲーム'},
            {v: 'other', l: 'その他'}
          ]" :key="cat.v">
            <label class="radio-chip">
              <input type="radio" x-model="searchCategory" :value="cat.v">
              <span x-text="cat.l"></span>
            </label>
          </template>
        </div>
      </div>
      <!-- 3行目: ステータス -->
      <div class="input-group">
        <label style="font-size: 0.7rem; color: var(--text-muted); display: block;">ステータス</label>
        <div class="filter-group">
          <template x-for="stat in [
            {v: 'all', l: 'すべて'},
            {v: 'owned', l: '所有中'},
            {v: 'wishlist', l: '欲しいもの'}
          ]" :key="stat.v">
            <label class="radio-chip">
              <input type="radio" x-model="searchStatus" :value="stat.v">
              <span x-text="stat.l"></span>
            </label>
          </template>
        </div>
      </div>
      <!-- 4行目: 並び替え -->
      <div class="input-group">
        <label style="font-size: 0.7rem; color: var(--text-muted); display: block;">並び替え</label>
        <div class="filter-group">
          <template x-for="sort in [
            {v: 'created_desc', l: '登録日↓'},
            {v: 'created_asc', l: '登録日↑'},
            {v: 'name_asc', l: '名前順↑'},
            {v: 'name_desc', l: '名前順↓'}
          ]" :key="sort.v">
            <label class="radio-chip">
              <input type="radio" x-model="searchSort" :value="sort.v">
              <span x-text="sort.l"></span>
            </label>
          </template>
        </div>
      </div>
    </div>
  </div>

  <!-- 編集・詳細モーダル -->
  <div x-show="isModalOpen" 
       x-transition:enter="transition ease-out duration-300"
       x-transition:enter-start="opacity-0"
       x-transition:enter-end="opacity-100"
       x-transition:leave="transition ease-in duration-200"
       x-transition:leave-start="opacity-100"
       x-transition:leave-end="opacity-0"
       style="position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(8px);">
    
    <div @click.away="closeModal" 
         class="glass-panel" 
         style="width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; padding: 2rem; position: relative; border-color: rgba(255,255,255,0.2);">
      
      <button @click="closeModal" style="position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; color: var(--text-muted); font-size: 1.5rem;">&times;</button>
      
      <template x-if="editingItem">
        <div>
          <h2 style="font-size: 1.25rem; margin-bottom: 1.5rem; color: #60a5fa;">アイテム詳細</h2>
          
          <div style="display: flex; gap: 1.5rem; margin-bottom: 2rem;">
            <img :src="editingItem.imageUrl || 'https://via.placeholder.com/100x140'" style="width: 100px; height: 140px; object-fit: cover; border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);">
            <div style="flex: 1;">
              <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem;" x-text="editingItem.name"></div>
              <div style="font-size: 0.8rem; color: var(--text-muted);" x-text="'JAN/ISBN: ' + (editingItem.barcode || '---')"></div>
              <div style="margin-top: 1rem;">
                <span :class="'status-badge ' + (editingItem.status === 'owned' ? 'status-owned' : 'status-wish')" 
                      x-text="editingItem.status === 'owned' ? '所有中' : '欲しいもの'"></span>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1.2rem;">
            <div class="input-group">
              <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">ステータス</label>
              <select x-model="editingItem.status" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 6px; padding: 8px 12px;">
                <option value="owned">所有中</option>
                <option value="wishlist">欲しいもの</option>
              </select>
            </div>

            <div class="input-group">
              <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">カテゴリ</label>
              <select x-model="editingItem.category" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 6px; padding: 8px 12px;">
                <option value="book">本</option>
                <option value="cd">CD</option>
                <option value="dvd">DVD</option>
                <option value="bluray">Blu-ray</option>
                <option value="game">ゲーム</option>
                <option value="other">その他</option>
              </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="input-group">
                  <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">定価 (¥)</label>
                  <input type="number" x-model.number="editingItem.listPrice" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 6px; padding: 8px 12px;">
                </div>
                <div class="input-group">
                  <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">購入価格 (¥)</label>
                  <input type="number" x-model.number="editingItem.purchasePrice" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 6px; padding: 8px 12px;">
                </div>
            </div>

            <div class="input-group">
              <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">タグ (カンマ区切り)</label>
              <input type="text" x-model="editingItem.tags" placeholder="限定版, 完結済み..." style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 6px; padding: 8px 12px;">
            </div>

            <div class="input-group">
              <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">メモ</label>
              <textarea x-model="editingItem.description" rows="8" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 6px; padding: 8px 12px; font-size: 0.9rem;"></textarea>
            </div>
          </div>

          <div style="margin-top: 2.5rem; display: flex; flex-direction: column; gap: 0.8rem;">
            <button @click="updateItem" class="btn-primary" style="background: #3b82f6;">変更を保存する</button>
            <div style="display: flex; gap: 0.8rem;">
                <button @click="closeModal" class="badge-btn" style="flex: 1; padding: 0.6rem;">キャンセル</button>
                <button @click="deleteSavedItem(editingItem.id)" class="badge-btn" style="flex: 1; padding: 0.6rem; border-color: rgba(239, 68, 68, 0.4); color: #f87171;">アイテムを削除</button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>

  <!-- Toast Notification -->
  <div x-show="isToastVisible"
       class="toast-notification"
       x-transition:enter="transition ease-out duration-300"
       x-transition:enter-start="opacity-0 -translate-y-2"
       x-transition:enter-end="opacity-100 translate-y-0"
       x-transition:leave="transition ease-in duration-200"
       x-transition:leave-start="opacity-100 translate-y-0"
       x-transition:leave-end="opacity-0 -translate-y-2">
    <span x-text="toastMessage"></span>
  </div>
</div>
`
