import { defineMiddleware } from 'astro:middleware';
import { locales, defaultLocale } from './i18n';
import type { Locale } from './i18n';

export const onRequest = defineMiddleware(({ request, redirect, url }, next) => {
    if (url.pathname !== '/') return next();

    const accept = request.headers.get('accept-language') || '';
    const preferred = parseAcceptLanguage(accept);
    const matched = preferred.find(lang => locales.includes(lang as Locale)) as Locale | undefined;

    return redirect(`/${matched || defaultLocale}/`, 302);
});

function parseAcceptLanguage(header: string): string[] {
    return header
        .split(',')
        .map(part => {
            const [lang, q] = part.trim().split(';q=');
            return { lang: lang.split('-')[0].toLowerCase(), q: q ? parseFloat(q) : 1 };
        })
        .sort((a, b) => b.q - a.q)
        .map(({ lang }) => lang);
}
