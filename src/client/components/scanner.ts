import { Html5QrcodeScanner } from "html5-qrcode";
import { fetchBookInfo } from "../utils/api-client";
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

        async onScanSuccess(decodedText: string) {
            console.log(`Code matched = ${decodedText}`);

            // 日本の書籍の2段目バーコード（19...）は無視する
            if (decodedText.startsWith('19')) {
                console.log('Skipping price/inner code');
                return;
            }

            this.stopScanner();

            // ISBNらしき数字（13桁）であれば情報を取得
            if (decodedText.length === 13 || decodedText.length === 10) {
                const info = await fetchBookInfo(decodedText);
                if (info) {
                    this.tempItems.push({
                        ...info,
                        id: crypto.randomUUID(),
                        status: 'temp'
                    });
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
