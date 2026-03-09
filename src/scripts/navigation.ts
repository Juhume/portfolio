// Navigation scroll effect (rAF-throttled)
const nav = document.getElementById('nav');
let navTicking = false;
window.addEventListener('scroll', () => {
    if (!navTicking) {
        requestAnimationFrame(() => {
            if (window.scrollY > 50) {
                nav?.classList.add('scrolled');
            } else {
                nav?.classList.remove('scrolled');
            }
            navTicking = false;
        });
        navTicking = true;
    }
}, { passive: true });

// Mobile Menu
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = mobileMenu?.querySelectorAll('.mobile-menu__link');

function openMenu() {
    menuBtn?.classList.add('active');
    menuBtn?.setAttribute('aria-expanded', 'true');
    mobileMenu?.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Focus first link after transition
    const firstLink = mobileMenu?.querySelector('.mobile-menu__link') as HTMLElement;
    setTimeout(() => firstLink?.focus(), 100);
}

function closeMenu() {
    menuBtn?.classList.remove('active');
    menuBtn?.setAttribute('aria-expanded', 'false');
    mobileMenu?.classList.remove('active');
    document.body.style.overflow = '';
    menuBtn?.focus();
}

menuBtn?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.contains('active');
    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
});

mobileLinks?.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
        closeMenu();
    }
});

// Focus trap within mobile menu
mobileMenu?.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !mobileLinks?.length) return;

    const firstLink = mobileLinks[0] as HTMLElement;
    const lastLink = mobileLinks[mobileLinks.length - 1] as HTMLElement;

    if (e.shiftKey && document.activeElement === firstLink) {
        e.preventDefault();
        lastLink.focus();
    } else if (!e.shiftKey && document.activeElement === lastLink) {
        e.preventDefault();
        firstLink.focus();
    }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
        if (href) {
            const target = document.querySelector(href);
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Active nav link based on scroll position
const navLinks = document.querySelectorAll('.nav__link') as NodeListOf<HTMLAnchorElement>;
const sections = document.querySelectorAll('section[id]');

if (navLinks.length > 0 && sections.length > 0) {
    let currentActiveId = '';

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentActiveId = entry.target.getAttribute('id') || '';
                navLinks.forEach(link => {
                    const href = link.getAttribute('href') || '';
                    const linkTarget = href.includes('#') ? href.split('#')[1] : '';
                    link.classList.toggle('active', linkTarget === currentActiveId);
                });
            }
        });
    }, { threshold: 0.15, rootMargin: '-10% 0px -40% 0px' });

    sections.forEach(section => sectionObserver.observe(section));
}
