import { Html5QrcodeScanner } from "html5-qrcode";
import { fetchItemInfo } from "../utils/api-client";
import { type BookInfo } from "../../types";

interface ScannerItem extends BookInfo {
    id: string;
    status: string;
}

export default function scanner() {
    return {
        isScanning: false,
        tempItems: [] as ScannerItem[], // 一時リスト
        scanner: null as Html5QrcodeScanner | null,

        init() {
            console.log("Scanner component initialized");
        },

        startScanner() {
            this.isScanning = true;
            // Alpine.js context will provide $nextTick
            (this as any).$nextTick(() => {
                this.scanner = new Html5QrcodeScanner(
                    "reader",
                    { fps: 10, qrbox: { width: 250, height: 250 } },
          /* verbose= */ false
                );
                this.scanner.render(
                    this.onScanSuccess.bind(this),
                    (_errorMessage: string) => { /* console.warn(_errorMessage); */ }
                );
            });
        },

        stopScanner() {
            if (this.scanner) {
                this.scanner.clear().catch((error: any) => console.error("Failed to clear scanner", error));
                this.scanner = null;
            }
            this.isScanning = false;
        },

        // Continuous Scanning State
        lastScannedCode: null as string | null,
        scanCooldown: false,

        async onScanSuccess(decodedText: string) {
            // クールダウン中または同じコードの連続読み取りを防ぐ
            if (this.scanCooldown) return;
            if (this.lastScannedCode === decodedText) return;

            console.log(`Code matched = ${decodedText}`);

            // 日本の書籍の2段目バーコード（19...）は無視する
            if (decodedText.startsWith('19')) {
                return;
            }

            // クールダウン開始
            this.scanCooldown = true;
            this.lastScannedCode = decodedText;
            setTimeout(() => {
                this.scanCooldown = false;
                this.lastScannedCode = null; // 同じ商品でも一定時間後は再スキャン可能にする場合はnullに戻す
            }, 2000); // 2秒間のクールダウン

            // ISBN/JANらしき数字（13桁）であれば情報を取得
            if (decodedText.length === 13 || decodedText.length === 10) {
                // 重複チェック
                // @ts-ignore: app context access
                if (this.savedItems.some(i => i.barcode === decodedText || i.name === decodedText) || this.tempItems.some(i => i.barcode === decodedText)) {
                    // @ts-ignore: app context access
                    this.showToast('既に追加されています');
                    return;
                }

                const info = await fetchItemInfo(decodedText);
                if (info) {
                    this.tempItems.push({
                        ...info,
                        id: crypto.randomUUID(),
                        status: 'temp'
                    });
                    // @ts-ignore: app context access
                    this.showToast('リストに追加しました');
                } else {
                    alert(`情報を取得できませんでした: ${decodedText}`);
                }
            } else {
                alert(`未対応のコード形式です: ${decodedText}`);
            }
        },

        removeItem(id: string) {
            this.tempItems = this.tempItems.filter(item => item.id !== id);
        }
    };
}
