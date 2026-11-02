// 使い方: bun new "タイトル" [slug]
// src/content/blog/YYYY-MM-DD-<slug>/index.md を draft: true で作る。

import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { join } from 'node:path';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const BLOG_DIR = join(import.meta.dirname, '..', 'src', 'content', 'blog');

function todayJst(): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

async function askSlug(): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return (await rl.question('slug (ASCII, e.g. my-first-post): ')).trim();
  } finally {
    rl.close();
  }
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

const [title, slugArg] = process.argv.slice(2);
if (!title) fail('使い方: bun new "タイトル" [slug]');

const slug = slugArg?.trim() || (await askSlug());
if (!SLUG_RE.test(slug)) {
  fail(`slug は小文字英数字とハイフンのみ: ${JSON.stringify(slug)}`);
}

const date = todayJst();
const dir = join(BLOG_DIR, `${date}-${slug}`);
if (existsSync(dir)) fail(`既にあります: ${dir}`);

const frontmatter = [
  '---',
  `title: ${JSON.stringify(title)}`,
  `date: ${date}`,
  "description: ''",
  'draft: true',
  '---',
  '',
  '',
].join('\n');

await mkdir(dir, { recursive: true });
await writeFile(join(dir, 'index.md'), frontmatter);
console.log(`created ${join(dir, 'index.md')}`);
