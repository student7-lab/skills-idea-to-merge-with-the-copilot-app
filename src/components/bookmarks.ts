export type Bookmark = {
  url: string;
  slug: string;
};

const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function hasScheme(value: string): boolean {
  return /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value);
}

function isBookmarkRecord(value: unknown): value is Bookmark {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.url === 'string' && candidate.url.length > 0 && typeof candidate.slug === 'string' && candidate.slug.length > 0;
}

export function normalizeBookmarkUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const candidate = hasScheme(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(candidate).toString();
  } catch {
    return null;
  }
}

function randomBase62Suffix(length: number): string {
  let suffix = '';
  for (let index = 0; index < length; index += 1) {
    const randomIndex = Math.floor(Math.random() * BASE62.length);
    suffix += BASE62[randomIndex];
  }
  return suffix;
}

export function generateBookmarkSlug(existingSlugs: ReadonlySet<string>): string {
  const maxAttempts = 200;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const slug = `mona-${randomBase62Suffix(4)}`;
    if (!existingSlugs.has(slug)) {
      return slug;
    }
  }

  throw new Error('Could not generate a unique bookmark slug after several attempts.');
}

export function formatBookmarkDisplay(bookmark: Bookmark): string {
  return `${bookmark.url} :: ${bookmark.slug}`;
}

export function parseStoredBookmarks(raw: string | null | undefined): Bookmark[] {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const cleaned: Bookmark[] = [];
    for (const entry of parsed) {
      if (isBookmarkRecord(entry)) {
        cleaned.push({ url: entry.url, slug: entry.slug });
      }
    }

    return cleaned;
  } catch {
    return [];
  }
}
