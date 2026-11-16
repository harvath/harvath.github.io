// 使い方: bun run og-image
// サイト共通の OGP 画像 public/og.png（1200x630）を Playwright で描き直す。
// GitHub のアバター（犬）を中央に丸く置くだけ。文字は入れない。
// 中央に置くのは、Slack などが中央の正方形に切り抜いても犬が残るように。
// 本文に画像がある記事は、その最初の画像が OGP になる（src/pages/posts/[slug].astro）。
//
// playwright は CI に入れたくないので devDependencies に入れていない。描き直すときだけ:
//   bun add -d playwright@1.58.0
//   bunx playwright@1.58.0 install chromium   （初回のみ）
//   bun run og-image
//   bun remove playwright

import { join } from 'node:path';
import { GITHUB_URL } from '../src/lib/site';

const OUT = join(import.meta.dirname, '..', 'public', 'og.png');
const AVATAR_URL = `${GITHUB_URL}.png?size=460`;
const PLAYWRIGHT = 'playwright';

async function fetchAvatarDataUrl(): Promise<string> {
  const res = await fetch(AVATAR_URL);
  if (!res.ok) throw new Error(`${AVATAR_URL}: ${res.status}`);
  const type = res.headers.get('content-type') ?? 'image/png';
  const base64 = Buffer.from(await res.arrayBuffer()).toString('base64');
  return `data:${type};base64,${base64}`;
}

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

const avatar = await fetchAvatarDataUrl();

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
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .avatar {
        width: 360px;
        height: 360px;
        border-radius: 50%;
        object-fit: cover;
      }
    </style>
  </head>
  <body>
    <img class="avatar" src="${avatar}" alt="" />
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
