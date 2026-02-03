// Scroll progress indicator
const scrollProgress = document.querySelector('.scroll-progress') as HTMLElement;
if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / docHeight) * 100;
        scrollProgress.style.width = `${Math.min(progress, 100)}%`;
    }, { passive: true });
}

// Scroll reveal with IntersectionObserver
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
});

// Section number count-up animation
const sectionNumbers = document.querySelectorAll('.section__number');
const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const target = parseInt(el.textContent || '0', 10);
            let current = 0;
            const duration = 800;
            const start = performance.now();

            const animate = (now: number) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                current = Math.round(eased * target);
                el.textContent = String(current).padStart(2, '0');
                if (progress < 1) requestAnimationFrame(animate);
            };

            el.textContent = '00';
            requestAnimationFrame(animate);
            numberObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

sectionNumbers.forEach(el => numberObserver.observe(el));
