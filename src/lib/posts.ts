import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'> & { slug: string; url: string };

const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

/**
 * entry.id はフォルダ名（glob loader が slug 化し `/index` を落としたもの）。
 * 先頭の `YYYY-MM-DD-` だけを落として URL の slug にする。日付が無ければそのまま。
 */
export function toSlug(id: string): string {
  return id.replace(DATE_PREFIX, '');
}

export function postUrl(slug: string): string {
  return `/posts/${slug}/`;
}

/** `YYYY-MM-DD`（JST）。 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function yearOf(date: Date): string {
  return formatDate(date).slice(0, 4);
}

/** 公開記事を新しい順（同日は slug 順）で返す。draft は本番 build では除外し、dev では含める。 */
export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );

  const seen = new Map<string, string>();
  const posts = entries.map((entry) => {
    const slug = toSlug(entry.id);
    const other = seen.get(slug);
    if (other !== undefined) {
      throw new Error(
        `slug "${slug}" が重複しています: src/content/blog/${other} と src/content/blog/${entry.id}`,
      );
    }
    seen.set(slug, entry.id);
    return { ...entry, slug, url: postUrl(slug) };
  });

  return posts.sort(
    (a, b) =>
      b.data.date.getTime() - a.data.date.getTime() ||
      a.slug.localeCompare(b.slug),
  );
}

/** 年ごとにまとめる（新しい年が先、年の中も新しい順）。 */
export function groupByYear(posts: Post[]): [string, Post[]][] {
  const map = new Map<string, Post[]>();
  for (const post of posts) {
    const year = yearOf(post.data.date);
    const list = map.get(year) ?? [];
    list.push(post);
    map.set(year, list);
  }
  return [...map.entries()];
}
