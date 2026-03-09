export type Locale = 'es' | 'en' | 'gl';

export interface ProjectItem {
    title: string;
    description: string;
    category: string;
    badge?: string;
    role: string;
    proof: string;
    highlights: string[];
    linkLabel?: string;
    linkUrl?: string;
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
        mainNavigation: string;
        mobileMenuLabel: string;
    };
    nav: {
        experience: string;
        projects: string;
        caseStudy: string;
        about: string;
        contact: string;
        blog: string;
    };
    hero: {
        label: string;
        title: string;
        subtitle: string;
        proofs: string[];
        noteTitle: string;
        noteText: string;
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
        signalsTitle: string;
        signals: string[];
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
        intro: string;
        cta: string;
        pageEyebrow: string;
        pageSummary: string;
        pageHighlights: string[];
        pageMetaTitle: string;
        pageMetaDescription: string;
        backToHome: string;
        blocks: CaseBlock[];
    };
    about: {
        sectionNumber: string;
        title: string;
        photoAlt: string;
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
    blog: {
        title: string;
        subtitle: string;
        readMore: string;
        backToBlog: string;
        publishedOn: string;
        minRead: string;
        noPosts: string;
        spanishOnlyTitle: string;
        spanishOnlyText: string;
        readInSpanish: string;
        unavailableInLocale: string;
    };
    notFound: {
        title: string;
        text: string;
        backHome: string;
    };
}

export interface SectionIds {
    experience: string;
    projects: string;
    caseStudy: string;
    about: string;
    contact: string;
}
