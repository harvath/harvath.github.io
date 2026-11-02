import type { SatteriProcessorOptions } from '@astrojs/markdown-satteri';
import type { Element, ElementContent } from 'hast';

/** Sätteri の hast プラグイン 1 つ分の型（`satteri()` に渡す配列の要素）。 */
type HastPlugin = Extract<
  NonNullable<SatteriProcessorOptions['hastPlugins']>[number],
  { name: string }
>;

function isBlank(node: ElementContent): boolean {
  return node.type === 'text' && node.value.trim() === '';
}

/**
 * 画像だけの段落 `<p><img alt="..."></p>` を `<figure><img><figcaption>alt</figcaption></figure>` にする。
 * alt が空なら figure にしない（キャプション無しの画像は段落のまま）。
 *
 * Astro の画像処理（`__ASTRO_IMAGE_` の付与と build 後の属性差し替え）はこの後段で `img` 要素に対して
 * 行われるので、`img` を figure に移しても最適化は効く。
 */
export const figure: HastPlugin = {
  name: 'figure',
  element: {
    filter: ['p'],
    visit(node, ctx) {
      const content = node.children.filter((child) => !isBlank(child));
      const [only] = content;
      if (
        content.length !== 1 ||
        only === undefined ||
        only.type !== 'element' ||
        only.tagName !== 'img'
      ) {
        return;
      }
      const alt = only.properties.alt;
      if (typeof alt !== 'string' || alt.trim() === '') return;

      const img: Element = {
        type: 'element',
        tagName: 'img',
        properties: { ...only.properties },
        children: [],
      };
      const figcaption: Element = {
        type: 'element',
        tagName: 'figcaption',
        properties: {},
        children: [{ type: 'text', value: alt }],
      };
      ctx.replaceNode(node, {
        type: 'element',
        tagName: 'figure',
        properties: {},
        children: [img, figcaption],
      });
    },
  },
};

/**
 * 他ホストへの http(s) リンクに `target="_blank" rel="noopener"` を付ける。
 * 相対リンクと `site` と同じホストへのリンクはそのまま。
 */
export function externalLinks(site: string): HastPlugin {
  const siteHost = new URL(site).hostname;
  return {
    name: 'external-links',
    element: {
      filter: ['a'],
      visit(node, ctx) {
        const href = node.properties.href;
        if (typeof href !== 'string' || !/^https?:\/\//.test(href)) return;
        if (!URL.canParse(href) || new URL(href).hostname === siteHost) return;
        ctx.setProperty(node, 'target', '_blank');
        ctx.setProperty(node, 'rel', 'noopener');
      },
    },
  };
}

/** 表を `<div class="table-wrap">` で包み、横に長い表はその中でスクロールさせる。 */
export const tableWrap: HastPlugin = {
  name: 'table-wrap',
  element: {
    filter: ['table'],
    visit(node, ctx) {
      ctx.wrapNode(node, {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-wrap'] },
        children: [],
      });
    },
  },
};
