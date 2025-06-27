/**
 * DOMUtils - DOM操作ユーティリティライブラリ
 * BASE ECサイトテーマ用汎用ライブラリ
 * 
 * @version 1.0.0
 * @description 高頻度で使用されるDOM操作を効率化
 * @features キャッシュ機能、パフォーマンス最適化、エラーハンドリング
 */

const DOMUtils = {
    // キャッシュストレージ
    cache: new Map(),
    
    /**
     * 基本的なセレクタ関数
     */
    get: (selector) => {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn(`DOMUtils.get: Invalid selector "${selector}"`, error);
            return null;
        }
    },
    
    getAll: (selector) => {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            console.warn(`DOMUtils.getAll: Invalid selector "${selector}"`, error);
            return [];
        }
    },
    
    getId: (id) => {
        try {
            return document.getElementById(id);
        } catch (error) {
            console.warn(`DOMUtils.getId: Error getting element with id "${id}"`, error);
            return null;
        }
    },
    
    /**
     * キャッシュ機能付きDOM取得
     * パフォーマンス向上のため、一度取得した要素をキャッシュ
     */
    getCached: function(key, selector) {
        if (this.cache.has(key)) {
            const element = this.cache.get(key);
            // 要素がまだDOMに存在するかチェック
            if (element && document.contains(element)) {
                return element;
            } else {
                // 無効なキャッシュを削除
                this.cache.delete(key);
            }
        }
        
        const element = this.get(selector);
        if (element) {
            this.cache.set(key, element);
        }
        return element;
    },
    
    /**
     * よく使用される要素の高速アクセス
     * BASE ECサイトテーマ特有の要素
     */
    body: () => document.body,
    
    hamburger: () => DOMUtils.getCached('hamburger', '#js-humberger'),
    
    navArea: () => DOMUtils.getCached('navArea', '.js-nav-area'),
    
    logo: () => DOMUtils.getCached('logo', '.logo'),
    
    productGrid: () => DOMUtils.getCached('productGrid', '.product-grid'),
    
    /**
     * 要素の存在確認
     */
    exists: (selector) => {
        return DOMUtils.get(selector) !== null;
    },
    
    /**
     * 複数要素の存在確認
     */
    existsAll: (selectors) => {
        return selectors.every(selector => DOMUtils.exists(selector));
    },
    
    /**
     * 安全なイベントリスナー追加
     */
    safeAddEventListener: (selector, event, handler, options = {}) => {
        const element = typeof selector === 'string' ? DOMUtils.get(selector) : selector;
        if (element) {
            element.addEventListener(event, handler, options);
            return true;
        }
        return false;
    },
    
    /**
     * 複数要素への一括イベントリスナー追加
     */
    addEventListenerAll: (selector, event, handler, options = {}) => {
        const elements = DOMUtils.getAll(selector);
        elements.forEach(element => {
            element.addEventListener(event, handler, options);
        });
        return elements.length;
    },
    
    /**
     * クラス操作ユーティリティ
     */
    addClass: (selector, className) => {
        const element = typeof selector === 'string' ? DOMUtils.get(selector) : selector;
        if (element) {
            element.classList.add(className);
            return true;
        }
        return false;
    },
    
    removeClass: (selector, className) => {
        const element = typeof selector === 'string' ? DOMUtils.get(selector) : selector;
        if (element) {
            element.classList.remove(className);
            return true;
        }
        return false;
    },
    
    toggleClass: (selector, className) => {
        const element = typeof selector === 'string' ? DOMUtils.get(selector) : selector;
        if (element) {
            element.classList.toggle(className);
            return true;
        }
        return false;
    },
    
    hasClass: (selector, className) => {
        const element = typeof selector === 'string' ? DOMUtils.get(selector) : selector;
        return element ? element.classList.contains(className) : false;
    },
    
    /**
     * スタイル操作
     */
    setStyle: (selector, property, value) => {
        const element = typeof selector === 'string' ? DOMUtils.get(selector) : selector;
        if (element) {
            element.style[property] = value;
            return true;
        }
        return false;
    },
    
    getStyle: (selector, property) => {
        const element = typeof selector === 'string' ? DOMUtils.get(selector) : selector;
        if (element) {
            return getComputedStyle(element)[property];
        }
        return null;
    },
    
    /**
     * 要素の表示/非表示制御
     */
    show: (selector) => {
        return DOMUtils.setStyle(selector, 'display', 'block');
    },
    
    hide: (selector) => {
        return DOMUtils.setStyle(selector, 'display', 'none');
    },
    
    /**
     * キャッシュ管理
     */
    clearCache: () => {
        DOMUtils.cache.clear();
    },
    
    getCacheSize: () => {
        return DOMUtils.cache.size;
    },
    
    /**
     * デバッグ用ヘルパー
     */
    debug: {
        logCache: () => {
            console.log('DOMUtils Cache:', Array.from(DOMUtils.cache.entries()));
        },
        
        validateSelectors: (selectors) => {
            const results = {};
            selectors.forEach(selector => {
                results[selector] = DOMUtils.exists(selector);
            });
            console.table(results);
            return results;
        }
    }
};

// グローバルに公開（必要に応じて）
if (typeof window !== 'undefined') {
    window.DOMUtils = DOMUtils;
}

// ES6モジュールとしてもエクスポート（将来的な使用のため）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DOMUtils;
}