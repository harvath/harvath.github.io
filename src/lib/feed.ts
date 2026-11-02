/**
 * feed reader は相対 URL を解決できないことがあるので、記事 HTML 中の
 * ルート相対な `src` / `href` / `srcset`（`/_astro/...`、`/about/` など）をサイトの絶対 URL にする。
 * `//host/...` のプロトコル相対と、すでに絶対なものはそのまま。
 */
export function absolutizeUrls(html: string, site: URL): string {
  const origin = site.origin;
  return html
    .replace(
      /\b(src|href)="\/(?!\/)([^"]*)"/g,
      (_m, attr: string, rest: string) => `${attr}="${origin}/${rest}"`,
    )
    .replace(/\bsrcset="([^"]*)"/g, (_m, value: string) => {
      const candidates = value.split(',').map((candidate) => {
        const trimmed = candidate.trim();
        return trimmed.startsWith('/') && !trimmed.startsWith('//')
          ? `${origin}${trimmed}`
          : trimmed;
      });
      return `srcset="${candidates.join(', ')}"`;
    });
}
