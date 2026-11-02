# harvath.tokyo 設計メモ

2026-11-02 決定。作り直しの前提。変えるときはこのファイルを先に直す。

## 目的

日本語中心の技術・仕事メモと雑記（ゲーム、個人 pj の記録など）。コードは時々。
「md を書くだけですぐ公開できる」「シンプルで読みやすい」の 2 つが鍵。
参考: r7kamura.com（本文幅・行間・装飾ゼロの読みやすさ）、burntsushi.net。真似はするが写しはしない。

## 決定

| 項目 | 決定 |
| --- | --- |
| 生成 | Astro。content collections で frontmatter を schema 検証。Shiki でコード色付け |
| 公開 URL | `https://harvath.tokyo`（GitHub Pages、独自ドメインは Pages の設定側で設定済み） |
| ページ | トップ `/`（全記事、新しい順、年ごとの見出し、各行は日付 + タイトル）、記事 `/posts/<slug>/`、`/about/`、`/404`、`/rss.xml`、`/sitemap-index.xml` |
| 記事の置き場 | `src/content/blog/<slug>/index.md`。画像は同じフォルダに置き `![説明](./foo.png)`。Astro が build 時に縮小・webp 化 |
| slug | フォルダ名は `YYYY-MM-DD-slug`。URL には日付を出さず `/posts/<slug>/` |
| frontmatter | `title`（必須）、`date`（必須）、`description`（任意。OGP と RSS にだけ使う。トップには出さない）、`draft`（任意、既定 false。true は本番 build から除外、dev では見える） |
| 新規作成 | `bun new "タイトル"` でフォルダと `index.md` の雛形を作る |
| 公開 | `main` に push → GitHub Actions（Astro 公式 action）→ Pages。branch も PR も挟まない。予約投稿なし |
| 見た目 | system font stack（webfont なし）。本文 17px、行間 1.8、max-width 40em 前後。ダークモードは OS 追従、切替ボタンなし。dark を先に作り light を合わせる。色はリンク色 1 つ + 黒白グレー。罫線と余白で区切る |
| 記事ページ | 公開日のみ（更新日なし）。目次なし。末尾に前の記事 / 次の記事、トップへ。シェアボタンなし。コードはコピーボタンなし |
| 画像 | alt をキャプションとして下に出す（figure 相当） |
| 外部リンク | 新規タブ（`target="_blank"` `rel="noopener"`）を md から自動付与 |
| サイト名 | `harvath`。ヘッダー: サイト名（トップへ）、about。フッター: RSS、GitHub（github.com/harvath） |
| 著者表示 | 記事には出さない。about とフッターのみ |
| RSS | 全文入り |
| 日付表記 | `2026-11-02`。`<html lang="ja">`、JST 固定 |
| OGP | サイト共通の画像 1 枚 + 記事の title / description をメタに出す。記事ごとの画像生成はしない |
| 404 | 1 枚 |
| 道具 | bun。Node は `.node-version` と `engines` で固定、CI も同じ版。TypeScript strict。Prettier はソースのみ（md 本文は対象外） |
| 履歴 | 既存の git 履歴の上に作り直す。Hugo のファイルは削除 |

## v1 でやらないこと（issue 化）

- 計測（Plausible か GoatCounter。Pages でも動く）
- 目次（長い記事が出てきたら）
- タグ（30 本を超えたら）
- 記事ごとの OGP 画像生成
- 更新日の表示

## やらないこと

- コメント
- 予約投稿、CMS
- 英語版
