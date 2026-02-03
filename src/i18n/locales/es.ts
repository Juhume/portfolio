import type { Translations } from '../types';

export const es: Translations = {
    meta: {
        title: 'Julio Huerta | Desarrollador · Web, Mobile y Producto',
        description: 'Desarrollador con +5 años en BBVA (web, mobile nativo e híbrido) y productos propios con usuarios reales.',
        keywords: 'desarrollador, mobile, web, Kotlin, Swift, LitElement, TypeScript, React, Next.js, BBVA',
        jobTitle: 'Desarrollador — Web, Mobile y Producto',
        ogLocale: 'es_ES',
    },
    a11y: {
        skipToContent: 'Saltar al contenido',
        themeToggleDark: 'Cambiar a tema oscuro',
        themeToggleLight: 'Cambiar a tema claro',
        menuButton: 'Menu',
    },
    nav: {
        experience: 'Experiencia',
        projects: 'Proyectos',
        caseStudy: 'Caso',
        about: 'Sobre mi',
        contact: 'Contacto',
    },
    hero: {
        label: 'Desarrollador · +5 años en banca digital',
        title: 'Construyo productos que funcionan en el mundo real.',
        subtitle: 'De web a mobile nativo, de release management a liderar una migración híbrida. Fuera del banco, creo productos propios con usuarios reales.',
        ctaPrimary: 'Ver experiencia',
        ctaSecondary: 'Mis productos',
        scroll: 'Scroll',
    },
    experience: {
        sectionNumber: '01',
        title: 'Experiencia',
        company: 'BBVA',
        period: '2019 — Presente',
        role: 'Web → Release Manager → Mobile → Híbrido',
        context: 'BBVA Empresas: la app que usan las empresas para operar con el banco. Entorno donde cada error tiene consecuencias reales y los despliegues son controlados.',
        achievementsTitle: 'Trayectoria',
        achievements: [
            'Equipo Core de desarrollo web (2019–2020)',
            'Release manager: coordinación de entregas y despliegues (2020)',
            'Desarrollo mobile nativo (Kotlin, Java, Swift, Objective-C) con parte híbrida en LitElement (2020–2024)',
            'Liderando la migración a una aplicación totalmente híbrida (2025)',
        ],
        stack: ['Kotlin', 'Swift', 'LitElement', 'TypeScript', 'Java', 'Objective-C'],
    },
    projects: {
        sectionNumber: '02',
        title: 'Productos propios',
        subtitle: 'Lo que construyo fuera del trabajo. Productos con usuarios reales.',
        items: [
            {
                title: 'Espejo',
                description: 'Diario personal offline-first con cifrado E2E y sync opcional. Diseño basado en psicología del bienestar, no en gamificación.',
                category: 'Producto propio',
                badge: 'Usuarios reales',
                role: 'Full-Stack',
                linkLabel: 'Ver deep dive técnico',
            },
            {
                title: 'DiploTest',
                description: 'Plataforma de tests para opositores diplomáticos. Tests por temas, estadísticas y seguimiento de progreso.',
                category: 'Producto propio',
                badge: 'Usuarios reales',
                role: 'Full-Stack',
            },
            {
                title: 'Homelab',
                description: 'Infraestructura personal con apps, bases de datos, reverse proxy y monitoring. Entornos reproducibles con Docker.',
                category: 'Infraestructura',
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
                content: 'Las apps de journaling generan presión con rachas y gamificación. Y ninguna ofrece privacidad real: tus pensamientos viven en texto plano en servidores de terceros.',
            },
            {
                label: 'Arquitectura',
                highlight: 'Offline-first con sync opcional. El servidor nunca ve el contenido.',
                content: '',
                list: [
                    'IndexedDB (Dexie) como fuente de verdad — funciona sin conexión',
                    'Cifrado AES-256-GCM + PBKDF2 (310k iteraciones) en cliente',
                    'Supabase para sync opcional entre dispositivos (solo blobs cifrados)',
                    'Soft-delete + last-write-wins para resolución de conflictos',
                ],
            },
            {
                label: 'UX',
                highlight: 'Diseño basado en psicología del bienestar.',
                content: '',
                list: [
                    'Check-in emocional antes de escribir — baja la fricción en días difíciles',
                    'Modo contemplación: lectura inmersiva con tipografía serif',
                    'Favoritos semánticos (claridad, semilla, ancla, victoria, cicatriz)',
                    'Year in Review estilo Spotify Wrapped',
                    'Nudges inteligentes con prioridad: cuidado > insight > celebración',
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
                label: 'Aprendizaje',
                highlight: 'Tener usuarios reales cambia cómo piensas el código.',
                content: 'Offline-first con E2EE no es trivial. Migración de esquemas en IndexedDB, resolver conflictos de sync sin ver los datos, gestionar la pérdida de contraseña cuando es la clave de cifrado.',
            },
        ],
    },
    about: {
        sectionNumber: '04',
        title: 'Sobre mi',
        paragraphs: [
            'Me importan los <strong>detalles que el usuario no ve pero siente</strong>: tiempos de carga, transiciones suaves, estados de error claros.',
            'Pienso en <strong>sistemas, no en pantallas</strong>. Cada componente es parte de un flujo de datos, un contrato de API, una experiencia que debe funcionar sin supervisión.',
            'No me limito a una plataforma. Web, mobile nativo, híbrido, backend, infra — voy donde esté el problema.',
        ],
        principlesTitle: 'Cómo trabajo',
        principles: [
            'Código legible antes que ingenioso',
            'Tipado fuerte para reducir errores',
            'Componentes con responsabilidades claras',
            'Visión completa: frontend, backend, infra',
        ],
    },
    contact: {
        sectionNumber: '05',
        title: 'Contacto',
        text: 'Busco nuevos retos donde importe la calidad del código. Equipo, freelance o colaboración técnica — escríbeme.',
        linkedin: 'LinkedIn',
        github: 'GitHub',
    },
    footer: {
        status: 'Disponible para proyectos',
    },
};
