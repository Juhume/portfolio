import type { Translations } from '../types';

export const en: Translations = {
    meta: {
        title: 'Julio Huerta | Developer · Web, Mobile & Product',
        description: 'Developer with 5+ years at BBVA (web, native mobile and hybrid) and side products with real users.',
        keywords: 'developer, mobile, web, Kotlin, Swift, LitElement, TypeScript, React, Next.js, BBVA',
        jobTitle: 'Developer — Web, Mobile & Product',
        ogLocale: 'en_US',
    },
    a11y: {
        skipToContent: 'Skip to content',
        themeToggleDark: 'Switch to dark theme',
        themeToggleLight: 'Switch to light theme',
        menuButton: 'Menu',
    },
    nav: {
        experience: 'Experience',
        projects: 'Projects',
        caseStudy: 'Case study',
        about: 'About',
        contact: 'Contact',
    },
    hero: {
        label: 'Developer · 5+ years in digital banking',
        title: 'I build products that work in the real world.',
        subtitle: 'From web to native mobile, from release management to leading a hybrid migration. Outside the bank, I build my own products with real users.',
        ctaPrimary: 'See experience',
        ctaSecondary: 'My products',
        scroll: 'Scroll',
    },
    experience: {
        sectionNumber: '01',
        title: 'Experience',
        company: 'BBVA',
        period: '2019 — Present',
        role: 'Web → Release Manager → Mobile → Hybrid',
        context: 'BBVA Business: the app companies use to operate with the bank. An environment where every error has real consequences and deployments are controlled.',
        achievementsTitle: 'Timeline',
        achievements: [
            'Core web development team (2019–2020)',
            'Release manager: coordinating deliveries and deployments (2020)',
            'Native mobile development (Kotlin, Java, Swift, Objective-C) with hybrid part in LitElement (2020–2024)',
            'Leading the migration to a fully hybrid application (2025)',
        ],
        stack: ['Kotlin', 'Swift', 'LitElement', 'TypeScript', 'Java', 'Objective-C'],
    },
    projects: {
        sectionNumber: '02',
        title: 'Side projects',
        subtitle: 'What I build outside of work. Products with real users.',
        items: [
            {
                title: 'Espejo',
                description: 'Offline-first personal journal with E2E encryption and optional sync. Design based on well-being psychology, not gamification.',
                category: 'Own product',
                badge: 'Real users',
                role: 'Full-Stack',
                linkLabel: 'See technical deep dive',
            },
            {
                title: 'DiploTest',
                description: 'Testing platform for diplomatic exam candidates. Topic-based tests, stats and progress tracking.',
                category: 'Own product',
                badge: 'Real users',
                role: 'Full-Stack',
            },
            {
                title: 'Homelab',
                description: 'Personal infrastructure with apps, databases, reverse proxy and monitoring. Reproducible environments with Docker.',
                category: 'Infrastructure',
                role: 'DevOps',
            },
        ],
    },
    caseStudy: {
        sectionNumber: '03',
        title: 'Deep dive: Espejo',
        blocks: [
            {
                label: 'Problem',
                content: 'Journaling apps create pressure with streaks and gamification. And none offer real privacy: your thoughts live in plain text on third-party servers.',
            },
            {
                label: 'Architecture',
                highlight: 'Offline-first with optional sync. The server never sees the content.',
                content: '',
                list: [
                    'IndexedDB (Dexie) as source of truth — works without connection',
                    'AES-256-GCM + PBKDF2 (310k iterations) encryption on client',
                    'Supabase for optional cross-device sync (encrypted blobs only)',
                    'Soft-delete + last-write-wins for conflict resolution',
                ],
            },
            {
                label: 'UX',
                highlight: 'Design based on well-being psychology.',
                content: '',
                list: [
                    'Emotional check-in before writing — lowers friction on hard days',
                    'Contemplation mode: immersive reading with serif typography',
                    'Semantic favorites (clarity, seed, anchor, victory, scar)',
                    'Year in Review, Spotify Wrapped style',
                    'Smart nudges with priority: care > insight > celebration',
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
                label: 'Learnings',
                highlight: 'Having real users changes how you think about code.',
                content: 'Offline-first with E2EE is not trivial. IndexedDB schema migrations, resolving sync conflicts without seeing the data, handling password loss when it\'s the encryption key.',
            },
        ],
    },
    about: {
        sectionNumber: '04',
        title: 'About me',
        paragraphs: [
            'I care about the <strong>details the user doesn\'t see but feels</strong>: load times, smooth transitions, clear error states.',
            'I think in <strong>systems, not screens</strong>. Every component is part of a data flow, an API contract, an experience that must work unsupervised.',
            'I don\'t limit myself to one platform. Web, native mobile, hybrid, backend, infra — I go where the problem is.',
        ],
        principlesTitle: 'How I work',
        principles: [
            'Readable code over clever code',
            'Strong typing to reduce errors',
            'Components with clear responsibilities',
            'Full picture: frontend, backend, infra',
        ],
    },
    contact: {
        sectionNumber: '05',
        title: 'Contact',
        text: 'Looking for new challenges where code quality matters. Team, freelance or technical collaboration — write to me.',
        linkedin: 'LinkedIn',
        github: 'GitHub',
    },
    footer: {
        status: 'Available for projects',
    },
};
