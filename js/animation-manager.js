/**
 * AnimationManager - 統合アニメーション制御ライブラリ
 * BASE ECサイトテーマ用アニメーション管理（緊急外部化版）
 * 
 * @version 1.0.0
 * @description 商品グリッド・フェード・スクロールアニメーションの統合制御
 * @features IntersectionObserver、レスポンシブ対応、パフォーマンス最適化
 * @requires AnimationConfig
 */

const AnimationManager = {
    // インターセクションオブザーバーのインスタンス管理
    observers: new Map(),
    isInitialized: false,
    
    /**
     * オブザーバー作成（最適化）
     */
    createObserver(callback, options = {}) {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };
        return new IntersectionObserver(callback, {...defaultOptions, ...options});
    },
    
    /**
     * 関連商品アニメーション初期化
     */
    initRelatedProducts() {
        const relatedItems = document.querySelectorAll('.related-product-item');
        if (relatedItems.length === 0) return;
        
        const observer = this.createObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        });
        
        relatedItems.forEach((item, index) => {
            const config = window.AnimationConfig || {
                TRANSITION_DURATION: '0.8s',
                STAGGER_DELAY: 0.1
            };
            
            Object.assign(item.style, {
                opacity: '0',
                transform: 'translateY(30px)',
                transition: `opacity ${config.TRANSITION_DURATION} ease ${index * config.STAGGER_DELAY}s, transform ${config.TRANSITION_DURATION} ease ${index * config.STAGGER_DELAY}s`
            });
            observer.observe(item);
        });
        
        this.observers.set('relatedProducts', observer);
    },
    
    /**
     * 商品アイテムスクロールアニメーション
     */
    animateOnScroll() {
        const items = document.querySelectorAll('.product-item:not(.scroll-animated)');
        const config = window.AnimationConfig || {SCROLL_THRESHOLD: 100};
        
        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - config.SCROLL_THRESHOLD && rect.bottom > 0;
            if (isVisible) {
                item.classList.add('scroll-animated');
            }
        });
    },
    
    /**
     * ホームページヒーローアニメーション
     */
    initHomepageAnimation() {
        // ページ状態チェック（簡略化）
        const hasMainVisual = document.querySelector('.main-visual') !== null;
        const hasProductDetail = document.querySelector('.product-detail') !== null;
        const isShopTopPage = document.body.id === 'shopTopPage';
        
        const isHomePage = isShopTopPage && hasMainVisual && !hasProductDetail;
        
        if (!isHomePage) return;
        
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            const config = window.AnimationConfig || {FADE_DELAY: 2000};
            setTimeout(() => heroImage.classList.add('fade-in'), config.FADE_DELAY);
        }
    },
    
    /**
     * 商品アイテムアニメーション遅延設定
     */
    initProductItemDelays() {
        const productItems = document.querySelectorAll('.product-item');
        const config = window.AnimationConfig || {STAGGER_DELAY: 0.1};
        
        productItems.forEach((item, index) => {
            if (index < 20) { // 最初の20個のみ処理（パフォーマンス最適化）
                const delay = (index + 1) * config.STAGGER_DELAY;
                item.style.animationDelay = `${delay}s`;
            }
        });
    },
    
    /**
     * IntersectionObserver を使用した商品グリッドアニメーション
     */
    initProductGridAnimation() {
        const productItems = document.querySelectorAll('.product-item');
        if (productItems.length === 0) return;
        
        const observer = this.createObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-50px 0px'
        });
        
        productItems.forEach(item => {
            observer.observe(item);
        });
        
        this.observers.set('productGrid', observer);
    },
    
    /**
     * スクロール最適化（スロットル処理）
     */
    initScrollOptimization() {
        let scrollTimeout = null;
        
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(() => {
                this.animateOnScroll();
                scrollTimeout = null;
            }, 16); // 60fps制限
        }, {passive: true});
    },
    
    /**
     * メイン初期化関数
     */
    init() {
        if (this.isInitialized) return;
        
        // DOMContentLoadedの確認
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
            return;
        }
        
        try {
            // 各アニメーション機能の初期化
            this.initHomepageAnimation();
            this.initRelatedProducts();
            this.initProductItemDelays();
            this.initProductGridAnimation();
            this.initScrollOptimization();
            
            this.isInitialized = true;
            console.info('AnimationManager: 初期化完了');
            
        } catch (error) {
            console.error('AnimationManager: 初期化エラー', error);
        }
    },
    
    /**
     * 破棄処理
     */
    destroy() {
        // 全てのオブザーバーを破棄
        this.observers.forEach((observer, key) => {
            observer.disconnect();
            this.observers.delete(key);
        });
        
        this.isInitialized = false;
        console.info('AnimationManager: 破棄完了');
    },
    
    /**
     * 手動でアニメーションを再初期化
     */
    reinit() {
        this.destroy();
        this.init();
    }
};

// 自動初期化
if (typeof window !== 'undefined') {
    window.AnimationManager = AnimationManager;
    
    // AnimationConfigの読み込みを待ってから初期化
    if (window.AnimationConfig) {
        AnimationManager.init();
    } else {
        // AnimationConfigの読み込みを待機
        let checkConfig = setInterval(() => {
            if (window.AnimationConfig) {
                clearInterval(checkConfig);
                AnimationManager.init();
            }
        }, 100);
        
        // 5秒後にタイムアウト
        setTimeout(() => {
            clearInterval(checkConfig);
            if (!AnimationManager.isInitialized) {
                console.warn('AnimationManager: AnimationConfig読み込みタイムアウト、基本設定で初期化');
                AnimationManager.init();
            }
        }, 5000);
    }
}

// ES6モジュールエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}