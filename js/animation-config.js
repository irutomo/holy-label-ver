/**
 * AnimationConfig - アニメーション設定管理ライブラリ
 * BASE ECサイトテーマ用統一アニメーション設定
 * 
 * @version 1.0.0
 * @description 全体のアニメーション動作を統一管理
 * @features 設定値の一元管理、レスポンシブ対応、パフォーマンス最適化
 */

const AnimationConfig = {
    /**
     * 基本タイミング設定
     */
    timing: {
        // フェードアニメーション
        FADE_DELAY: 2000,           // ヒーロー画像フェードイン遅延
        FADE_DURATION: 1500,       // フェードアニメーション継続時間
        
        // 段階的アニメーション
        STAGGER_DELAY: 0.1,        // 商品アイテム間の遅延（秒）
        STAGGER_BASE: 100,         // ベース遅延時間（ミリ秒）
        
        // インタラクション
        HOVER_DURATION: 300,       // ホバーエフェクト時間
        CLICK_FEEDBACK: 150,       // クリックフィードバック時間
        
        // スクロールアニメーション
        SCROLL_THROTTLE: 16,       // スクロールイベント間隔（60fps）
        INTERSECTION_THRESHOLD: 0.1, // 交差監視の閾値
        
        // ページ遷移
        PAGE_TRANSITION: 500,      // ページ遷移時間
        LOADING_MIN: 800,          // 最小ローディング時間
    },
    
    /**
     * イージング設定
     */
    easing: {
        // 標準イージング
        EASE_OUT: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        EASE_IN_OUT: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        EASE_BACK: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        
        // 商品アニメーション用
        PRODUCT_HOVER: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        PRODUCT_SCALE: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        
        // ナビゲーション用
        NAV_SLIDE: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        MODAL_APPEAR: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
    },
    
    /**
     * スケール・変形設定
     */
    transforms: {
        // ホバーエフェクト
        HOVER_SCALE: 1.02,         // 商品アイテムホバー時のスケール
        IMAGE_HOVER_SCALE: 1.05,   // 画像ホバー時のスケール
        
        // アニメーション開始位置
        INITIAL_Y: 50,             // 初期Y軸移動量（px）
        INITIAL_SCALE: 0.95,       // 初期スケール値
        
        // 3D効果
        PERSPECTIVE: 1000,         // 3D視点距離
        ROTATE_X: 5,               // X軸回転角度
    },
    
    /**
     * レスポンシブ対応設定
     */
    responsive: {
        // ブレークポイント
        MOBILE_BREAKPOINT: 768,
        TABLET_BREAKPOINT: 1024,
        
        // モバイル用調整値
        mobile: {
            STAGGER_DELAY: 0.05,   // モバイルでは高速化
            FADE_DURATION: 1000,   // 短縮
            HOVER_SCALE: 1.01,     // スケール控えめ
        },
        
        // タブレット用調整値
        tablet: {
            STAGGER_DELAY: 0.08,
            FADE_DURATION: 1200,
            HOVER_SCALE: 1.015,
        },
        
        // デスクトップ用（デフォルト値を使用）
        desktop: {
            // デフォルト値を継承
        }
    },
    
    /**
     * IntersectionObserver設定
     */
    intersection: {
        // 基本設定
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: '-50px 0px -50px 0px',
        
        // 商品グリッド用
        productGrid: {
            threshold: 0.1,
            rootMargin: '-100px 0px -100px 0px',
        },
        
        // ヒーロー画像用
        hero: {
            threshold: 0.5,
            rootMargin: '0px',
        },
        
        // 関連商品用
        related: {
            threshold: 0.2,
            rootMargin: '-50px 0px',
        }
    },
    
    /**
     * CSS Animation Classes
     */
    classes: {
        // 基本状態
        LOADING: 'loading',
        LOADED: 'loaded',
        VISIBLE: 'visible',
        HIDDEN: 'hidden',
        
        // アニメーション状態
        FADE_IN: 'fade-in',
        FADE_OUT: 'fade-out',
        SLIDE_UP: 'slide-up',
        SLIDE_DOWN: 'slide-down',
        SCALE_IN: 'scale-in',
        
        // インタラクション状態
        HOVERING: 'hovering',
        ACTIVE: 'active',
        DISABLED: 'disabled',
        
        // 商品特有
        PRODUCT_LOADED: 'product-loaded',
        IMAGE_LOADED: 'image-loaded',
        OUT_OF_STOCK: 'out-of-stock',
    },
    
    /**
     * パフォーマンス設定
     */
    performance: {
        // 最適化フラグ
        WILL_CHANGE: true,         // will-changeプロパティ使用
        TRANSFORM3D: true,         // transform3d強制使用
        PASSIVE_LISTENERS: true,   // パッシブリスナー使用
        
        // デバウンス・スロットル
        SCROLL_THROTTLE: 16,       // 60fps
        RESIZE_DEBOUNCE: 250,      // リサイズ処理遅延
        
        // 優先度制御
        CRITICAL_ANIMATIONS: ['fade-in', 'product-loaded'],
        DEFERRED_ANIMATIONS: ['related-products', 'scroll-effects'],
    },
    
    /**
     * 現在のデバイス環境に応じた設定を取得
     */
    getCurrentConfig: function() {
        const width = window.innerWidth;
        
        if (width <= this.responsive.MOBILE_BREAKPOINT) {
            return { ...this, ...this.responsive.mobile };
        } else if (width <= this.responsive.TABLET_BREAKPOINT) {
            return { ...this, ...this.responsive.tablet };
        } else {
            return this;
        }
    },
    
    /**
     * パフォーマンス設定の動的調整
     */
    adjustForPerformance: function() {
        // 低性能デバイスの検出
        const isLowPerformance = (
            navigator.hardwareConcurrency < 4 ||
            navigator.deviceMemory < 4 ||
            /Android.*Chrome\/[0-5]/.test(navigator.userAgent)
        );
        
        if (isLowPerformance) {
            return {
                ...this,
                timing: {
                    ...this.timing,
                    STAGGER_DELAY: this.timing.STAGGER_DELAY * 0.5,
                    FADE_DURATION: this.timing.FADE_DURATION * 0.7,
                },
                performance: {
                    ...this.performance,
                    WILL_CHANGE: false,
                    TRANSFORM3D: false,
                }
            };
        }
        
        return this;
    },
    
    /**
     * CSS変数への設定値適用
     */
    applyCSSVariables: function() {
        const root = document.documentElement;
        const config = this.getCurrentConfig();
        
        // タイミング設定
        root.style.setProperty('--anim-fade-delay', `${config.timing.FADE_DELAY}ms`);
        root.style.setProperty('--anim-fade-duration', `${config.timing.FADE_DURATION}ms`);
        root.style.setProperty('--anim-stagger-delay', `${config.timing.STAGGER_DELAY}s`);
        root.style.setProperty('--anim-hover-duration', `${config.timing.HOVER_DURATION}ms`);
        
        // イージング設定
        root.style.setProperty('--anim-ease-out', config.easing.EASE_OUT);
        root.style.setProperty('--anim-ease-back', config.easing.EASE_BACK);
        
        // スケール設定
        root.style.setProperty('--anim-hover-scale', config.transforms.HOVER_SCALE);
        root.style.setProperty('--anim-image-scale', config.transforms.IMAGE_HOVER_SCALE);
        
        return this;
    },
    
    /**
     * デバッグ用ヘルパー
     */
    debug: {
        logCurrentConfig: function() {
            console.log('AnimationConfig - Current Configuration:', AnimationConfig.getCurrentConfig());
        },
        
        testAnimationSupport: function() {
            const testElement = document.createElement('div');
            const tests = {
                transform: 'transform' in testElement.style,
                transition: 'transition' in testElement.style,
                animation: 'animation' in testElement.style,
                willChange: 'willChange' in testElement.style,
            };
            console.table(tests);
            return tests;
        }
    }
};

// 初期化時にCSS変数を適用
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        AnimationConfig.applyCSSVariables();
    });
    
    // リサイズ時に再適用
    window.addEventListener('resize', () => {
        setTimeout(() => AnimationConfig.applyCSSVariables(), AnimationConfig.performance.RESIZE_DEBOUNCE);
    });
}

// グローバルに公開
if (typeof window !== 'undefined') {
    window.AnimationConfig = AnimationConfig;
}

// ES6モジュールエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationConfig;
}