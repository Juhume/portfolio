// Navigation scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav?.classList.add('scrolled');
    } else {
        nav?.classList.remove('scrolled');
    }
});

// Mobile Menu
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = mobileMenu?.querySelectorAll('.mobile-menu__link');

menuBtn?.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu?.classList.toggle('active');
    document.body.style.overflow = mobileMenu?.classList.contains('active') ? 'hidden' : '';
});

mobileLinks?.forEach(link => {
    link.addEventListener('click', () => {
        menuBtn?.classList.remove('active');
        mobileMenu?.classList.remove('active');
        document.body.style.overflow = '';
    });
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
