/**
 * NavigationManager - ナビゲーション制御ライブラリ (最適化版)
 * BASE ECサイトテーマ用レスポンシブナビゲーション
 * 
 * @version 2.0.0 - Emergency Optimized
 * @description ハンバーガーメニュー、ロゴ位置制御、カテゴリ表示管理
 * @features モバイル対応、タッチ操作、レスポンシブロゴ制御
 */

const NavigationManager = {
    // DOM要素キャッシュ
    el: {
        hamburger: null,
        navArea: null,
        body: null,
        logo: null
    },
    
    // 状態管理
    isInit: false,
    
    /**
     * 初期化処理
     */
    init() {
        if (this.isInit) return;
        
        try {
            // DOM要素取得
            this.el.hamburger = document.querySelector('#js-humberger') || 
                               document.querySelector('button.humberger');
            this.el.navArea = document.querySelector('.js-nav-area') || 
                             document.querySelector('.nav-area');
            this.el.body = document.body;
            this.el.logo = document.querySelector('.logo');
            
            if (!this.el.hamburger || !this.el.navArea) return false;
            
            // イベント設定
            this.bindEvents();
            
            // 展開メニュー初期化
            this.initExpandMenus();
            
            // カテゴリ表示初期化
            this.initCategoryDisplay();
            
            this.isInit = true;
            return true;
            
        } catch (e) {
            console.error('NavigationManager init failed:', e);
            return false;
        }
    },
    
    /**
     * メニュー状態確認
     */
    isActive() {
        return this.el.hamburger?.classList.contains('-active') || false;
    },
    
    /**
     * メニュートグル
     */
    toggle() {
        const { hamburger, navArea, body } = this.el;
        if (!hamburger || !navArea) return;
        
        const active = this.isActive();
        const action = active ? 'remove' : 'add';
        
        hamburger.classList[action]('-active');
        navArea.classList[action]('-active');
        body.classList[action]('body-fixed');
        
        // ロゴ位置更新 (遅延実行)
        setTimeout(() => this.updateLogoPosition(), 10);
    },
    
    /**
     * メニューを閉じる
     */
    close() {
        const { hamburger, navArea, body } = this.el;
        if (!hamburger || !navArea) return;
        
        hamburger.classList.remove('-active');
        navArea.classList.remove('-active');
        body.classList.remove('body-fixed');
        
        setTimeout(() => this.updateLogoPosition(), 10);
    },
    
    /**
     * ロゴ位置制御
     */
    updateLogoPosition() {
        const { logo } = this.el;
        if (!logo) return;
        
        const isMenuOpen = this.isActive();
        const isTop = this.isHomePage();
        
        // クラスリセット
        logo.classList.remove('center-position', 'header-position', 'menu-open-position');
        
        // 状態に応じてクラス追加
        if (isMenuOpen) {
            logo.classList.add('menu-open-position');
        } else if (isTop) {
            logo.classList.add('center-position');
        } else {
            logo.classList.add('header-position');
        }
    },
    
    /**
     * ホームページ判定
     */
    isHomePage() {
        return document.body.id === 'shopTopPage' || 
               document.querySelector('.main-visual') !== null;
    },
    
    /**
     * イベントバインド
     */
    bindEvents() {
        const { hamburger, navArea } = this.el;
        
        // ハンバーガーメニュークリック
        hamburger.addEventListener('click', () => this.toggle());
        
        // メニュー外クリックで閉じる
        document.addEventListener('click', (e) => {
            if (!navArea.contains(e.target) && !hamburger.contains(e.target)) {
                this.close();
            }
        });
        
        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive()) {
                this.close();
            }
        });
    },
    
    /**
     * 展開メニュー初期化
     */
    initExpandMenus() {
        const expandLinks = document.querySelectorAll('a.expand');
        expandLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const exList = link.nextElementSibling;
                const isOpen = link.classList.contains('open');
                
                // トグル処理
                link.classList.toggle('open', !isOpen);
                if (exList) {
                    exList.style.display = isOpen ? 'none' : 'block';
                }
            });
        });
    },
    
    /**
     * カテゴリ表示制御
     */
    initCategoryDisplay() {
        const itemExpandLink = document.querySelector('a.expand[href="#"]');
        if (itemExpandLink?.textContent.trim() === 'ITEM') {
            const exList = itemExpandLink.nextElementSibling;
            if (exList) {
                const categoryItems = exList.querySelectorAll('li:not(.no-category-message)');
                const noMessage = exList.querySelector('.no-category-message');
                
                if (categoryItems.length === 0 && noMessage) {
                    noMessage.style.display = 'block';
                }
            }
        }
    },
    
    /**
     * Instagram固定ボタン制御
     */
    controlInstagramButton() {
        const instagramBtn = document.querySelector('.instagram-fixed-btn');
        if (instagramBtn) {
            document.body.classList.toggle('home-page', this.isHomePage());
        }
    }
};

// DOM要素取得ユーティリティ (軽量版)
const DOMUtils = {
    cache: {},
    
    get: (selector) => document.querySelector(selector),
    getAll: (selector) => document.querySelectorAll(selector),
    getId: (id) => document.getElementById(id),
    
    getCached(key, selector) {
        if (!this.cache[key]) {
            this.cache[key] = this.get(selector);
        }
        return this.cache[key];
    },
    
    hamburger: () => DOMUtils.getCached('hamburger', '#js-humberger'),
    navArea: () => DOMUtils.getCached('navArea', '.js-nav-area'),
    logo: () => DOMUtils.getCached('logo', '.logo'),
    body: () => document.body
};

// ページ状態管理 (軽量版)
const PageState = {
    cache: null,
    
    get() {
        if (!this.cache) {
            this.cache = {
                hasMainVisual: !!document.querySelector('.main-visual'),
                hasProductDetail: !!document.querySelector('.product-detail'),
                isShopTopPage: document.body.id === 'shopTopPage'
            };
        }
        return this.cache;
    },
    
    isHomePage() {
        return this.get().isShopTopPage || this.get().hasMainVisual;
    }
};

// グローバル公開
if (typeof window !== 'undefined') {
    window.NavigationManager = NavigationManager;
    window.DOMUtils = DOMUtils;
    window.PageState = PageState;
}

// 自動初期化
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        NavigationManager.init();
        NavigationManager.controlInstagramButton();
    });
}

// ES6モジュールエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavigationManager, DOMUtils, PageState };
}