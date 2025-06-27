# BASE専用ECサイトテーマ開発ノウハウ

## 目次
1. [BASE開発環境の理解](#base開発環境の理解)
2. [BASEテンプレートタグ完全ガイド](#baseテンプレートタグ完全ガイド)
3. [BASE初期テンプレート活用戦略](#base初期テンプレート活用戦略)
4. [単一HTMLファイル開発の制約と対策](#単一htmlファイル開発の制約と対策)
5. [CSS変数システムによる保守性向上](#css変数システムによる保守性向上)
6. [JavaScriptモジュール化のベストプラクティス](#javascriptモジュール化のベストプラクティス)
7. [レスポンシブ対応の必須ポイント](#レスポンシブ対応の必須ポイント)
8. [BASE仕様準拠チェックリスト](#base仕様準拠チェックリスト)
9. [よくあるトラブルと解決法](#よくあるトラブルと解決法)
10. [開発効率化のTips](#開発効率化のtips)
11. [顧客納品時の注意点](#顧客納品時の注意点)

---

## BASE開発環境の理解

### 🏗️ 開発環境の特殊性

#### 1. **単一HTMLファイル構成**
```html
<!-- 全てを1つのHTMLファイルに記述 -->
<!DOCTYPE html>
<html>
<head>
    <!-- CSS: <style>タグ内に全て記述 -->
    <style>
        /* 全CSSをここに */
    </style>
</head>
<body>
    <!-- HTML: BASEテンプレートタグを含む -->
    <!-- JavaScript: <script>タグ内に全て記述 -->
    <script>
        // 全JavaScriptをここに
    </script>
</body>
</html>
```

#### 2. **外部ファイル参照の制約**
- ❌ **使用不可**: 外部CSS/JSファイル
- ❌ **使用不可**: npm、webpack等のビルドツール
- ❌ **使用不可**: TypeScript、SCSS等のコンパイル言語
- ✅ **使用可能**: CDN経由のライブラリ（Google Fonts等）
- ✅ **使用可能**: インラインCSS/JavaScript
- ✅ **使用可能**: data URI形式の画像

#### 3. **BASE管理画面での制約**
- テーマエディタでの編集は1ファイル完結
- プレビュー機能はBASE環境でのみ動作
- デバッグはブラウザの開発者ツールが頼り

---

## BASEテンプレートタグ完全ガイド

### 📋 必須理解事項

#### 1. **ページ判定タグ（最重要）**
```html
<!-- ページ種別の判定 -->
{block:IndexPage}
    <!-- ショップTOPページ -->
{/block:IndexPage}

{block:ItemPage}
    <!-- 商品詳細ページ -->
{/block:ItemPage}

{block:AboutPage}
    <!-- Aboutページ -->
{/block:AboutPage}

{block:ContactPage}
    <!-- お問い合わせページ -->
{/block:ContactPage}

{block:LawPage}
    <!-- 特定商取引法ページ -->
{/block:LawPage}

{block:PrivacyPage}
    <!-- プライバシーポリシーページ -->
{/block:PrivacyPage}
```

#### 2. **商品関連タグ（ECサイトの核心）**

##### 🛍️ **商品一覧表示の正しい実装**
```html
<!-- 商品の存在チェック -->
{block:HasItems}
  {block:Items}
  <div class="product-item">
    <a href="{ItemPageURL}">
      <!-- 商品ラベル（セール、新着等） -->
      {block:AppsItemLabel}
        {AppsItemLabelTag}
      {/block:AppsItemLabel}
      
      <!-- 商品画像（正しい取得方法） -->
      <img src="{block:ItemImage1}{ItemImage1URL-300}{/block:ItemImage1}{block:NoItemImage1}{ItemNoImageURL}{/block:NoItemImage1}" alt="{ItemTitle}" title="{ItemTitle}">
      
      <!-- 在庫切れ表示 -->
      {block:ItemNowOnSale}{block:NoItemStock}
        <div class="soldout_cover"><p>SOLD OUT</p></div>
      {/block:NoItemStock}{/block:ItemNowOnSale}
      {block:ItemEndOfSale}
        <div class="soldout_cover"><p>SOLD OUT</p></div>
      {/block:ItemEndOfSale}
      
      <!-- 商品情報 -->
      <h3>{ItemTitle}</h3>
      
      <!-- 価格表示（定価・割引価格の条件分岐） -->
      {block:NoItemProperPrice}
        <p class="price">{ItemPrice}</p>
      {/block:NoItemProperPrice}
      {block:HasItemProperPrice}
        <div class="price-discount">
          <span class="price-original">{ItemProperPrice}</span>
          <span class="price-sale">{ItemPrice}</span>
          <span class="discount-rate">{ItemDiscountRate}</span>
        </div>
      {/block:HasItemProperPrice}
    </a>
  </div>
  {/block:Items}
{/block:HasItems}

<!-- 商品がない場合 -->
{block:NoItems}
  <div class="no-items-message">
    <p>商品が見つかりませんでした。</p>
  </div>
{/block:NoItems}
```

##### 📱 **商品詳細ページの正しい実装**
```html
{block:ItemPage}
{IllegalReportMessageTag} <!-- 違法報告メッセージ（必須） -->
<section class="product-detail">
  <div class="product-image">
    {block:AppsItemLabel}
      {AppsItemLabelTag}
    {/block:AppsItemLabel}
    <img src="{block:ItemImage1}{ItemImage1URL-500}{/block:ItemImage1}{block:NoItemImage1}{ItemNoImageURL}{/block:NoItemImage1}" alt="{ItemTitle}" title="{ItemTitle}">
    
    <!-- 複数画像対応（2-20枚目） -->
    {block:ItemImageCount}
      <div class="thumbnail-images">
        {block:ItemImage1}<img src="{ItemImage1URL-146}" onclick="changeMainImage('{ItemImage1URL-640}')">{/block:ItemImage1}
        {block:ItemImage2}<img src="{ItemImage2URL-146}" onclick="changeMainImage('{ItemImage2URL-640}')">{/block:ItemImage2}
        {block:ItemImage3}<img src="{ItemImage3URL-146}" onclick="changeMainImage('{ItemImage3URL-640}')">{/block:ItemImage3}
        <!-- ItemImage4〜ItemImage20まで対応可能 -->
      </div>
    {/block:ItemImageCount}
  </div>
  
  <div class="product-info">
    <h1>{ItemTitle}</h1>
    
    <!-- 価格表示 -->
    {block:NoItemProperPrice}
      <p class="price">{ItemPrice}</p>
    {/block:NoItemProperPrice}
    {block:HasItemProperPrice}
      <div class="price-discount">
        <span class="price-original">{ItemProperPrice}</span>
        <span class="price-sale">{ItemPrice}</span>
        <span class="discount-rate">{ItemDiscountRate}</span>
      </div>
    {/block:HasItemProperPrice}
    
    <div class="description">{ItemDetail}</div>
    
    <!-- 購入フォーム（正しい実装） -->
    {block:PurchaseForm}
      {ItemSelectTag} <!-- バリエーション選択 -->
      {block:HasItemStock}
        {PurchaseButton} <!-- BASEの購入ボタン -->
      {/block:HasItemStock}
      {block:NoItemStock}
        <a href="{ContactPageURL}/items/{ItemId}" class="contact-button">お問い合わせ</a>
      {/block:NoItemStock}
    {/block:PurchaseForm}
    
    <!-- 必須要素 -->
    <div class="item-attention">{ItemAttentionTag}</div>
    <div class="illegal-report">{IllegalReportTag}</div>
  </div>
</section>
{/block:ItemPage}
```

##### 🔍 **重要なタグ変更点**
| ❌ 間違い | ✅ 正しい |
|----------|----------|
| `{ItemImageURL}` | `{block:ItemImage1}{ItemImage1URL-300}{/block:ItemImage1}` |
| `{ItemName}` | `{ItemTitle}` |
| `{ItemPrice}` | 条件分岐で`{ItemPrice}`を使用 |

#### 3. **必須タグ（BASEが要求）**

##### 🚨 **システム動作に必要な必須タグ**

```html
<!-- HEAD内必須タグ -->
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    {FaviconTag}         <!-- ファビコン・ホームアイコン -->
    {BackgroundTag}      <!-- バックグラウンド設定 -->
    {GoogleAnalyticsTag} <!-- Google Analytics (独自GA禁止) -->
    {MetaTag}
</head>

<!-- BODY内必須タグ -->
<body>
    <!-- BASEメニュー（絶対必須） -->
    {BASEMenuTag}
    
    <!-- ロゴ（必須） -->
    {LogoTag}
    
    <!-- ページコンテンツ（必須） -->
    {PageContents}
    
    <!-- 各ページURL（必須） -->
    <a href="{ContactPageURL}">お問い合わせ</a>
    <a href="{PrivacyPageURL}">プライバシーポリシー</a>
    <a href="{LawPageURL}">特定商取引法</a>
    
    <!-- 商品詳細ページの必須要素 -->
    {block:ItemPage}
        {IllegalReportMessageTag} <!-- 違法報告メッセージ -->
        {PurchaseButton}          <!-- 購入ボタン -->
        {SocialButtonTag}         <!-- ソーシャルボタン -->
        {ItemAttentionTag}        <!-- 商品注意文 -->
        {IllegalReportTag}        <!-- 違法報告ボタン -->
    {/block:ItemPage}
    
    <!-- 各ページ専用必須タグ -->
    {block:ContactPage}
        {ContactContentsTag}      <!-- お問い合わせページ内容 -->
    {/block:ContactPage}
    {block:PrivacyPage}
        {PrivacyContentsTag}      <!-- プライバシーポリシー内容 -->
    {/block:PrivacyPage}
    {block:LawPage}
        {LawContentsTag}          <!-- 特定商取引法内容 -->
    {/block:LawPage}
</body>
```

##### ⚠️ **注意事項**
- **{JQueryTag}**: 非推奨（2022.03〜）CDN利用推奨
- **{GoogleAnalyticsTag}**: 独自のGAタグを追加で貼ることは禁止
- **{ContactContentsTag}**: 非推奨（2022.03〜）`{PageContents}`に統合

#### 4. **BASE App対応（重要）**
```html
<!-- 各種App対応（HEAD内） -->
{block:AppsSearch}
    <link rel="stylesheet" type="text/css" href="{BASEURL}/search/css/style.css?{UpdateTime}">
{/block:AppsSearch}

{block:AppsCategory}
    <link rel="stylesheet" type="text/css" href="{BASEURL}/categories/css/style.css?{UpdateTime}">
{/block:AppsCategory}

<!-- App機能使用（BODY内） -->
{block:AppsSearch}
    {AppsSearchTag}
{/block:AppsSearch}

{block:AppsCategory}
    {AppsCategoryTag}
{/block:AppsCategory}
```

#### 5. **Ajax読み込み機能（重要機能）**

##### 📄 **ページ構造の分離**
```html
{block:NotLoadItemsPage}
<!DOCTYPE html>
<html>
<!-- メインのHTMLコンテンツ -->
</html>
{/block:NotLoadItemsPage}

{block:LoadItemsPage}
<!-- Ajax読み込み用の商品HTMLのみ -->
{block:Items}
<div class="product-item">
    <!-- 商品HTML -->
</div>
{/block:Items}
{/block:LoadItemsPage}
```

##### ⚡ **Ajax読み込みJavaScript（IE11対応）**
```javascript
// BASEの正しいAjax読み込み方法
var process_flg = false;
var end_flg = false;

function loadMoreItems() {
    if (process_flg === false && end_flg === false) {
        var maxPage = document.getElementById('max_page');
        var nextPage = document.getElementById('next_page');
        
        if (maxPage && nextPage) {
            var maxPageNum = parseInt(maxPage.textContent);
            var nextPageNum = parseInt(nextPage.textContent);
            
            if (maxPageNum >= nextPageNum) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', '{LoadItemsPageURL}' + nextPageNum + '{LoadItemsPageURLParams}', true);
                
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        var productGrid = document.getElementById('product-grid');
                        if (productGrid) {
                            productGrid.insertAdjacentHTML('beforeend', xhr.responseText);
                            nextPage.textContent = nextPageNum + 1;
                        }
                        process_flg = false;
                    }
                };
                
                process_flg = true;
                xhr.send();
            } else {
                end_flg = true;
            }
        }
    }
}

// 隠しフィールドの設置
// <input type="hidden" id="max_page" value="{MaxPage}">
// <input type="hidden" id="next_page" value="{NextPage}">
```

### ⚠️ BASEタグ使用時の注意点

1. **タグの記述ルール**
   - 大文字小文字を正確に
   - ブロックタグは必ず閉じる
   - ネストする場合は正しい順序で

2. **条件分岐の優先順位**
   ```html
   <!-- 正しい順序 -->
   {block:HasItemStock}
       {block:ItemNowOnSale}
           {PurchaseButton}
       {/block:ItemNowOnSale}
   {/block:HasItemStock}
   ```

3. **画像URLの使い分け**
   ```html
   <!-- サイズ別URL -->
   {ItemImage1URL-76}     <!-- 76px -->
   {ItemImage1URL-146}    <!-- 146px -->
   {ItemImage1URL-300}    <!-- 300px -->
   {ItemImage1URL-640}    <!-- 640px（推奨） -->
   {ItemImage1URL-1280}   <!-- 1280px -->
   {ItemImage1URL-origin} <!-- オリジナル（重い） -->
   ```

### 🚨 BASE開発環境の制約と対策

#### 1. **HTML編集Appの制限**
- **1ファイル統合**: HTML、CSS、JSは全て1つのファイル内に記述
- **外部ファイル参照不可**: 別ファイルのCSS・JSは読み込めない
- **ページ制御**: 条件分岐ではなくブロックタグで制御
- **最大文字数**: 15,000文字制限

#### 2. **編集可能ページ（3ページのみ）**
| ページ | ブロックタグ | 編集権限 |
|--------|-------------|----------|
| トップページ | `{block:IndexPage}` | HTML + CSS |
| 商品詳細ページ | `{block:ItemPage}` | HTML + CSS |
| Aboutページ | `{block:AboutPage}` | HTML + CSS |

#### 3. **CSS専用ページ（4ページ）**
| ページ | ブロックタグ | 編集権限 |
|--------|-------------|----------|
| 特定商取引法ページ | `{block:LawPage}` | CSS のみ |
| ブログページ | `{block:BlogPage}` | CSS のみ |
| お問い合わせページ | `{block:ContactPage}` | CSS のみ |
| プライバシーポリシー | `{block:PrivacyPage}` | CSS のみ |

#### 4. **ブラウザ対応要件**
- **IE11完全対応**: 必須要件（2024年現在も）
- **Flexbox**: `-ms-`プレフィックス必須
- **Grid**: IE11用代替レイアウト実装
- **object-fit**: polyfill対応

#### 5. **パフォーマンス要件**
- **読み込み速度**: 画像最適化、WebP対応、適切なサイズ
- **CSS最適化**: 不要なスタイルの削除
- **JS最適化**: 必要最小限の実装
- **モバイル対応**: タッチ操作、十分なタップエリア、3G回線でも快適

### 💡 重要な心構え

**「ドキュメントを読むだけでは審査は通らない」**

BASEの審査は極めて厳格で、商用レベルの完成度が求められます。
複数回の却下と修正を前提とした長期プロジェクトとして取り組むことが成功の鍵です。

**「BASE基礎.htmlから学ぶことが最重要」**

公式のテンプレートファイルを詳細に分析し、正しいタグの使い方、Ajax実装、ページ構造を学ぶことが審査通過への近道です。

---

## BASE初期テンプレート活用戦略

### 🎯 **最重要**: 初期テンプレートファイルの準備

BASE開発で最も効率的かつ確実な進め方は、**BASE仕様完全準拠の初期テンプレートファイルを事前に用意し、そこに顧客要求のHTMLを組み込んでいく**というアプローチです。

#### 1. **なぜ初期テンプレートが重要なのか**

##### ❌ **従来の失敗パターン**
```
顧客のHTML → BASE仕様に合わせて修正 → BASEタグ追加 → 動作確認 → 仕様違反発覚 → 修正...
```
- 手戻りが多い
- BASE仕様の理解不足でエラー頻発
- 開発時間の大幅な延長

##### ✅ **成功パターン（初期テンプレート活用）**
```
BASE初期テンプレート → 顧客HTMLの要素を組み込み → 微調整 → 完成
```
- BASE仕様は既に満たしている
- 最初から動作する状態
- 開発時間の大幅短縮

### 📁 BASE初期テンプレートの構成

#### 1. **完全準拠BASE基本テンプレート**
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;700&display=swap" rel="stylesheet">
    {MetaTag}
    
    <!-- BASE App CSS（必要に応じて） -->
    {block:AppsSearch}
        <link rel="stylesheet" type="text/css" href="{BASEURL}/search/css/style.css?{UpdateTime}">
    {/block:AppsSearch}
    {block:AppsCategory}
        <link rel="stylesheet" type="text/css" href="{BASEURL}/categories/css/style.css?{UpdateTime}">
    {/block:AppsCategory}
    {block:AppsReview}
        <link rel="stylesheet" type="text/css" href="{BASEURL}/review/css/style.css?{UpdateTime}">
    {/block:AppsReview}

    <style>
        /* ==========================================================================
           CSS変数定義（カスタマイズポイント）
           ========================================================================== */
        :root {
            /* カラーパレット */
            --primary-bg: #FFFFFF;
            --secondary-bg: #F8F8F8;
            --accent-color: #007ACC;
            --primary-text: #333333;
            --secondary-text: #666666;
            --muted-text: #999999;
            --border-color: #E0E0E0;
            --error-color: #E74C3C;
            
            /* フォント */
            --font-family: 'Noto Sans', Arial, sans-serif;
            --font-xs: 0.875rem;
            --font-sm: 1rem;
            --font-md: 1.125rem;
            --font-lg: 1.25rem;
            --font-xl: 1.5rem;
            --weight-light: 300;
            --weight-normal: 400;
            --weight-medium: 500;
            --weight-bold: 700;
            
            /* スペーシング */
            --space-xs: 0.5rem;
            --space-sm: 1rem;
            --space-md: 1.5rem;
            --space-lg: 2rem;
            --space-xl: 3rem;
            
            /* トランジション */
            --transition-fast: 0.2s ease;
            --transition-normal: 0.3s ease;
            
            /* z-index管理 */
            --z-header: 1000;
            --z-navigation: 1001;
            --z-modal: 1002;
        }

        /* ==========================================================================
           リセット・ベーススタイル
           ========================================================================== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-family);
            font-size: var(--font-sm);
            font-weight: var(--weight-normal);
            line-height: 1.6;
            color: var(--primary-text);
            background-color: var(--primary-bg);
        }

        a {
            color: inherit;
            text-decoration: none;
        }

        img {
            max-width: 100%;
            height: auto;
        }

        /* ==========================================================================
           レイアウト・ヘッダー
           ========================================================================== */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 var(--space-lg);
        }

        /* BASEメニューコンテナ */
        .base-menu-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: var(--z-header);
        }

        /* ロゴ */
        .logo {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: var(--z-header);
            font-size: var(--font-lg);
            font-weight: var(--weight-bold);
        }

        /* ハンバーガーメニュー */
        .hamburger {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: var(--z-header);
            width: 40px;
            height: 40px;
            background: transparent;
            border: none;
            cursor: pointer;
        }

        /* ナビゲーション */
        .navigation {
            position: fixed;
            top: 0;
            left: -100%;
            width: 300px;
            height: 100vh;
            background-color: var(--secondary-bg);
            z-index: var(--z-navigation);
            transition: left var(--transition-normal);
            padding: var(--space-xl) var(--space-lg);
        }

        .navigation.active {
            left: 0;
        }

        /* ==========================================================================
           メインコンテンツエリア
           ========================================================================== */
        .main-content {
            margin-top: 80px;
            padding: var(--space-lg);
        }

        /* 商品グリッド */
        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: var(--space-lg);
            margin: var(--space-xl) 0;
        }

        .product-item {
            background-color: var(--secondary-bg);
            border-radius: 8px;
            overflow: hidden;
            transition: transform var(--transition-fast);
        }

        .product-item:hover {
            transform: translateY(-5px);
        }

        .product-image {
            position: relative;
            aspect-ratio: 1;
            overflow: hidden;
        }

        .product-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .product-info {
            padding: var(--space-md);
        }

        .product-title {
            font-size: var(--font-md);
            font-weight: var(--weight-medium);
            margin-bottom: var(--space-xs);
        }

        .product-price {
            font-size: var(--font-sm);
            color: var(--accent-color);
            font-weight: var(--weight-bold);
        }

        /* ==========================================================================
           商品詳細ページ
           ========================================================================== */
        .product-detail {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-xl);
            margin: var(--space-xl) 0;
        }

        .product-detail-image img {
            width: 100%;
            height: auto;
        }

        .product-detail-info {
            padding: var(--space-lg);
        }

        .product-detail-title {
            font-size: var(--font-xl);
            font-weight: var(--weight-bold);
            margin-bottom: var(--space-md);
        }

        .product-detail-price {
            font-size: var(--font-lg);
            color: var(--accent-color);
            font-weight: var(--weight-bold);
            margin-bottom: var(--space-lg);
        }

        .purchase-button {
            width: 100%;
            padding: var(--space-md) var(--space-lg);
            background-color: var(--accent-color);
            color: white;
            border: none;
            border-radius: 4px;
            font-size: var(--font-md);
            font-weight: var(--weight-medium);
            cursor: pointer;
            transition: background-color var(--transition-fast);
        }

        .purchase-button:hover {
            background-color: #005A9E;
        }

        /* ==========================================================================
           レスポンシブ対応
           ========================================================================== */
        @media (max-width: 768px) {
            .container {
                padding: 0 var(--space-md);
            }

            .product-grid {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: var(--space-md);
            }

            .product-detail {
                grid-template-columns: 1fr;
                gap: var(--space-lg);
            }

            .main-content {
                margin-top: 60px;
                padding: var(--space-md);
            }
        }

        /* ==========================================================================
           ユーティリティクラス
           ========================================================================== */
        .text-center { text-align: center; }
        .mb-sm { margin-bottom: var(--space-sm); }
        .mb-md { margin-bottom: var(--space-md); }
        .mb-lg { margin-bottom: var(--space-lg); }
        .hidden { display: none; }
        .loading { opacity: 0; }
        .loaded { opacity: 1; }
    </style>
</head>

<body id="{block:IndexPage}shopTopPage{/block:IndexPage}{block:ItemPage}shopDetailPage{/block:ItemPage}" class="loading">
    <!-- BASE情報バナー（App使用時） -->
    {block:AppsInformationBanner}
        {AppsInformationBannerTag}
    {/block:AppsInformationBanner}

    <!-- BASE多言語対応（App使用時） -->
    {block:AppsI18n}
        {AppsI18nTag}
    {/block:AppsI18n}

    <!-- BASEメニュー（必須） -->
    <div class="base-menu-container">
        {BASEMenuTag}
    </div>

    <!-- ハンバーガーメニュー -->
    <button class="hamburger" id="hamburger">
        <span></span>
        <span></span>
        <span></span>
    </button>

    <!-- ロゴ（必須） -->
    <div class="logo">
        <a href="{IndexPageURL}">{LogoTag}</a>
    </div>

    <!-- ナビゲーション -->
    <nav class="navigation" id="navigation">
        <!-- 検索フォーム（App使用時） -->
        {block:AppsSearch}
            {AppsSearchTag}
        {/block:AppsSearch}

        <!-- カテゴリメニュー（App使用時） -->
        {block:AppsCategory}
            {AppsCategoryTag}
        {/block:AppsCategory}

        <!-- 基本メニュー -->
        <ul class="nav-menu">
            <li><a href="{IndexPageURL}">HOME</a></li>
            <li><a href="{AboutPageURL}">ABOUT</a></li>
            <li><a href="{ContactPageURL}">CONTACT</a></li>
        </ul>
    </nav>

    <!-- メインコンテンツ -->
    <main class="main-content">
        <!-- ショップTOPページ -->
        {block:IndexPage}
            <div class="container">
                <h1 class="text-center mb-lg">Welcome to Our Shop</h1>
                
                <!-- 商品一覧 -->
                {block:HasItems}
                    <div class="product-grid">
                        {block:Items}
                            <div class="product-item">
                                <a href="{ItemPageURL}">
                                    <!-- ラベルApp（使用時） -->
                                    {block:AppsItemLabel}
                                        {AppsItemLabelTag}
                                    {/block:AppsItemLabel}
                                    
                                    <div class="product-image">
                                        <img src="{block:ItemImage1}{ItemImage1URL-500}{/block:ItemImage1}{block:NoItemImage1}{ItemNoImageURL}{/block:NoItemImage1}" 
                                             alt="{ItemTitle}">
                                        
                                        <!-- 売り切れ表示 -->
                                        {block:NoItemStock}
                                            <div class="sold-out-overlay">SOLD OUT</div>
                                        {/block:NoItemStock}
                                    </div>
                                    
                                    <div class="product-info">
                                        <h3 class="product-title">{ItemTitle}</h3>
                                        <div class="product-price">
                                            {block:NoItemProperPrice}
                                                {ItemPrice}
                                            {/block:NoItemProperPrice}
                                            {block:HasItemProperPrice}
                                                <span class="original-price">{ItemProperPrice}</span>
                                                <span class="sale-price">{ItemPrice}</span>
                                            {/block:HasItemProperPrice}
                                        </div>
                                    </div>
                                </a>
                            </div>
                        {/block:Items}
                    </div>
                {/block:HasItems}
                
                {block:NoItems}
                    <p class="text-center">商品がありません</p>
                {/block:NoItems}
            </div>
        {/block:IndexPage}

        <!-- 商品詳細ページ -->
        {block:ItemPage}
            <!-- 違法報告メッセージ（必須） -->
            {IllegalReportMessageTag}
            
            <div class="container">
                <div class="product-detail">
                    <div class="product-detail-image">
                        <!-- ラベルApp（使用時） -->
                        {block:AppsItemLabel}
                            {AppsItemLabelTag}
                        {/block:AppsItemLabel}
                        
                        <img src="{block:ItemImage1}{ItemImage1URL-640}{/block:ItemImage1}{block:NoItemImage1}{ItemNoImageURL}{/block:NoItemImage1}" 
                             alt="{ItemTitle}">
                    </div>
                    
                    <div class="product-detail-info">
                        <h1 class="product-detail-title">{ItemTitle}</h1>
                        
                        <div class="product-detail-price">
                            {block:NoItemProperPrice}
                                {ItemPrice}
                            {/block:NoItemProperPrice}
                            {block:HasItemProperPrice}
                                <span class="original-price">{ItemProperPrice}</span>
                                <span class="sale-price">{ItemPrice}</span>
                                <span class="discount-rate">{ItemDiscountRate}</span>
                            {/block:HasItemProperPrice}
                        </div>
                        
                        <div class="product-description mb-lg">
                            {ItemDetail}
                        </div>
                        
                        <!-- 購入フォーム（必須） -->
                        {block:PurchaseForm}
                            <div class="purchase-form">
                                {ItemSelectTag}
                                
                                {block:HasItemStock}
                                    {block:ItemNowOnSale}
                                        {PurchaseButton}
                                    {/block:ItemNowOnSale}
                                    {block:ItemWaitingForSale}
                                        <p>販売開始までお待ちください</p>
                                    {/block:ItemWaitingForSale}
                                {/block:HasItemStock}
                                
                                {block:NoItemStock}
                                    <p>申し訳ございません。現在売り切れです。</p>
                                {/block:NoItemStock}
                            </div>
                        {/block:PurchaseForm}
                        
                        <!-- ソーシャルボタン（必須） -->
                        <div class="social-buttons">
                            {SocialButtonTag}
                        </div>
                        
                        <!-- 商品注意事項（必須） -->
                        <div class="item-attention">
                            {ItemAttentionTag}
                        </div>
                        
                        <!-- 違法報告（必須） -->
                        <div class="illegal-report">
                            {IllegalReportTag}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- レビューApp（使用時） -->
            {block:AppsReview}
                {AppsReviewTag}
            {/block:AppsReview}
        {/block:ItemPage}

        <!-- Aboutページ -->
        {block:AboutPage}
            <div class="container">
                <h1 class="text-center mb-lg">About Us</h1>
                {PageContents}
            </div>
        {/block:AboutPage}

        <!-- お問い合わせページ -->
        {block:ContactPage}
            <div class="container">
                <h1 class="text-center mb-lg">Contact</h1>
                {PageContents}
            </div>
        {/block:ContactPage}

        <!-- 特定商取引法ページ -->
        {block:LawPage}
            <div class="container">
                <h1 class="text-center mb-lg">特定商取引法に基づく表記</h1>
                {PageContents}
            </div>
        {/block:LawPage}

        <!-- プライバシーポリシーページ -->
        {block:PrivacyPage}
            <div class="container">
                <h1 class="text-center mb-lg">プライバシーポリシー</h1>
                {PageContents}
            </div>
        {/block:PrivacyPage}
    </main>

    <!-- フッター -->
    <footer class="footer">
        <div class="container">
            <nav class="footer-nav">
                <a href="{PrivacyPageURL}">プライバシーポリシー</a>
                <a href="{LawPageURL}">特定商取引法に基づく表記</a>
                <a href="{ContactPageURL}">お問い合わせ</a>
            </nav>
            <p class="copyright">&copy; {ShopName} All rights reserved.</p>
        </div>
    </footer>

    <script>
        /* ==========================================================================
           JavaScript - 基本機能
           ========================================================================== */
        
        // DOM操作ユーティリティ
        const DOM = {
            get: (selector) => document.querySelector(selector),
            getAll: (selector) => document.querySelectorAll(selector)
        };

        // ナビゲーション制御
        const Navigation = {
            init() {
                const hamburger = DOM.get('#hamburger');
                const navigation = DOM.get('#navigation');
                
                if (hamburger && navigation) {
                    hamburger.addEventListener('click', () => {
                        navigation.classList.toggle('active');
                    });
                }
            }
        };

        // 初期化
        document.addEventListener('DOMContentLoaded', function() {
            document.body.classList.add('loaded');
            Navigation.init();
        });
    </script>
</body>
</html>
```

### 🔄 **開発フロー**: 初期テンプレート → カスタマイズ

#### **Step 1: 初期テンプレートの準備**
```bash
# プロジェクト開始時
1. 上記の初期テンプレートをコピー
2. プロジェクト名でファイル保存（例: 顧客名_base_theme.html）
3. 動作確認（BASE管理画面で最初にアップロード確認）
```

#### **Step 2: 顧客要求の分析と設計**
```markdown
# 顧客要求の整理
## デザイン要素
- カラーテーマ: #D43883（ピンク）
- フォント: Noto Sans
- レイアウト: ミニマル、モダン

## 機能要求
- 商品画像ギャラリー
- Instagram連携ボタン
- アニメーション効果

## ページ構成
- TOP: 商品一覧のみ
- 商品詳細: 複数画像対応
- About: SNSリンク
```

#### **Step 3: CSS変数によるデザイン適用**
```css
/* 初期テンプレートのCSS変数を顧客仕様に変更 */
:root {
    /* 顧客カラーテーマに変更 */
    --primary-bg: #0B101D;          /* 黒背景 */
    --accent-color: #D43883;        /* ピンク */
    --primary-text: #FFFFFF;        /* 白文字 */
    
    /* 顧客フォント指定 */
    --font-family: 'Noto Sans', Arial, sans-serif;
    
    /* その他調整 */
    --font-base: 1.2rem;           /* フォントサイズ調整 */
    --weight-light: 300;           /* フォントウェイト調整 */
}
```

#### **Step 4: HTML構造の段階的カスタマイズ**
```html
<!-- 既存の商品一覧部分を顧客仕様に変更 -->
{block:HasItems}
    <div class="product-grid">
        {block:Items}
            <div class="product-item{block:NoItemStock} out-of-stock{/block:NoItemStock}">
                <a href="{ItemPageURL}">
                    <!-- 顧客要求: ラベル追加 -->
                    {block:AppsItemLabel}
                        {AppsItemLabelTag}
                    {/block:AppsItemLabel}
                    
                    <div class="product-image">
                        <!-- 既存の画像表示は維持 -->
                        <img src="{block:ItemImage1}{ItemImage1URL-500}{/block:ItemImage1}{block:NoItemImage1}{ItemNoImageURL}{/block:NoItemImage1}" 
                             alt="{ItemTitle}">
                        
                        <!-- 顧客要求: 売り切れ表示を英語化 -->
                        {block:NoItemStock}
                            <div class="soldout_cover"><p>Out of stock</p></div>
                        {/block:NoItemStock}
                    </div>
                    
                    <!-- 商品情報は非表示（顧客要求） -->
                    <div class="product-info" style="display: none;">
                        <h3 class="product-title">{ItemTitle}</h3>
                        <div class="product-price">{ItemPrice}</div>
                    </div>
                </a>
            </div>
        {/block:Items}
    </div>
{/block:HasItems}
```

#### **Step 5: JavaScript機能の段階的追加**
```javascript
// 初期テンプレートの基本JavaScriptは維持
// 顧客要求機能を段階的に追加

/* 顧客要求: アニメーション機能追加 */
const AnimationManager = {
    init() {
        // アニメーション機能実装
    }
};

/* 顧客要求: 画像ギャラリー機能追加 */
const ImageGalleryManager = {
    init() {
        // 画像ギャラリー機能実装
    }
};

// 既存の初期化処理に追加
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
    Navigation.init();           // 初期テンプレートの基本機能
    AnimationManager.init();     // 顧客要求機能
    ImageGalleryManager.init();  // 顧客要求機能
});
```

### 📋 **効率的開発のチェックリスト**

#### **プロジェクト開始時**
- [ ] 初期テンプレートファイルをコピー
- [ ] BASE管理画面で動作確認
- [ ] 顧客要求の詳細分析
- [ ] カスタマイズ箇所の特定

#### **開発中**
- [ ] CSS変数でデザイン適用
- [ ] HTML構造を段階的にカスタマイズ
- [ ] JavaScript機能を段階的に追加
- [ ] 各段階で動作確認

#### **完成前**
- [ ] BASE仕様準拠チェック
- [ ] 全ページ動作確認
- [ ] レスポンシブ対応確認
- [ ] パフォーマンス確認

### 💡 **この手法のメリット**

1. **リスク最小化**: 最初から動作する状態でスタート
2. **開発効率**: BASE仕様の学習コストを最小化
3. **品質保証**: BASE必須要素の漏れを防止
4. **メンテナンス性**: 段階的なカスタマイズで影響範囲が明確
5. **再利用性**: 初期テンプレートを他プロジェクトでも活用可能

### 🚨 **注意点**

1. **初期テンプレートの更新**: BASE仕様変更時は初期テンプレートも更新
2. **過度なカスタマイズ回避**: 初期テンプレートの構造を大幅に変更しない
3. **段階的な動作確認**: 各カスタマイズ後は必ず動作確認
4. **バックアップ**: 各段階でコードをバックアップ

---

## 単一HTMLファイル開発の制約と対策

### 🚫 制約事項

#### 1. **ファイル分割ができない**
- CSS、JavaScript、HTMLが1ファイルに混在
- コード量が3000行超えも珍しくない
- 可読性・保守性の低下が課題

#### 2. **外部依存関係の制限**
- npm、Node.js環境が使えない
- 外部CSSファイル、JSファイルの読み込み不可
- ビルドプロセスが組めない

#### 3. **開発環境の制約**
- HMR（Hot Module Replacement）なし
- TypeScript、SCSS等のトランスパイラ使用不可
- ESモジュールシステム使用不可

### ✅ 対策・解決法

#### 1. **CSS変数による保守性確保**
```css
:root {
    /* カラーパレット */
    --primary-bg: #0B101D;
    --accent-color: #D43883;
    --primary-text: #FFFFFF;
    
    /* スペーシング */
    --space-xs: 0.5rem;
    --space-sm: 1rem;
    --space-md: 1.5rem;
    
    /* フォント */
    --font-base: 1.2rem;
    --weight-light: 300;
}
```

#### 2. **擬似モジュール化JavaScript**
```javascript
// DOMユーティリティ
const DOMUtils = {
    get: (selector) => document.querySelector(selector),
    getAll: (selector) => document.querySelectorAll(selector),
    cache: {},
    getCached: function(key, selector) {
        if (!this.cache[key]) {
            this.cache[key] = this.get(selector);
        }
        return this.cache[key];
    }
};

// 機能別マネージャー
const NavigationManager = {
    init() { /* 初期化 */ },
    open() { /* メニュー開く */ },
    close() { /* メニュー閉じる */ }
};
```

#### 3. **コード整理のベストプラクティス**
```html
<!-- 構造化されたHTML -->
<style>
/* ==========================================================================
   1. CSS変数定義
   ========================================================================== */

/* ==========================================================================
   2. リセット・ベーススタイル
   ========================================================================== */

/* ==========================================================================
   3. レイアウト・グリッド
   ========================================================================== */

/* ==========================================================================
   4. コンポーネント
   ========================================================================== */
</style>

<body>
<!-- HTML構造 -->

<script>
/* ==========================================================================
   JavaScript - ユーティリティ関数
   ========================================================================== */

/* ==========================================================================
   JavaScript - 機能別マネージャー
   ========================================================================== */

/* ==========================================================================
   JavaScript - 初期化処理
   ========================================================================== */
</script>
</body>
```

---

## CSS変数システムによる保守性向上

### 🎨 CSS変数設計の原則

#### 1. **階層的な変数命名**
```css
:root {
    /* ベースカラー */
    --color-primary: #D43883;
    --color-secondary: #0B101D;
    --color-accent: #FF6B6B;
    
    /* セマンティックカラー */
    --primary-bg: var(--color-secondary);
    --accent-color: var(--color-primary);
    --error-color: var(--color-accent);
    
    /* 状態別カラー */
    --text-primary: #FFFFFF;
    --text-secondary: #CCCCCC;
    --text-muted: #888888;
}
```

#### 2. **レスポンシブ対応変数**
```css
:root {
    /* デスクトップ */
    --container-max-width: 1200px;
    --grid-columns: 3;
    --font-size-base: 1.2rem;
}

@media (max-width: 768px) {
    :root {
        /* モバイル */
        --grid-columns: 1;
        --font-size-base: 1rem;
    }
}
```

#### 3. **スペーシングシステム**
```css
:root {
    /* 8px基準のスペーシング */
    --space-xs: 0.5rem;   /* 8px */
    --space-sm: 1rem;     /* 16px */
    --space-md: 1.5rem;   /* 24px */
    --space-lg: 2rem;     /* 32px */
    --space-xl: 3rem;     /* 48px */
}
```

### 💡 CSS変数活用のメリット

1. **一元管理**: カラーテーマの変更が1箇所で完了
2. **可読性向上**: セマンティックな名前でコードが理解しやすい
3. **保守性**: 変更箇所が明確で影響範囲が把握しやすい
4. **DRY原則**: 重複コードの削減

---

## JavaScriptモジュール化のベストプラクティス

### 🔧 擬似モジュールシステム

#### 1. **ユーティリティ層**
```javascript
// DOM操作ユーティリティ
const DOMUtils = {
    // 基本セレクタ
    get: (selector) => document.querySelector(selector),
    getAll: (selector) => document.querySelectorAll(selector),
    getId: (id) => document.getElementById(id),
    
    // キャッシュ機能
    cache: {},
    getCached: function(key, selector) {
        if (!this.cache[key]) {
            this.cache[key] = this.get(selector);
        }
        return this.cache[key];
    },
    
    // よく使う要素
    body: () => document.body,
    hamburger: () => DOMUtils.getCached('hamburger', '#js-humberger'),
    navArea: () => DOMUtils.getCached('navArea', '.js-nav-area')
};

// ページ状態管理
const PageState = {
    cache: null,
    
    get() {
        if (this.cache) return this.cache;
        
        this.cache = {
            isShopTopPage: document.body.id === 'shopTopPage',
            isItemPage: document.body.id === 'shopDetailPage',
            hasMainVisual: !!DOMUtils.get('.main-visual'),
            hasProductDetail: !!DOMUtils.get('.product-detail')
        };
        
        return this.cache;
    },
    
    isHomePage() {
        const state = this.get();
        return state.isShopTopPage && state.hasMainVisual && !state.hasProductDetail;
    }
};
```

#### 2. **機能別マネージャー**
```javascript
// ナビゲーション管理
const NavigationManager = {
    elements: {
        get hamburger() { return DOMUtils.hamburger(); },
        get navArea() { return DOMUtils.navArea(); }
    },
    
    init() {
        const { hamburger, navArea } = this.elements;
        if (!hamburger || !navArea) return;
        
        hamburger.addEventListener('click', () => this.toggle());
    },
    
    toggle() {
        const { hamburger, navArea } = this.elements;
        const isActive = navArea.classList.contains('-active');
        
        if (isActive) {
            this.close();
        } else {
            this.open();
        }
    },
    
    open() {
        const { hamburger, navArea } = this.elements;
        hamburger.classList.add('-active');
        navArea.classList.add('-active');
        DOMUtils.body().classList.add('body-fixed');
    },
    
    close() {
        const { hamburger, navArea } = this.elements;
        hamburger.classList.remove('-active');
        navArea.classList.remove('-active');
        DOMUtils.body().classList.remove('body-fixed');
    }
};
```

#### 3. **初期化システム**
```javascript
// 初期化処理の統合
document.addEventListener('DOMContentLoaded', function() {
    // 基本設定
    DOMUtils.body().classList.add('loaded');
    
    // 各種マネージャー初期化
    NavigationManager.init();
    AnimationManager.init();
    LoadMoreManager.init();
    ImageGalleryManager.init();
    
    // 状態管理
    LogoManager.updatePosition();
    controlInstagramButton();
    
    // 遅延処理
    setTimeout(() => AnimationManager.animateOnScroll(), 500);
});
```

### 📈 モジュール化のメリット

1. **責任分離**: 各機能が独立して管理される
2. **再利用性**: 共通ユーティリティの活用
3. **テスタビリティ**: 単体での動作確認が可能
4. **拡張性**: 新機能の追加が容易

---

## レスポンシブ対応の必須ポイント

### 📱 モバイルファースト設計

#### 1. **ブレークポイント戦略**
```css
/* モバイルファースト */
.component {
    /* モバイル（〜767px）のスタイル */
    display: block;
    padding: 1rem;
}

/* タブレット */
@media (min-width: 768px) {
    .component {
        display: flex;
        padding: 1.5rem;
    }
}

/* デスクトップ */
@media (min-width: 1024px) {
    .component {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }
}
```

#### 2. **柔軟なグリッドシステム**
```css
.product-grid {
    display: grid;
    gap: var(--space-md);
    
    /* モバイル: 1列 */
    grid-template-columns: 1fr;
}

@media (min-width: 768px) {
    .product-grid {
        /* タブレット: 2列 */
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .product-grid {
        /* デスクトップ: 3列 */
        grid-template-columns: repeat(3, 1fr);
    }
}
```

#### 3. **タッチフレンドリーなUI**
```css
/* タッチターゲットサイズ（最低44px） */
.touch-target {
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* モバイル専用のスタイル */
@media (max-width: 767px) {
    .hamburger {
        width: 48px;
        height: 48px;
    }
    
    .thumbnail-item {
        min-width: 60px;
        min-height: 60px;
    }
}
```

### 🎯 BASE特有のレスポンシブ課題

#### 1. **固定要素の配置調整**
```css
/* BASEメニューコンテナ */
.base-menu-container {
    position: fixed;
    bottom: 20px;
    left: 20px;
}

@media (max-width: 768px) {
    .base-menu-container {
        bottom: 15px;
        left: 15px;
    }
}

/* Instagram固定ボタンとの干渉回避 */
@media (max-width: 768px) {
    .instagram-fixed-btn {
        bottom: 80px;  /* BASEメニューの上に配置 */
    }
}
```

#### 2. **商品画像の最適化**
```css
/* 商品画像のレスポンシブ対応 */
.product-image img {
    width: 100%;
    height: auto;
    object-fit: cover;
}

/* サムネイル画像の調整 */
@media (max-width: 768px) {
    .thumbnail-container {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 480px) {
    .thumbnail-container {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

---

## BASE仕様準拠チェックリスト

### ⚠️ 審査の厳格性（重要な心構え）

#### 📊 審査統計
- **合格率**: 極めて低い（8回申請でやっと通過の事例あり）
- **初回指摘**: 20〜30項目の修正指摘が一般的
- **審査期間**: 1ヶ月以上の長期戦を覚悟

#### 📋 審査基準
- **デザインガイドライン**: 厳密な遵守が必須
- **チェックリスト**: 全項目クリア必須
- **品質基準**: 商用レベルの完成度が求められる

#### 💡 成功のポイント
- **忍耐力**: 長期戦を覚悟する
- **柔軟性**: フィードバックに素直に対応
- **品質意識**: 妥協せずに高品質を追求
- **学習意欲**: 継続的なスキル向上
- **BASE基礎.htmlの研究**: 公式テンプレートから学ぶ

#### 🔄 審査プロセス
1. **初回申請**: 基本機能の実装
2. **フィードバック対応**: 指摘事項の修正
3. **継続改善**: 品質向上のための改修
4. **最終調整**: 細かい仕様の調整

#### 📚 参考資料
- [BASE Template Docs](https://docs.thebase.in/docs/template/)
- [デザインガイドライン](https://docs.thebase.in/docs/template/guideline/)
- [チェックリスト](https://docs.thebase.in/docs/template/guideline/check_list)

### ✅ 必須チェック項目

#### 1. **必須タグの実装**
- [ ] `{BASEMenuTag}` - BASEメニュー
- [ ] `{LogoTag}` - ロゴ表示
- [ ] `{MetaTag}` - メタタグ
- [ ] `{IllegalReportMessageTag}` - 違法報告メッセージ
- [ ] `{PurchaseButton}` - 購入ボタン
- [ ] `{SocialButtonTag}` - ソーシャルボタン
- [ ] `{ItemAttentionTag}` - 商品注意事項
- [ ] `{IllegalReportTag}` - 違法報告

#### 2. **ページ構造の確認**
- [ ] ショップTOPページ `{block:IndexPage}`
- [ ] 商品詳細ページ `{block:ItemPage}`
- [ ] Aboutページ `{block:AboutPage}`
- [ ] 特商法ページ `{block:LawPage}`
- [ ] プライバシーポリシーページ `{block:PrivacyPage}`
- [ ] お問い合わせページ `{block:ContactPage}`

#### 3. **商品表示機能**
- [ ] 商品一覧表示 `{block:Items}`
- [ ] 商品画像表示（複数対応）
- [ ] 在庫状態表示 `{block:HasItemStock}` / `{block:NoItemStock}`
- [ ] 価格表示（セール価格対応）
- [ ] 売り切れ表示

#### 4. **BASE App対応**
- [ ] 商品検索App `{block:AppsSearch}`
- [ ] カテゴリ管理App `{block:AppsCategory}`
- [ ] レビューApp `{block:AppsReview}`
- [ ] その他使用するApp

### ⚠️ よくある仕様違反

1. **必須タグの欠如**
   ```html
   <!-- NG: BASEMenuTagがない -->
   <body>
       <div class="content">...</div>
   </body>
   
   <!-- OK: BASEMenuTagを配置 -->
   <body>
       {BASEMenuTag}
       <div class="content">...</div>
   </body>
   ```

2. **商品詳細ページの必須要素不足**
   ```html
   <!-- NG: 必須タグが不足 -->
   {block:ItemPage}
       <img src="{ItemImage1URL-640}">
       <h1>{ItemTitle}</h1>
   {/block:ItemPage}
   
   <!-- OK: 必須タグを全て配置 -->
   {block:ItemPage}
       {IllegalReportMessageTag}
       <img src="{ItemImage1URL-640}">
       <h1>{ItemTitle}</h1>
       {PurchaseButton}
       {SocialButtonTag}
       {ItemAttentionTag}
       {IllegalReportTag}
   {/block:ItemPage}
   ```

3. **不正なタグのネスト**
   ```html
   <!-- NG: ブロックタグの不正なネスト -->
   {block:Items}
       {block:ItemPage}
           <!-- 商品一覧内で商品詳細ページブロックは使用不可 -->
       {/block:ItemPage}
   {/block:Items}
   ```

---

## よくあるトラブルと解決法

### 🚨 JavaScript関連のトラブル

#### 1. **DOMContentLoadedが動かない**
```javascript
// NG: BASEで正常に動作しない場合がある
document.addEventListener('DOMContentLoaded', function() {
    // 処理
});

// OK: より確実な方法
function initializeWhenReady() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
}

function initialize() {
    // 初期化処理
}

initializeWhenReady();
```

#### 2. **要素が見つからないエラー**
```javascript
// NG: 要素の存在確認なし
const element = document.getElementById('myElement');
element.addEventListener('click', handler);  // エラーの可能性

// OK: 存在確認を行う
const element = document.getElementById('myElement');
if (element) {
    element.addEventListener('click', handler);
}

// Better: ユーティリティ関数を使用
const DOMUtils = {
    safeAddEventListener(selector, event, handler) {
        const element = document.querySelector(selector);
        if (element) {
            element.addEventListener(event, handler);
        }
    }
};
```

#### 3. **Ajax読み込みが動かない**
```javascript
// BASEのAjax読み込みURL確認
const xhr = new XMLHttpRequest();
xhr.open('GET', '{LoadItemsPageURL}' + page + '{LoadItemsPageURLParams}', true);
// BASEタグが正しく展開されているか確認
```

### 🎨 CSS関連のトラブル

#### 1. **CSS変数が効かない**
```css
/* NG: !importantで上書きされる */
.element {
    color: #fff !important;
}

/* OK: CSS変数を使用 */
.element {
    color: var(--primary-text);
}
```

#### 2. **レスポンシブが効かない**
```html
<!-- 必須: viewportメタタグ -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

#### 3. **固定要素が重なる**
```css
/* z-indexの管理 */
:root {
    --z-header: 1000;
    --z-navigation: 1001;
    --z-modal: 1002;
}

.base-menu-container {
    z-index: var(--z-header);
}
```

### 🏷️ BASEタグ関連のトラブル

#### 1. **商品画像が表示されない**
```html
<!-- BASEタグの正しい記述 -->
{block:ItemImage1}
    <img src="{ItemImage1URL-640}" alt="{ItemTitle}">
{/block:ItemImage1}

{block:NoItemImage1}
    <img src="{ItemNoImageURL}" alt="No Image">
{/block:NoItemImage1}
```

#### 2. **条件分岐が正しく動作しない**
```html
<!-- 正しい順序で記述 -->
{block:HasItemStock}
    {block:ItemNowOnSale}
        <!-- 在庫ありかつ販売中 -->
        {PurchaseButton}
    {/block:ItemNowOnSale}
    {block:ItemWaitingForSale}
        <!-- 在庫ありかつ販売待ち -->
        <p>Coming Soon</p>
    {/block:ItemWaitingForSale}
{/block:HasItemStock}

{block:NoItemStock}
    <!-- 在庫なし -->
    <p>Out of stock</p>
{/block:NoItemStock}
```

---

## 開発効率化のTips

### ⚡ 開発スピード向上

#### 1. **テンプレート化**
```html
<!-- BASE基本テンプレート -->
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    {MetaTag}
    <style>
        :root {
            /* CSS変数定義 */
        }
        /* スタイル定義 */
    </style>
</head>
<body id="{block:IndexPage}shopTopPage{/block:IndexPage}{block:ItemPage}shopDetailPage{/block:ItemPage}">
    {BASEMenuTag}
    {LogoTag}
    
    <!-- コンテンツ -->
    
    <script>
        /* JavaScript */
    </script>
</body>
</html>
```

#### 2. **コードスニペット集**
```javascript
// よく使うユーティリティ関数
const Utils = {
    debounce: (func, wait) => {
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
    
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
};
```

#### 3. **デバッグヘルパー**
```javascript
// 開発時のデバッグヘルパー
const Debug = {
    log: (message, data) => {
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('preview')) {
            console.log(`[DEBUG] ${message}`, data);
        }
    },
    
    checkBASETags: () => {
        const tags = [
            'BASEMenuTag',
            'LogoTag', 
            'MetaTag',
            'PurchaseButton'
        ];
        
        tags.forEach(tag => {
            if (document.body.innerHTML.includes(`{${tag}}`)) {
                console.warn(`未展開のBASEタグが見つかりました: ${tag}`);
            }
        });
    }
};
```

### 📝 コード管理

#### 1. **バージョン管理**
```html
<!-- ファイル先頭にコメントでバージョン情報 -->
<!--
HOLY LABEL Theme v2.1.0
Last Updated: 2024-01-15
Features: 
- Multi-image gallery
- Responsive design
- Animation system
-->
```

#### 2. **変更履歴の記録**
```html
<!--
変更履歴:
v2.1.0 (2024-01-15)
- 商品詳細ページ画像ギャラリー実装
- BASEメニュー位置を左下に変更
- Instagram固定ボタン位置調整

v2.0.0 (2024-01-10)
- CSS変数システム導入
- JavaScript完全モジュール化
- レスポンシブ対応強化
-->
```

---

## 顧客納品時の注意点

### 📋 納品前チェックリスト

#### 1. **動作確認**
- [ ] 全ページの表示確認
- [ ] 商品購入フローのテスト
- [ ] モバイル・タブレットでの表示確認
- [ ] 各種ブラウザでの動作確認（Chrome, Safari, Firefox）

#### 2. **パフォーマンス確認**
- [ ] ページ読み込み速度
- [ ] 画像の最適化状況
- [ ] JavaScript動作の軽快性
- [ ] CSS変数の活用状況

#### 3. **アクセシビリティ**
- [ ] altタグの設定
- [ ] カラーコントラストの確認
- [ ] キーボードナビゲーション
- [ ] スクリーンリーダー対応

### 📖 顧客向けドキュメント作成

#### 1. **メンテナンスマニュアル**
```markdown
# テーマカスタマイズガイド

## 基本設定の変更
- カラーテーマの変更方法
- フォントサイズの調整
- レイアウトの微調整

## よくある質問
- 画像が表示されない場合
- メニューが動かない場合
- モバイル表示がおかしい場合
```

#### 2. **更新手順書**
```markdown
# テーマ更新手順

## 1. バックアップの作成
BASE管理画面 > デザイン > テーマ編集 > 現在のコードをコピー

## 2. 新バージョンの適用
提供されたHTMLファイルの内容をペースト

## 3. 動作確認
- プレビューで確認
- 各ページの表示チェック
- 購入フローの確認
```

---

## BASEファイルサイズ制限対応とリファクタリング

### 📏 BASE制限事項

#### 1. **ファイルサイズ制限**
- **制限**: 150,000文字以内
- **確認方法**: `wc -c ファイル名.html`
- **対策**: 定期的なリファクタリングが必須

#### 2. **制限超過時の症状**
- テーマアップロード時にエラー
- 「ファイルサイズが大きすぎます」のメッセージ
- 保存ボタンが機能しない

### 🛠️ リファクタリング手法

#### 1. **コメント最適化**
```css
/* 変更前: 冗長なセクションヘッダー */
/* ==========================================================================
   CSS変数定義
   ========================================================================== */

/* 変更後: 簡潔なコメント */
/* CSS変数定義 */
```
**削減効果**: 約6,000文字

#### 2. **CSS変数の一行化**
```css
/* 変更前: 複数行記述 */
:root {
    --primary-bg: #0B101D;
    --primary-text: #fff;
    --secondary-text: #ccc;
}

/* 変更後: 一行記述 */
:root {
    --primary-bg: #0B101D; --primary-text: #fff; --secondary-text: #ccc;
}
```
**削減効果**: 約1,400文字

#### 3. **空行・スペース削除**
```bash
# 空行削除コマンド
sed -i '' '/^[[:space:]]*$/d' ファイル名.html

# セクションヘッダー短縮
sed -i '' 's|/\* ==========================================================================|/*|g' ファイル名.html
sed -i '' 's|           ========================================================================== \*/| */|g' ファイル名.html
```
**削減効果**: 約2,700文字

### ⚡ 自動リファクタリングスクリプト

#### 1. **一括最適化スクリプト**
```bash
#!/bin/bash
# BASE テーマ最適化スクリプト

FILE_NAME="現在.html"
BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S).html"

echo "🔄 BASEテーマリファクタリング開始..."

# バックアップ作成
cp "$FILE_NAME" "$BACKUP_NAME"
echo "📋 バックアップ作成: $BACKUP_NAME"

# 元の文字数確認
ORIGINAL_SIZE=$(wc -c < "$FILE_NAME")
echo "📊 元のファイルサイズ: $ORIGINAL_SIZE 文字"

# セクションヘッダー短縮
sed -i '' 's|/\* ==========================================================================|/*|g' "$FILE_NAME"
sed -i '' 's|           ========================================================================== \*/| */|g' "$FILE_NAME"

# 空行削除
sed -i '' '/^[[:space:]]*$/d' "$FILE_NAME"

# 最終文字数確認
FINAL_SIZE=$(wc -c < "$FILE_NAME")
REDUCTION=$((ORIGINAL_SIZE - FINAL_SIZE))

echo "📊 最終ファイルサイズ: $FINAL_SIZE 文字"
echo "✨ 削減文字数: $REDUCTION 文字"

# BASE制限チェック
if [ $FINAL_SIZE -le 150000 ]; then
    echo "✅ BASEアップロード可能 (制限: 150,000文字)"
else
    echo "❌ まだ制限オーバー。追加最適化が必要"
fi

echo "🎉 リファクタリング完了"
```

#### 2. **BASEタグ保護機能付きリファクタリング**
```javascript
// BASEタグ保護チェック関数
function checkBASETags(content) {
    const requiredTags = [
        '{FaviconTag}',
        '{CanonicalTag}', 
        '{BASEMenuTag}',
        '{IllegalReportTag}',
        '{block:AppsI18n}',
        '{AppsI18nTag}',
        '{PurchaseFormTag}',
        '{ItemSelectTag}'
    ];
    
    const missingTags = requiredTags.filter(tag => !content.includes(tag));
    
    if (missingTags.length > 0) {
        console.error('❌ 必須BASEタグが不足:', missingTags);
        return false;
    }
    
    console.log('✅ 全ての必須BASEタグが保持されています');
    return true;
}
```

### 📋 リファクタリング実施例（HOLY LABEL）

#### 実施内容
1. **セクションヘッダー短縮**: 6,000文字削減
2. **CSS変数一行化**: 1,400文字削減  
3. **空行削除**: 2,700文字削減
4. **総削減**: **10,100文字**

#### 結果
- **元**: 159,687文字 (制限オーバー)
- **後**: 149,587文字 (制限内)
- **余裕**: 413文字

#### BASEタグ保持確認
- ✅ 全ての必須タグ保持
- ✅ ECサイト機能完全動作
- ✅ デザイン変更なし
- ✅ 英語・外貨対応維持

### 🔧 メンテナンス時の注意点

#### 1. **定期的なサイズチェック**
```bash
# 月次チェック推奨
wc -c テーマファイル.html
```

#### 2. **機能追加時の考慮事項**
- 新機能追加前にサイズ確認
- 不要なコードの事前削除
- CSS変数活用で効率化

#### 3. **緊急時の対応**
```bash
# 緊急時の最小化
# 1. 全コメント削除（開発用）
sed -i '' 's|/\*.*\*/||g' ファイル名.html

# 2. 複数スペース→単一スペース
sed -i '' 's/  */ /g' ファイル名.html

# 3. 行末スペース削除
sed -i '' 's/[[:space:]]*$//' ファイル名.html
```

**注意**: 緊急対応後は必ず動作確認とBASEタグチェックを実施

### 🎯 継続サポートのポイント

#### 1. **トラブル対応**
- よくある問題の解決法をドキュメント化
- リモートサポートの準備
- 緊急時の連絡体制

#### 2. **機能追加の対応**
- BASE新機能への対応方針
- カスタマイズ要望への対応範囲
- 保守契約の内容明確化

#### 3. **技術的負債の管理**
- 定期的なコードレビュー
- パフォーマンス監視
- セキュリティアップデート

---

## まとめ

BASE専用ECサイトテーマ開発は、通常のWeb開発とは異なる制約と要求があります。

### 🔑 成功のカギ

1. **BASEテンプレートタグの完全理解**
2. **単一ファイル開発の制約を逆手に取った設計**
3. **CSS変数とJavaScriptモジュール化による保守性確保**
4. **BASE仕様への完全準拠**
5. **レスポンシブ対応の徹底**

### 🚀 今後の展望

- BASE新機能への継続対応
- パフォーマンス最適化の追求
- アクセシビリティの向上
- 開発効率化ツールの構築

このノウハウを活用して、効率的で高品質なBASEテーマ開発を実現してください。 