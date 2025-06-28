/**
 * AnimationConfig - 最適化されたアニメーション設定ライブラリ
 * BASE ECサイトテーマ用統一アニメーション設定（緊急最適化版）
 * 
 * @version 2.0.0
 * @description 全体のアニメーション動作を統一管理（CDN最適化）
 * @features 設定値の一元管理、レスポンシブ対応、パフォーマンス最適化
 */

const AnimationConfig = {
    // 基本タイミング設定（最適化）
    timing: {
        FADE_DELAY: 2000,
        FADE_DURATION: 1500,
        STAGGER_DELAY: 0.1,
        STAGGER_BASE: 100,
        HOVER_DURATION: 300,
        CLICK_FEEDBACK: 150,
        SCROLL_THROTTLE: 16,
        INTERSECTION_THRESHOLD: 0.1,
        PAGE_TRANSITION: 500,
        LOADING_MIN: 800,
        SCROLL_THRESHOLD: 100,
        TRANSITION_DURATION: '0.8s'
    },
    
    // イージング設定（圧縮）
    easing: {
        EASE_OUT: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        EASE_IN_OUT: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        EASE_BACK: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        PRODUCT_HOVER: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        PRODUCT_SCALE: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        NAV_SLIDE: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        MODAL_APPEAR: 'cubic-bezier(0.175, 0.885, 0.32, 1)'
    },
    
    // スケール・変形設定
    transforms: {
        HOVER_SCALE: 1.02,
        IMAGE_HOVER_SCALE: 1.05,
        INITIAL_Y: 50,
        INITIAL_SCALE: 0.95,
        PERSPECTIVE: 1000,
        ROTATE_X: 5
    },
    
    // レスポンシブ対応設定（簡略化）
    responsive: {
        MOBILE_BREAKPOINT: 768,
        TABLET_BREAKPOINT: 1024,
        mobile: {
            STAGGER_DELAY: 0.05,
            FADE_DURATION: 1000,
            HOVER_SCALE: 1.01
        },
        tablet: {
            STAGGER_DELAY: 0.08,
            FADE_DURATION: 1200,
            HOVER_SCALE: 1.015
        }
    },
    
    // IntersectionObserver設定
    intersection: {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: '-50px 0px -50px 0px',
        productGrid: {
            threshold: 0.1,
            rootMargin: '-100px 0px -100px 0px'
        },
        hero: {
            threshold: 0.5,
            rootMargin: '0px'
        },
        related: {
            threshold: 0.2,
            rootMargin: '-50px 0px'
        }
    },
    
    // CSS Animation Classes
    classes: {
        LOADING: 'loading',
        LOADED: 'loaded',
        VISIBLE: 'visible',
        HIDDEN: 'hidden',
        FADE_IN: 'fade-in',
        FADE_OUT: 'fade-out',
        SLIDE_UP: 'slide-up',
        SLIDE_DOWN: 'slide-down',
        SCALE_IN: 'scale-in',
        HOVERING: 'hovering',
        ACTIVE: 'active',
        DISABLED: 'disabled',
        PRODUCT_LOADED: 'product-loaded',
        IMAGE_LOADED: 'image-loaded',
        OUT_OF_STOCK: 'out-of-stock'
    },
    
    // パフォーマンス設定（最適化）
    performance: {
        WILL_CHANGE: true,
        TRANSFORM3D: true,
        PASSIVE_LISTENERS: true,
        SCROLL_THROTTLE: 16,
        RESIZE_DEBOUNCE: 250,
        CRITICAL_ANIMATIONS: ['fade-in', 'product-loaded'],
        DEFERRED_ANIMATIONS: ['related-products', 'scroll-effects']
    },
    
    // 現在のデバイス環境に応じた設定を取得（最適化）
    getCurrentConfig() {
        const width = window.innerWidth;
        if (width <= this.responsive.MOBILE_BREAKPOINT) {
            return {...this, ...this.responsive.mobile};
        } else if (width <= this.responsive.TABLET_BREAKPOINT) {
            return {...this, ...this.responsive.tablet};
        }
        return this;
    },
    
    // パフォーマンス設定の動的調整（簡略化）
    adjustForPerformance() {
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
                    FADE_DURATION: this.timing.FADE_DURATION * 0.7
                },
                performance: {
                    ...this.performance,
                    WILL_CHANGE: false,
                    TRANSFORM3D: false
                }
            };
        }
        return this;
    },
    
    // CSS変数への設定値適用（簡略化）
    applyCSSVariables() {
        const root = document.documentElement;
        const config = this.getCurrentConfig();
        
        root.style.setProperty('--anim-fade-delay', `${config.timing.FADE_DELAY}ms`);
        root.style.setProperty('--anim-fade-duration', `${config.timing.FADE_DURATION}ms`);
        root.style.setProperty('--anim-stagger-delay', `${config.timing.STAGGER_DELAY}s`);
        root.style.setProperty('--anim-hover-duration', `${config.timing.HOVER_DURATION}ms`);
        root.style.setProperty('--anim-ease-out', config.easing.EASE_OUT);
        root.style.setProperty('--anim-ease-back', config.easing.EASE_BACK);
        root.style.setProperty('--anim-hover-scale', config.transforms.HOVER_SCALE);
        root.style.setProperty('--anim-image-scale', config.transforms.IMAGE_HOVER_SCALE);
        
        return this;
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