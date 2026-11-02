// 使い方: bun run og-image
// サイト共通の OGP 画像 public/og.png（1200x630）を Playwright で描き直す。
// 記事ごとの画像は作らない（docs/design.md）。
//
// playwright は CI に入れたくないので devDependencies に入れていない。描き直すときだけ:
//   bun add -d playwright@1.58.0
//   bunx playwright@1.58.0 install chromium   （初回のみ）
//   bun run og-image
//   bun remove playwright

import { join } from 'node:path';

const OUT = join(import.meta.dirname, '..', 'public', 'og.png');
const PLAYWRIGHT = 'playwright';

async function loadChromium() {
  try {
    const mod = await import(PLAYWRIGHT);
    return mod.chromium;
  } catch {
    console.error(
      'playwright が無い。`bun add -d playwright@1.58.0` と `bunx playwright@1.58.0 install chromium` を実行してから再度 `bun run og-image`。終わったら `bun remove playwright`。',
    );
    process.exit(1);
  }
}

const html = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <style>
      html, body { margin: 0; }
      body {
        width: 1200px;
        height: 630px;
        background: #17181a;
        color: #e4e2dc;
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
        display: flex;
        align-items: center;
      }
      .wrap { padding-left: 104px; }
      .name {
        font-size: 128px;
        font-weight: 600;
        letter-spacing: -0.02em;
        line-height: 1;
      }
      .rule {
        width: 160px;
        height: 4px;
        margin-top: 36px;
        background: #8ab9db;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="name">harvath</div>
      <div class="rule"></div>
    </div>
  </body>
</html>`;

const chromium = await loadChromium();
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(html);
  await page.screenshot({ path: OUT, type: 'png' });
  console.log(`wrote ${OUT}`);
} finally {
  await browser.close();
}
