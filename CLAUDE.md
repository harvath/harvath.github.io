# harvath.tokyo

harvath 個人の blog repo（harvath 所有）。設計は `docs/design.md` が正。迷ったらそこを読む。

## 記事

- 記事の文体を変えない。本文の整形や言い換えは頼まれた時だけ
- 下書きは `draft: true` のまま置く。公開するかは本人が決める
- 新規記事は `bun new "タイトル" [slug]` で作る（`src/content/blog/YYYY-MM-DD-slug/index.md`）。slug を省略すると聞かれる。TTY が無い場合は必須

## コマンド

```sh
bun install
bun dev
bun run build
bun run check
bun new "タイトル" [slug]
```

## git

- push は本人が判断する。agent は指示があった時だけ push する
- Claude 由来の署名（`Co-Authored-By`、`Generated with Claude Code`、`Claude-Session:` など）は付けない
