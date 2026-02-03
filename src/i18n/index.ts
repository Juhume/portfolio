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
