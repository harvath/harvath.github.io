import { expect, test } from 'bun:test';
import { firstImage } from './og';

test('画像が無ければ undefined', () => {
  expect(
    firstImage('本文だけ。\n\n[リンク](https://example.com)'),
  ).toBeUndefined();
});

test('md 画像の最初の 1 枚を返す', () => {
  const body = '前書き。\n\n![一枚目](./a.png)\n\n![二枚目](./b.png)';
  expect(firstImage(body)).toBe('./a.png');
});

test('title 付きと URL も拾える', () => {
  expect(firstImage('![alt](./a.png "タイトル")')).toBe('./a.png');
  expect(firstImage('![alt](https://example.com/x.jpg)')).toBe(
    'https://example.com/x.jpg',
  );
});

test('コードブロックの中の画像は無視する', () => {
  const body = '```md\n![例](./in-code.png)\n```\n\n![本物](./real.png)';
  expect(firstImage(body)).toBe('./real.png');
});

test('<img> が先ならそちらを採る', () => {
  const body = '<img src="./html.png" alt="">\n\n![md](./md.png)';
  expect(firstImage(body)).toBe('./html.png');
});
