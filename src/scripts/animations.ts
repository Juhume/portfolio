// Scroll progress indicator (rAF-throttled)
const scrollProgress = document.querySelector('.scroll-progress') as HTMLElement;
if (scrollProgress) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = (window.scrollY / docHeight) * 100;
                scrollProgress.style.width = `${Math.min(progress, 100)}%`;
                ticking = false;
            });
            ticking = true;
        }
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

