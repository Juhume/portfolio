import type { Translations } from '../types';

export const gl: Translations = {
    meta: {
        title: 'Julio Huerta | Desenvolvedor · Web, Mobile e Produto',
        description: 'Desenvolvedor con +5 anos en BBVA (web, mobile nativo e híbrido) e produtos propios con usuarios reais.',
        keywords: 'desenvolvedor, mobile, web, Kotlin, Swift, LitElement, TypeScript, React, Next.js, BBVA',
        jobTitle: 'Desenvolvedor — Web, Mobile e Produto',
        ogLocale: 'gl_ES',
    },
    a11y: {
        skipToContent: 'Saltar ao contido',
        themeToggleDark: 'Cambiar a tema escuro',
        themeToggleLight: 'Cambiar a tema claro',
        menuButton: 'Menú',
    },
    nav: {
        experience: 'Experiencia',
        projects: 'Proxectos',
        caseStudy: 'Caso',
        about: 'Sobre min',
        contact: 'Contacto',
    },
    hero: {
        label: 'Desenvolvedor · +5 anos en banca dixital',
        title: 'Construo produtos que funcionan no mundo real.',
        subtitle: 'De web a mobile nativo, de release management a liderar unha migración híbrida. Fóra do banco, creo produtos propios con usuarios reais.',
        ctaPrimary: 'Ver experiencia',
        ctaSecondary: 'Os meus produtos',
        scroll: 'Scroll',
    },
    experience: {
        sectionNumber: '01',
        title: 'Experiencia',
        company: 'BBVA',
        period: '2019 — Presente',
        role: 'Web → Release Manager → Mobile → Híbrido',
        context: 'BBVA Empresas: a app que usan as empresas para operar co banco. Contorno onde cada erro ten consecuencias reais e os despregamentos son controlados.',
        achievementsTitle: 'Traxectoria',
        achievements: [
            'Equipo Core de desenvolvemento web (2019–2020)',
            'Release manager: coordinación de entregas e despregamentos (2020)',
            'Desenvolvemento mobile nativo (Kotlin, Java, Swift, Objective-C) con parte híbrida en LitElement (2020–2024)',
            'Liderando a migración a unha aplicación totalmente híbrida (2025)',
        ],
        stack: ['Kotlin', 'Swift', 'LitElement', 'TypeScript', 'Java', 'Objective-C'],
    },
    projects: {
        sectionNumber: '02',
        title: 'Produtos propios',
        subtitle: 'O que construo fóra do traballo. Produtos con usuarios reais.',
        items: [
            {
                title: 'Espejo',
                description: 'Diario persoal offline-first con cifrado E2E e sync opcional. Deseño baseado en psicoloxía do benestar, non en gamificación.',
                category: 'Produto propio',
                badge: 'Usuarios reais',
                role: 'Full-Stack',
                linkLabel: 'Ver deep dive técnico',
            },
            {
                title: 'DiploTest',
                description: 'Plataforma de tests para opositores diplomáticos. Tests por temas, estatísticas e seguimento de progreso.',
                category: 'Produto propio',
                badge: 'Usuarios reais',
                role: 'Full-Stack',
            },
            {
                title: 'Homelab',
                description: 'Infraestrutura persoal con apps, bases de datos, reverse proxy e monitoring. Contornos reproducibles con Docker.',
                category: 'Infraestrutura',
                role: 'DevOps',
            },
        ],
    },
    caseStudy: {
        sectionNumber: '03',
        title: 'Deep dive: Espejo',
        blocks: [
            {
                label: 'Problema',
                content: 'As apps de journaling xeran presión con rachas e gamificación. E ningunha ofrece privacidade real: os teus pensamentos viven en texto plano en servidores de terceiros.',
            },
            {
                label: 'Arquitectura',
                highlight: 'Offline-first con sync opcional. O servidor nunca ve o contido.',
                content: '',
                list: [
                    'IndexedDB (Dexie) como fonte de verdade — funciona sen conexión',
                    'Cifrado AES-256-GCM + PBKDF2 (310k iteracións) no cliente',
                    'Supabase para sync opcional entre dispositivos (só blobs cifrados)',
                    'Soft-delete + last-write-wins para resolución de conflitos',
                ],
            },
            {
                label: 'UX',
                highlight: 'Deseño baseado en psicoloxía do benestar.',
                content: '',
                list: [
                    'Check-in emocional antes de escribir — baixa a fricción en días difíciles',
                    'Modo contemplación: lectura inmersiva con tipografía serif',
                    'Favoritos semánticos (claridade, semente, áncora, vitoria, cicatriz)',
                    'Year in Review estilo Spotify Wrapped',
                    'Nudges intelixentes con prioridade: coidado > insight > celebración',
                ],
            },
            {
                label: 'Stack',
                content: '',
                list: [
                    'Next.js 16 (App Router) + React 19 + TypeScript',
                    'TipTap (rich text), Tailwind 4, shadcn/ui (Radix)',
                    'Vitest + Testing Library (unit) / Playwright (E2E)',
                    'Vercel (deploy) + Sentry (errors) + CSP/HSTS headers',
                ],
                stack: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Dexie', 'TipTap', 'Tailwind', 'Playwright'],
            },
            {
                label: 'Aprendizaxe',
                highlight: 'Ter usuarios reais cambia como pensas o código.',
                content: 'Offline-first con E2EE non é trivial. Migración de esquemas en IndexedDB, resolver conflitos de sync sen ver os datos, xestionar a perda de contrasinal cando é a clave de cifrado.',
            },
        ],
    },
    about: {
        sectionNumber: '04',
        title: 'Sobre min',
        paragraphs: [
            'Impórtanme os <strong>detalles que o usuario non ve pero sente</strong>: tempos de carga, transicións suaves, estados de erro claros.',
            'Penso en <strong>sistemas, non en pantallas</strong>. Cada compoñente é parte dun fluxo de datos, un contrato de API, unha experiencia que debe funcionar sen supervisión.',
            'Non me limito a unha plataforma. Web, mobile nativo, híbrido, backend, infra — vou onde estea o problema.',
        ],
        principlesTitle: 'Como traballo',
        principles: [
            'Código lexible antes que enxeñoso',
            'Tipado forte para reducir erros',
            'Compoñentes con responsabilidades claras',
            'Visión completa: frontend, backend, infra',
        ],
    },
    contact: {
        sectionNumber: '05',
        title: 'Contacto',
        text: 'Busco novos retos onde importe a calidade do código. Equipo, freelance ou colaboración técnica — escríbeme.',
        linkedin: 'LinkedIn',
        github: 'GitHub',
    },
    footer: {
        status: 'Dispoñible para proxectos',
    },
};
