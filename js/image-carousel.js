/**
 * ImageCarouselManager - 商品画像カルーセル管理ライブラリ
 * BASE ECサイトテーマ用商品詳細画像表示機能
 * 
 * @version 1.0.0
 * @description 商品詳細ページの複数画像表示とタッチ/スワイプ操作
 * @features タッチスワイプ、キーボード操作、自動リサイズ、アクセシビリティ対応
 */

const ImageCarouselManager = {
    // 状態管理
    currentIndex: 0,
    images: [],
    isInitialized: false,
    touchStartX: 0,
    touchEndX: 0,
    isTransitioning: false,
    
    // 設定値
    config: {
        swipeThreshold: 50,        // スワイプ判定の最小距離
        transitionDuration: 300,   // 画像切り替え時間
        autoAdvanceDelay: 5000,    // 自動進行間隔（0で無効）
        enableKeyboard: true,      // キーボード操作有効
        enableTouch: true,         // タッチ操作有効
        enableAutoAdvance: false,  // 自動進行有効
        lazyLoadOffset: 1,         // 遅延読み込みのオフセット
    },
    
    // DOM要素キャッシュ
    elements: {
        mainImage: null,
        thumbnails: [],
        container: null,
        prevBtn: null,
        nextBtn: null,
        counter: null,
    },
    
    /**
     * 初期化処理
     */
    init: function() {
        if (this.isInitialized) return;
        
        try {
            // DOM要素の取得
            this.elements.mainImage = this.getElement('.product-detail-image img, .main-image-container img');
            this.elements.container = this.getElement('.product-detail-image, .image-carousel-container');
            
            if (!this.elements.mainImage || !this.elements.container) {
                console.warn('ImageCarouselManager: Required elements not found');
                return false;
            }
            
            // 画像一覧の構築
            this.buildImageList();
            
            if (this.images.length <= 1) {
                console.info('ImageCarouselManager: Single image, carousel not needed');
                return false;
            }
            
            // UI要素の作成
            this.createUI();
            
            // イベントリスナーの設定
            this.setupEventListeners();
            
            // 初期状態の設定
            this.updateDisplay();
            
            // 遅延読み込みの初期化
            this.initLazyLoading();
            
            this.isInitialized = true;
            console.info('ImageCarouselManager: Initialized with', this.images.length, 'images');
            
            return true;
            
        } catch (error) {
            console.error('ImageCarouselManager: Initialization failed', error);
            return false;
        }
    },
    
    /**
     * DOM要素の安全な取得
     */
    getElement: function(selector) {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn('ImageCarouselManager: Element not found:', selector);
            return null;
        }
    },
    
    /**
     * 画像一覧の構築
     */
    buildImageList: function() {
        this.images = [];
        
        // メイン画像の追加
        if (this.elements.mainImage && this.elements.mainImage.src) {
            this.images.push({
                src: this.elements.mainImage.src,
                alt: this.elements.mainImage.alt || '',
                loaded: true
            });
        }
        
        // サムネイル画像の検索と追加
        const thumbnails = document.querySelectorAll('.thumbnail-item img, .product-image-thumbnail img');
        thumbnails.forEach((thumb, index) => {
            const fullSizeUrl = this.getThumbnailFullSize(thumb);
            if (fullSizeUrl && !this.images.some(img => img.src === fullSizeUrl)) {
                this.images.push({
                    src: fullSizeUrl,
                    alt: thumb.alt || `Product image ${index + 2}`,
                    loaded: false
                });
            }
        });
        
        // BASE特有の画像URL形式での検索
        this.findBASEImages();
    },
    
    /**
     * BASE特有の画像URL検索
     */
    findBASEImages: function() {
        // BASEテンプレート内の画像URLパターンを検索
        const baseImagePatterns = [
            /ItemImage(\d+)URL-640/g,
            /ItemImage(\d+)URL-1280/g
        ];
        
        const pageContent = document.documentElement.innerHTML;
        baseImagePatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(pageContent)) !== null) {
                const imageNum = match[1];
                const fullUrl = pageContent.match(new RegExp(`{ItemImage${imageNum}URL-640}`, 'g'));
                if (fullUrl && !this.images.some(img => img.src.includes(`ItemImage${imageNum}`))) {
                    // 実際のURLに変換する処理（BASEテンプレート変数の場合）
                    // この部分は実装環境に応じて調整が必要
                }
            }
        });
    },
    
    /**
     * サムネイルから高解像度画像URLを生成
     */
    getThumbnailFullSize: function(thumbnail) {
        const src = thumbnail.src;
        if (!src) return null;
        
        // BASEの画像URL形式を高解像度に変換
        return src
            .replace(/-76(?=\.[^.]*$)/, '-640')
            .replace(/-146(?=\.[^.]*$)/, '-640')
            .replace(/-300(?=\.[^.]*$)/, '-640');
    },
    
    /**
     * UI要素の作成
     */
    createUI: function() {
        // コンテナにカルーセル用クラスを追加
        this.elements.container.classList.add('image-carousel-active');
        
        // ナビゲーションボタンの作成
        this.createNavigationButtons();
        
        // サムネイル一覧の作成
        this.createThumbnailGrid();
        
        // カウンターの作成
        this.createCounter();
        
        // スタイルの追加
        this.injectStyles();
    },
    
    /**
     * ナビゲーションボタンの作成
     */
    createNavigationButtons: function() {
        if (this.images.length <= 1) return;
        
        // 前へボタン
        this.elements.prevBtn = document.createElement('button');
        this.elements.prevBtn.className = 'carousel-btn carousel-prev';
        this.elements.prevBtn.innerHTML = '‹';
        this.elements.prevBtn.setAttribute('aria-label', 'Previous image');
        
        // 次へボタン
        this.elements.nextBtn = document.createElement('button');
        this.elements.nextBtn.className = 'carousel-btn carousel-next';
        this.elements.nextBtn.innerHTML = '›';
        this.elements.nextBtn.setAttribute('aria-label', 'Next image');
        
        // DOM に追加
        this.elements.container.appendChild(this.elements.prevBtn);
        this.elements.container.appendChild(this.elements.nextBtn);
    },
    
    /**
     * サムネイル一覧の作成
     */
    createThumbnailGrid: function() {
        if (this.images.length <= 1) return;
        
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'carousel-thumbnails';
        
        this.images.forEach((image, index) => {
            const thumbBtn = document.createElement('button');
            thumbBtn.className = 'carousel-thumbnail';
            thumbBtn.setAttribute('aria-label', `View image ${index + 1}`);
            
            const thumbImg = document.createElement('img');
            thumbImg.src = this.getThumbnailUrl(image.src);
            thumbImg.alt = image.alt;
            thumbImg.loading = 'lazy';
            
            thumbBtn.appendChild(thumbImg);
            thumbBtn.addEventListener('click', () => this.goToImage(index));
            
            thumbnailContainer.appendChild(thumbBtn);
            this.elements.thumbnails.push(thumbBtn);
        });
        
        // メイン画像の下に配置
        this.elements.container.insertAdjacentElement('afterend', thumbnailContainer);
    },
    
    /**
     * サムネイル用URL生成
     */
    getThumbnailUrl: function(fullUrl) {
        return fullUrl.replace(/-640(?=\.[^.]*$)/, '-146');
    },
    
    /**
     * カウンターの作成
     */
    createCounter: function() {
        if (this.images.length <= 1) return;
        
        this.elements.counter = document.createElement('div');
        this.elements.counter.className = 'carousel-counter';
        this.elements.container.appendChild(this.elements.counter);
    },
    
    /**
     * イベントリスナーの設定
     */
    setupEventListeners: function() {
        // ナビゲーションボタン
        if (this.elements.prevBtn) {
            this.elements.prevBtn.addEventListener('click', () => this.prevImage());
        }
        if (this.elements.nextBtn) {
            this.elements.nextBtn.addEventListener('click', () => this.nextImage());
        }
        
        // タッチ/スワイプ操作
        if (this.config.enableTouch) {
            this.setupTouchSwipe();
        }
        
        // キーボード操作
        if (this.config.enableKeyboard) {
            this.setupKeyboardControls();
        }
        
        // 画像読み込み完了イベント
        this.elements.mainImage.addEventListener('load', () => {
            this.onImageLoad();
        });
        
        // ウィンドウリサイズ
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    },
    
    /**
     * タッチ/スワイプ操作の設定
     */
    setupTouchSwipe: function() {
        const container = this.elements.container;
        
        // Touch events
        container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        }, { passive: true });
        
        // Mouse events (for desktop testing)
        container.addEventListener('mousedown', (e) => {
            this.touchStartX = e.clientX;
            container.style.cursor = 'grabbing';
        });
        
        container.addEventListener('mouseup', (e) => {
            this.touchEndX = e.clientX;
            this.handleSwipe();
            container.style.cursor = 'grab';
        });
    },
    
    /**
     * スワイプ処理
     */
    handleSwipe: function() {
        const swipeDistance = this.touchEndX - this.touchStartX;
        const threshold = this.config.swipeThreshold;
        
        if (Math.abs(swipeDistance) < threshold) return;
        
        if (swipeDistance > 0) {
            this.prevImage();
        } else {
            this.nextImage();
        }
    },
    
    /**
     * キーボード操作の設定
     */
    setupKeyboardControls: function() {
        document.addEventListener('keydown', (e) => {
            // 商品詳細ページでのみ動作
            if (!document.body.id.includes('Detail')) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevImage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextImage();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToImage(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToImage(this.images.length - 1);
                    break;
            }
        });
    },
    
    /**
     * 画像切り替えメソッド
     */
    goToImage: function(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        if (index < 0 || index >= this.images.length) return;
        
        this.isTransitioning = true;
        const previousIndex = this.currentIndex;
        this.currentIndex = index;
        
        // 画像の読み込み
        this.preloadImage(index);
        
        // メイン画像の更新
        this.updateMainImage();
        
        // UI の更新
        this.updateDisplay();
        
        // 遅延読み込み
        this.loadAdjacentImages();
        
        // アニメーション完了後の処理
        setTimeout(() => {
            this.isTransitioning = false;
            this.onTransitionComplete(previousIndex, index);
        }, this.config.transitionDuration);
    },
    
    nextImage: function() {
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.goToImage(nextIndex);
    },
    
    prevImage: function() {
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.goToImage(prevIndex);
    },
    
    /**
     * メイン画像の更新
     */
    updateMainImage: function() {
        const currentImage = this.images[this.currentIndex];
        if (!currentImage) return;
        
        // フェードアウト
        this.elements.mainImage.style.opacity = '0';
        
        setTimeout(() => {
            this.elements.mainImage.src = currentImage.src;
            this.elements.mainImage.alt = currentImage.alt;
            
            // フェードイン
            this.elements.mainImage.style.opacity = '1';
        }, this.config.transitionDuration / 2);
    },
    
    /**
     * 表示の更新
     */
    updateDisplay: function() {
        // サムネイルの状態更新
        this.elements.thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentIndex);
        });
        
        // カウンターの更新
        if (this.elements.counter) {
            this.elements.counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
        }
        
        // ナビゲーションボタンの状態
        if (this.elements.prevBtn) {
            this.elements.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.elements.nextBtn) {
            this.elements.nextBtn.disabled = this.currentIndex === this.images.length - 1;
        }
    },
    
    /**
     * 画像の先読み
     */
    preloadImage: function(index) {
        const image = this.images[index];
        if (!image || image.loaded) return;
        
        const img = new Image();
        img.onload = () => {
            image.loaded = true;
        };
        img.src = image.src;
    },
    
    /**
     * 隣接画像の遅延読み込み
     */
    loadAdjacentImages: function() {
        const offset = this.config.lazyLoadOffset;
        for (let i = -offset; i <= offset; i++) {
            const index = this.currentIndex + i;
            if (index >= 0 && index < this.images.length) {
                this.preloadImage(index);
            }
        }
    },
    
    /**
     * 遅延読み込みの初期化
     */
    initLazyLoading: function() {
        // 現在の画像と隣接画像を読み込み
        this.loadAdjacentImages();
    },
    
    /**
     * イベントハンドラー
     */
    onImageLoad: function() {
        // 画像読み込み完了時の処理
        this.elements.mainImage.classList.add('loaded');
    },
    
    onTransitionComplete: function(previousIndex, currentIndex) {
        // 遷移完了時の処理
        console.debug('ImageCarousel: Transitioned from', previousIndex, 'to', currentIndex);
    },
    
    handleResize: function() {
        // リサイズ時の処理
        this.updateDisplay();
    },
    
    /**
     * スタイルの注入
     */
    injectStyles: function() {
        if (document.getElementById('image-carousel-styles')) return;
        
        const styles = `
            <style id="image-carousel-styles">
            .image-carousel-active { position: relative; cursor: grab; }
            .image-carousel-active:active { cursor: grabbing; }
            
            .carousel-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0,0,0,0.5);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 18px;
                cursor: pointer;
                z-index: 10;
                transition: all 0.3s ease;
            }
            .carousel-btn:hover { background: rgba(0,0,0,0.8); }
            .carousel-btn:disabled { opacity: 0.3; cursor: not-allowed; }
            .carousel-prev { left: 10px; }
            .carousel-next { right: 10px; }
            
            .carousel-thumbnails {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
                gap: 8px;
                margin-top: 16px;
                max-width: 400px;
            }
            .carousel-thumbnail {
                aspect-ratio: 1;
                border: 2px solid transparent;
                border-radius: 4px;
                overflow: hidden;
                cursor: pointer;
                transition: border-color 0.3s ease;
            }
            .carousel-thumbnail.active { border-color: #D43883; }
            .carousel-thumbnail img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .carousel-counter {
                position: absolute;
                bottom: 10px;
                right: 10px;
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
            }
            
            @media (max-width: 768px) {
                .carousel-btn { width: 36px; height: 36px; font-size: 16px; }
                .carousel-thumbnails { grid-template-columns: repeat(auto-fit, minmax(50px, 1fr)); }
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    },
    
    /**
     * ユーティリティ関数
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * 破棄処理
     */
    destroy: function() {
        // イベントリスナーの削除
        // DOM要素の削除
        // 状態のリセット
        this.isInitialized = false;
        console.info('ImageCarouselManager: Destroyed');
    },
    
    /**
     * デバッグ用ヘルパー
     */
    debug: {
        logState: function() {
            console.log('ImageCarouselManager State:', {
                currentIndex: ImageCarouselManager.currentIndex,
                imagesCount: ImageCarouselManager.images.length,
                isInitialized: ImageCarouselManager.isInitialized,
                isTransitioning: ImageCarouselManager.isTransitioning,
            });
        },
        
        listImages: function() {
            console.table(ImageCarouselManager.images);
        }
    }
};

// グローバル公開
if (typeof window !== 'undefined') {
    window.ImageCarouselManager = ImageCarouselManager;
}

// ES6モジュールエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageCarouselManager;
}