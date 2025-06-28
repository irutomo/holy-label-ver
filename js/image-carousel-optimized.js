/**
 * ImageCarouselManager - 商品画像カルーセル管理ライブラリ (最適化版)
 * BASE ECサイトテーマ用商品詳細画像表示機能
 * 
 * @version 2.0.0 - Emergency Optimized
 * @description 商品詳細ページの複数画像表示とタッチ/スワイプ操作 (軽量化版)
 * @features タッチスワイプ、キーボード操作、レスポンシブ対応
 */

const ImageCarouselManager = {
    // コア状態管理
    idx: 0,
    imgs: [],
    init: false,
    startX: 0,
    endX: 0,
    
    // 設定値 (最小限)
    cfg: {
        threshold: 50,
        duration: 300,
        keyboard: true,
        touch: true
    },
    
    // DOM要素キャッシュ
    el: {
        main: null,
        container: null,
        thumbs: [],
        prev: null,
        next: null,
        indicators: null
    },
    
    /**
     * 初期化処理 (最適化版)
     */
    init() {
        if (this.init) return;
        
        try {
            // DOM要素取得
            this.el.main = document.querySelector('#mainImage') || 
                          document.querySelector('.product-detail-image img');
            this.el.container = document.querySelector('#mainImageContainer') || 
                               document.querySelector('.product-detail-image');
                               
            if (!this.el.main || !this.el.container) return false;
            
            // 画像収集
            this.collectImages();
            
            if (this.imgs.length <= 1) return false;
            
            // UI構築
            this.buildUI();
            
            // イベント設定
            this.bindEvents();
            
            this.init = true;
            return true;
            
        } catch (e) {
            console.error('ImageCarousel init failed:', e);
            return false;
        }
    },
    
    /**
     * 画像収集 (BASE EC対応)
     */
    collectImages() {
        this.imgs = [];
        
        // サムネイル要素から収集
        const thumbs = document.querySelectorAll('.thumbnail-item');
        thumbs.forEach(thumb => {
            const img = thumb.dataset.image || thumb.querySelector('img')?.src;
            if (img) {
                this.imgs.push({
                    src: img,
                    alt: thumb.querySelector('img')?.alt || ''
                });
            }
        });
        
        // メイン画像をフォールバック
        if (this.imgs.length === 0 && this.el.main.src) {
            this.imgs.push({
                src: this.el.main.src,
                alt: this.el.main.alt || ''
            });
        }
    },
    
    /**
     * UI構築 (軽量版)
     */
    buildUI() {
        // ナビゲーションボタン
        this.el.prev = this.createElement('button', 'carousel-prev', '‹');
        this.el.next = this.createElement('button', 'carousel-next', '›');
        
        // インジケーター
        this.el.indicators = this.createElement('div', 'carousel-indicators');
        this.imgs.forEach((_, i) => {
            const dot = this.createElement('div', 'carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.onclick = () => this.goto(i);
            this.el.indicators.appendChild(dot);
        });
        
        // DOM追加
        this.el.container.appendChild(this.el.prev);
        this.el.container.appendChild(this.el.next);
        this.el.container.appendChild(this.el.indicators);
        
        // スタイル追加
        this.injectStyles();
    },
    
    /**
     * イベント設定
     */
    bindEvents() {
        // ナビゲーション
        this.el.prev.onclick = () => this.prev();
        this.el.next.onclick = () => this.next();
        
        // キーボード
        if (this.cfg.keyboard) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            });
        }
        
        // タッチ
        if (this.cfg.touch) {
            this.el.main.addEventListener('touchstart', (e) => {
                this.startX = e.touches[0].clientX;
            }, { passive: true });
            
            this.el.main.addEventListener('touchend', (e) => {
                this.endX = e.changedTouches[0].clientX;
                this.handleSwipe();
            }, { passive: true });
        }
    },
    
    /**
     * スワイプ処理
     */
    handleSwipe() {
        const diff = this.startX - this.endX;
        if (Math.abs(diff) > this.cfg.threshold) {
            if (diff > 0) this.next();
            else this.prev();
        }
    },
    
    /**
     * 画像切り替え
     */
    goto(index) {
        if (index < 0 || index >= this.imgs.length || index === this.idx) return;
        
        this.idx = index;
        const img = this.imgs[index];
        
        // 画像更新
        this.el.main.style.opacity = '0.5';
        setTimeout(() => {
            this.el.main.src = img.src;
            this.el.main.alt = img.alt;
            this.el.main.style.opacity = '1';
        }, this.cfg.duration / 2);
        
        // インジケーター更新
        this.el.indicators.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    },
    
    next() {
        this.goto((this.idx + 1) % this.imgs.length);
    },
    
    prev() {
        this.goto(this.idx === 0 ? this.imgs.length - 1 : this.idx - 1);
    },
    
    /**
     * ヘルパー
     */
    createElement(tag, className, text = '') {
        const el = document.createElement(tag);
        el.className = className;
        if (text) el.textContent = text;
        return el;
    },
    
    /**
     * 最小限CSS注入
     */
    injectStyles() {
        if (document.getElementById('carousel-styles')) return;
        
        const css = `
        <style id="carousel-styles">
        .carousel-prev,.carousel-next{position:absolute;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.7);color:#fff;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;z-index:10;transition:background 0.3s}
        .carousel-prev{left:8px}.carousel-next{right:8px}
        .carousel-prev:hover,.carousel-next:hover{background:rgba(0,0,0,0.9)}
        .carousel-indicators{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:4px}
        .carousel-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.5);cursor:pointer;transition:background 0.3s}
        .carousel-dot.active{background:#fff}
        .carousel-dot:hover{background:rgba(255,255,255,0.8)}
        @media (max-width:768px){.carousel-prev,.carousel-next{width:28px;height:28px;font-size:14px}}
        </style>`;
        
        document.head.insertAdjacentHTML('beforeend', css);
    }
};

// グローバル公開
if (typeof window !== 'undefined') {
    window.ImageCarouselManager = ImageCarouselManager;
}

// 自動初期化 (商品詳細ページのみ)
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('#mainImage, .product-detail-image')) {
            ImageCarouselManager.init();
        }
    });
}

// ES6モジュールエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageCarouselManager;
}