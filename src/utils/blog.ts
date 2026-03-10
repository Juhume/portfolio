import type { CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';

/**
 * Groups blog posts by their canonical slug.
 * Spanish originals use their file ID as slug; translations use canonicalSlug.
 */
export function groupPostsBySlug(posts: CollectionEntry<'blog'>[]) {
    const map = new Map<string, CollectionEntry<'blog'>[]>();
    for (const post of posts) {
        const slug = post.data.canonicalSlug || post.id;
        if (!map.has(slug)) map.set(slug, []);
        map.get(slug)!.push(post);
    }
    return map;
}

/**
 * Resolves the best post for a given locale from a group of translations.
 * Priority: exact locale match → Spanish fallback → first available.
 */
export function resolvePost(
    slugPosts: CollectionEntry<'blog'>[],
    lang: Locale
): CollectionEntry<'blog'> {
    return (
        slugPosts.find((p) => p.data.lang === lang) ||
        slugPosts.find((p) => p.data.lang === 'es') ||
        slugPosts[0]!
    );
}

/**
 * Estimates reading time in minutes from post body text.
 * Assumes ~200 words per minute. Returns at least 1 minute.
 */
export function getReadTime(body: string | undefined): number {
    if (!body) return 1;
    return Math.max(1, Math.ceil(body.split(/\s+/).length / 200));
}
