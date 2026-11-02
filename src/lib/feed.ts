const TAG_RE = /<[a-zA-Z][^>]*>/g;
const URL_ATTR_RE = /\s(src|href)="\/(?!\/)([^"]*)"/g;
const SRCSET_RE = /\ssrcset="([^"]*)"/g;

/**
 * feed reader は相対 URL を解決できないことがあるので、記事 HTML 中の
 * ルート相対な `src` / `href` / `srcset`（`/_astro/...`、`/about/` など）をサイトの絶対 URL にする。
 * タグの中だけを見るので、インラインコードなどテキストに書かれた `href="/..."` は触らない。
 * `//host/...` のプロトコル相対と、すでに絶対なものはそのまま。
 */
export function absolutizeUrls(html: string, site: URL): string {
  const origin = site.origin;
  return html.replace(TAG_RE, (tag) =>
    tag
      .replace(
        URL_ATTR_RE,
        (_m, attr: string, rest: string) => ` ${attr}="${origin}/${rest}"`,
      )
      .replace(SRCSET_RE, (_m, value: string) => {
        const candidates = value.split(',').map((candidate) => {
          const trimmed = candidate.trim();
          return trimmed.startsWith('/') && !trimmed.startsWith('//')
            ? `${origin}${trimmed}`
            : trimmed;
        });
        return ` srcset="${candidates.join(', ')}"`;
      }),
  );
}
