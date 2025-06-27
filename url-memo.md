# JavaScript外部URL管理メモ

## 概要
BASE ECサイトテーマ「HOLY LABEL」のJavaScript部分を外部URL化したライブラリの管理ドキュメント

## 作成済みライブラリ一覧

### 1. DOMUtils - DOM操作ユーティリティライブラリ
- **ファイル**: `js/dom-utils.js`
- **サイズ**: 約8KB
- **依存関係**: なし（完全独立）
- **機能**: 
  - 基本DOM操作（get, getAll, getId）
  - キャッシュ機能付きDOM取得
  - イベントリスナー管理
  - クラス・スタイル操作
  - パフォーマンス最適化
- **推奨CDN URL**: 
  ```html
  <script src="https://cdn.jsdelivr.net/gh/your-repo/holy-label-ver@main/js/dom-utils.js"></script>
  ```
- **使用例**:
  ```javascript
  const element = DOMUtils.get('#myElement');
  DOMUtils.addClass(element, 'active');
  ```

### 2. AnimationConfig - アニメーション設定管理ライブラリ
- **ファイル**: `js/animation-config.js`
- **サイズ**: 約12KB
- **依存関係**: なし（設定値のみ）
- **機能**:
  - 統一アニメーション設定
  - レスポンシブ対応設定
  - パフォーマンス最適化設定
  - CSS変数自動適用
  - デバイス検出による動的調整
- **推奨CDN URL**:
  ```html
  <script src="https://cdn.jsdelivr.net/gh/your-repo/holy-label-ver@main/js/animation-config.js"></script>
  ```
- **使用例**:
  ```javascript
  const config = AnimationConfig.getCurrentConfig();
  AnimationConfig.applyCSSVariables();
  ```

### 3. ImageCarouselManager - 商品画像カルーセルライブラリ
- **ファイル**: `js/image-carousel.js`
- **サイズ**: 約18KB
- **依存関係**: DOMUtils（推奨）
- **機能**:
  - 商品詳細画像カルーセル
  - タッチ/スワイプ操作
  - キーボード操作
  - 遅延読み込み
  - サムネイル表示
  - アクセシビリティ対応
- **推奨CDN URL**:
  ```html
  <script src="https://cdn.jsdelivr.net/gh/your-repo/holy-label-ver@main/js/image-carousel.js"></script>
  ```
- **使用例**:
  ```javascript
  ImageCarouselManager.init();
  ```

## CDN配信の準備手順

### 1. GitHub Pages / jsDelivr 使用の場合

#### リポジトリ準備
```bash
# GitHubリポジトリの作成
git init
git add js/
git commit -m "Add JavaScript libraries for BASE theme"
git branch -M main
git remote add origin https://github.com/your-username/holy-label-js-libs.git
git push -u origin main
```

#### jsDelivr URL形式
```
https://cdn.jsdelivr.net/gh/username/repo@version/path/to/file.js
```

### 2. 専用CDNサーバー使用の場合

#### CloudFlare / AWS CloudFront 例
```
https://your-domain.com/js/dom-utils.js
https://your-domain.com/js/animation-config.js
https://your-domain.com/js/image-carousel.js
```

## BASE HTMLでの使用方法

### 基本的な読み込み方法
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <!-- 既存のメタタグ等 -->
    
    <!-- JavaScript ライブラリの読み込み -->
    <script src="https://cdn.jsdelivr.net/gh/your-repo/holy-label-ver@main/js/dom-utils.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/your-repo/holy-label-ver@main/js/animation-config.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/your-repo/holy-label-ver@main/js/image-carousel.js"></script>
</head>
<body>
    <!-- BASEテンプレート内容 -->
    
    <script>
        // 従来のインラインJavaScriptから外部ライブラリの関数を呼び出し
        document.addEventListener('DOMContentLoaded', function() {
            // DOMUtils使用例
            const hamburger = DOMUtils.hamburger();
            
            // AnimationConfig初期化
            AnimationConfig.applyCSSVariables();
            
            // 商品詳細ページでカルーセル初期化
            if (document.body.id === 'shopDetailPage') {
                ImageCarouselManager.init();
            }
            
            // その他の初期化処理...
        });
    </script>
</body>
</html>
```

### 条件付き読み込み（最適化版）
```html
<script>
// ページタイプに応じた選択的読み込み
(function() {
    const scripts = [];
    
    // 基本ライブラリは常に読み込み
    scripts.push('https://cdn.jsdelivr.net/gh/your-repo/holy-label-ver@main/js/dom-utils.js');
    scripts.push('https://cdn.jsdelivr.net/gh/your-repo/holy-label-ver@main/js/animation-config.js');
    
    // 商品詳細ページでのみカルーセルを読み込み
    if (document.body.id === 'shopDetailPage') {
        scripts.push('https://cdn.jsdelivr.net/gh/your-repo/holy-label-ver@main/js/image-carousel.js');
    }
    
    // 順次読み込み
    scripts.forEach((src, index) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false; // 順序保証
        document.head.appendChild(script);
    });
})();
</script>
```

## ファイルサイズ削減効果

### 外部URL化による削減効果
- **元のインラインJavaScript**: 約15,000文字
- **外部URL化後のインライン部分**: 約3,000文字
- **削減量**: 約12,000文字
- **BASE制限への貢献**: 現在149,587文字 → 約137,587文字（12,000文字余裕増加）

### キャッシュ効果
- ブラウザキャッシュにより、2回目以降の読み込みが高速化
- CDN経由で配信速度も向上

## バージョン管理戦略

### セマンティックバージョニング
```
v1.0.0 - 初期リリース
v1.0.1 - バグフィックス
v1.1.0 - 新機能追加
v2.0.0 - 破壊的変更
```

### URL例
```html
<!-- 最新版（自動更新、開発用） -->
<script src="https://cdn.jsdelivr.net/gh/user/repo@main/js/dom-utils.js"></script>

<!-- 特定バージョン（本番用推奨） -->
<script src="https://cdn.jsdelivr.net/gh/user/repo@v1.0.0/js/dom-utils.js"></script>

<!-- 特定コミット（最も安全） -->
<script src="https://cdn.jsdelivr.net/gh/user/repo@commit-hash/js/dom-utils.js"></script>
```

## 依存関係管理

### 読み込み順序
1. **DOMUtils** - 基盤ライブラリ（最初）
2. **AnimationConfig** - 設定管理（2番目）
3. **ImageCarouselManager** - 機能ライブラリ（3番目）

### 相互依存性
```
DOMUtils (独立)
├─ AnimationConfig (独立)
└─ ImageCarouselManager (DOMUtilsに依存)
```

## 今後の拡張予定

### 追加予定ライブラリ
1. **NavigationManager** - ハンバーガーメニュー制御
2. **AnimationManager** - スクロールアニメーション
3. **LoadMoreManager** - Ajax商品読み込み
4. **FormValidator** - フォームバリデーション

### 統合ライブラリ検討
```javascript
// 全機能統合版
<script src="https://cdn.jsdelivr.net/gh/user/repo@main/js/holy-label-all.min.js"></script>
```

## メンテナンス・更新手順

### 1. ライブラリ更新時
```bash
# 変更をコミット
git add js/
git commit -m "Update: [library-name] v1.1.0 - [changes]"

# タグ作成
git tag v1.1.0
git push origin main --tags
```

### 2. BASE HTMLでの更新
```html
<!-- バージョンを更新 -->
<script src="https://cdn.jsdelivr.net/gh/user/repo@v1.1.0/js/dom-utils.js"></script>
```

### 3. キャッシュクリア（必要時）
```html
<!-- クエリパラメータでキャッシュ回避 -->
<script src="https://cdn.jsdelivr.net/gh/user/repo@main/js/dom-utils.js?v=1.1.0"></script>
```

## トラブルシューティング

### よくある問題と解決法

#### 1. ライブラリが読み込まれない
- CDN URLの確認
- リポジトリの公開設定確認
- jsDelivrのキャッシュ確認

#### 2. 依存関係エラー
- 読み込み順序の確認
- 必要なライブラリが全て読み込まれているか確認

#### 3. BASE環境でのエラー
- BASEテンプレート変数との競合確認
- 既存JavaScriptとの名前空間衝突確認

## 参考リンク

- [jsDelivr Documentation](https://www.jsdelivr.com/)
- [GitHub Pages Documentation](https://pages.github.com/)
- [BASE Template Development Guide](https://docs.thebase.in/docs/template/)

---

**最終更新**: 2025年6月27日  
**作成者**: Claude Code  
**バージョン**: 1.0.0