import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';

export default defineConfig({
    site: 'https://juliohuerta.dev',
    output: 'static',
    adapter: vercel(),
    i18n: {
        defaultLocale: 'es',
        locales: ['es', 'en', 'gl'],
        routing: {
            prefixDefaultLocale: true,
        },
    },
    integrations: [
        react(),
        sitemap({
            i18n: {
                defaultLocale: 'es',
                locales: {
                    es: 'es',
                    en: 'en',
                    gl: 'gl',
                },
            },
        }),
    ],
});
