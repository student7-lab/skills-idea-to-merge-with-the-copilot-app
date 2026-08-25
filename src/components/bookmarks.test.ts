import { describe, expect, it } from 'vitest';
import { formatBookmarkDisplay, normalizeBookmarkUrl, parseStoredBookmarks } from './bookmarks';

describe('normalizeBookmarkUrl', () => {
  it('normalizes URLs with and without https:// to the same saved value', () => {
    const withoutScheme = normalizeBookmarkUrl('www.example.com');
    const withScheme = normalizeBookmarkUrl('https://www.example.com');

    expect(withoutScheme).toBe(withScheme);
  });
});

describe('parseStoredBookmarks', () => {
  it('recovers from empty, corrupted, legacy, and non-array storage values', () => {
    const cases: Array<string | null | undefined> = [
      null,
      undefined,
      '',
      '   ',
      'not-json',
      '{"url":"https://www.example.com","slug":"mona-7fk2"}',
      '"legacy-string"',
      '{"bookmarks":[]}'
    ];

    for (const value of cases) {
      expect(() => parseStoredBookmarks(value)).not.toThrow();
      expect(parseStoredBookmarks(value)).toEqual([]);
    }
  });
});

describe('formatBookmarkDisplay', () => {
  it('formats bookmarks as "<url> :: <slug>" with exact separator', () => {
    const formatted = formatBookmarkDisplay({
      url: 'https://www.example.com/',
      slug: 'mona-7fk2'
    });

    expect(formatted).toBe('https://www.example.com/ :: mona-7fk2');
  });
});
