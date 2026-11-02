import { expect, test } from 'bun:test';
import { absolutizeUrls } from './feed';

const site = new URL('https://harvath.tokyo');

test('ルート相対の src と href を絶対 URL にする', () => {
  const html =
    '<p><a href="/about/">about</a><img src="/_astro/a.webp" alt="x"></p>';
  expect(absolutizeUrls(html, site)).toBe(
    '<p><a href="https://harvath.tokyo/about/">about</a><img src="https://harvath.tokyo/_astro/a.webp" alt="x"></p>',
  );
});

test('テキスト（インラインコード）の中は触らない', () => {
  const html =
    '<p><code>href="/about/"</code> と <code>src="/x.png"</code></p>';
  expect(absolutizeUrls(html, site)).toBe(html);
});

test('プロトコル相対と絶対 URL はそのまま', () => {
  const html =
    '<a href="//example.com/x">a</a><a href="https://example.com/">b</a><img src="//cdn.example.com/i.png">';
  expect(absolutizeUrls(html, site)).toBe(html);
});

test('srcset の候補をそれぞれ絶対 URL にする', () => {
  const html =
    '<img src="/_astro/a.webp" srcset="/_astro/a.webp 1x, /_astro/a@2x.webp 2x, https://example.com/b.webp 3x">';
  expect(absolutizeUrls(html, site)).toBe(
    '<img src="https://harvath.tokyo/_astro/a.webp" srcset="https://harvath.tokyo/_astro/a.webp 1x, https://harvath.tokyo/_astro/a@2x.webp 2x, https://example.com/b.webp 3x">',
  );
});
