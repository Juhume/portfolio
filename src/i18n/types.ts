export type Locale = 'es' | 'en' | 'gl';

export interface ProjectItem {
    title: string;
    description: string;
    category: string;
    badge?: string;
    role: string;
    linkLabel?: string;
}

export interface CaseBlock {
    label: string;
    content: string;
    highlight?: string;
    list?: string[];
    stack?: string[];
}

export interface Translations {
    meta: {
        title: string;
        description: string;
        keywords: string;
        jobTitle: string;
        ogLocale: string;
    };
    a11y: {
        skipToContent: string;
        themeToggleDark: string;
        themeToggleLight: string;
        menuButton: string;
    };
    nav: {
        experience: string;
        projects: string;
        caseStudy: string;
        about: string;
        contact: string;
    };
    hero: {
        label: string;
        title: string;
        subtitle: string;
        ctaPrimary: string;
        ctaSecondary: string;
        scroll: string;
    };
    experience: {
        sectionNumber: string;
        title: string;
        company: string;
        period: string;
        role: string;
        context: string;
        achievementsTitle: string;
        achievements: string[];
        stack: string[];
    };
    projects: {
        sectionNumber: string;
        title: string;
        subtitle: string;
        items: ProjectItem[];
    };
    caseStudy: {
        sectionNumber: string;
        title: string;
        blocks: CaseBlock[];
    };
    about: {
        sectionNumber: string;
        title: string;
        paragraphs: string[];
        principlesTitle: string;
        principles: string[];
    };
    contact: {
        sectionNumber: string;
        title: string;
        text: string;
        linkedin: string;
        github: string;
    };
    footer: {
        status: string;
    };
}

export interface SectionIds {
    experience: string;
    projects: string;
    caseStudy: string;
    about: string;
    contact: string;
}
