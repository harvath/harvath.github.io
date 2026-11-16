const FENCED_CODE = /(```|~~~)[\s\S]*?\1/g;
const MD_IMAGE = /!\[[^\]]*\]\(\s*<?([^\s)>]+)>?(?:\s+["'(][^)]*)?\)/;
const HTML_IMAGE = /<img\b[^>]*\bsrc=["']([^"']+)["']/i;

/**
 * md 本文の最初の画像の参照（`./foo.png` や URL）を返す。無ければ `undefined`。
 * `![alt](path)` と `<img src>` の両方を見て、先に出てくる方を採る。コードブロックの中は無視。
 */
export function firstImage(body: string): string | undefined {
  const text = body.replace(FENCED_CODE, '');
  const md = MD_IMAGE.exec(text);
  const html = HTML_IMAGE.exec(text);
  if (md && (!html || md.index <= html.index)) return md[1];
  return html?.[1];
}
