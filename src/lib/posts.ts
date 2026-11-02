import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'> & { slug: string; url: string };

const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

/** フォルダ名 `YYYY-MM-DD-slug` から先頭の日付を落として slug にする。 */
export function toSlug(id: string): string {
  // glob loader の id は `2026-11-02-sample/index` のような形になることがある
  const folder = id.split('/')[0] ?? id;
  return folder.replace(DATE_PREFIX, '');
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

/** 公開記事を新しい順で返す。draft は本番 build では除外し、dev では含める。 */
export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  return entries
    .map((entry) => {
      const slug = toSlug(entry.id);
      return { ...entry, slug, url: postUrl(slug) };
    })
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
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
