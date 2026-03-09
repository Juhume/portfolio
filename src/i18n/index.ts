import type { Locale, Translations, SectionIds } from './types';
import { es } from './locales/es';
import { en } from './locales/en';
import { gl } from './locales/gl';

export type { Locale, Translations, SectionIds };

export const locales: Locale[] = ['es', 'en', 'gl'];
export const defaultLocale: Locale = 'es';

const translations: Record<Locale, Translations> = { es, en, gl };

export function getTranslations(locale: Locale): Translations {
    return translations[locale];
}

export function getLocaleFromUrl(url: URL): Locale {
    const [, segment] = url.pathname.split('/');
    if (locales.includes(segment as Locale)) return segment as Locale;
    return defaultLocale;
}

export function replaceLocaleInPath(pathname: string, locale: Locale): string {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return `/${locale}/`;
    if (locales.includes(segments[0] as Locale)) {
        segments[0] = locale;
    } else {
        segments.unshift(locale);
    }

    const trailingSlash = pathname.endsWith('/') ? '/' : '';
    return `/${segments.join('/')}${trailingSlash || '/'}`;
}

const sectionIdsMap: Record<Locale, SectionIds> = {
    es: {
        experience: 'experiencia',
        projects: 'proyectos',
        caseStudy: 'caso',
        about: 'sobre-mi',
        contact: 'contacto',
    },
    en: {
        experience: 'experience',
        projects: 'projects',
        caseStudy: 'case-study',
        about: 'about',
        contact: 'contact',
    },
    gl: {
        experience: 'experiencia',
        projects: 'proxectos',
        caseStudy: 'caso',
        about: 'sobre-min',
        contact: 'contacto',
    },
};

export function getSectionIds(locale: Locale): SectionIds {
    return sectionIdsMap[locale];
}
