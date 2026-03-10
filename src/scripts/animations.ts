// ==========================================
// Animations — Portfolio scroll effects
// ==========================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktop = window.innerWidth > 768;

// ==========================================
// 1. Scroll Progress Indicator (rAF-throttled)
// ==========================================
(() => {
    // Create progress bar if it doesn't exist
    let scrollProgress = document.querySelector('.scroll-progress') as HTMLElement;
    if (!scrollProgress) {
        scrollProgress = document.createElement('div');
        scrollProgress.className = 'scroll-progress';
        document.body.prepend(scrollProgress);
    }

    if (prefersReducedMotion) {
        scrollProgress.style.display = 'none';
        return;
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                if (docHeight > 0) {
                    const progress = (window.scrollY / docHeight) * 100;
                    scrollProgress.style.transform = `scaleX(${Math.min(progress / 100, 1)})`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

// ==========================================
// 2. Scroll Reveal (existing — IntersectionObserver)
// ==========================================
if (!prefersReducedMotion) {
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
}

// ==========================================
// 3. Stagger Effect for Project Items
// ==========================================
if (!prefersReducedMotion) {
    const projectItems = document.querySelectorAll('.home__project') as NodeListOf<HTMLElement>;

    if (projectItems.length > 0) {
        // Set initial state
        projectItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(12px)';
            item.style.transition = 'none';
        });

        const projectsSection = document.querySelector('.home__projects');
        if (projectsSection) {
            const staggerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        projectItems.forEach((item, index) => {
                            setTimeout(() => {
                                item.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, index * 100);
                        });
                        staggerObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            staggerObserver.observe(projectsSection);
        }
    }
}

// ==========================================
// 4. Parallax on Profile Photo (desktop only)
// ==========================================
if (!prefersReducedMotion && isDesktop) {
    const photo = document.querySelector('.home__photo') as HTMLElement;
    if (photo) {
        let parallaxTicking = false;
        const parallaxFactor = 0.05;

        window.addEventListener('scroll', () => {
            if (!parallaxTicking) {
                requestAnimationFrame(() => {
                    const rect = photo.getBoundingClientRect();
                    const viewportCenter = window.innerHeight / 2;
                    const elementCenter = rect.top + rect.height / 2;
                    const offset = (elementCenter - viewportCenter) * parallaxFactor;
                    photo.style.transform = `translateY(${offset}px)`;
                    parallaxTicking = false;
                });
                parallaxTicking = true;
            }
        }, { passive: true });
    }
}

// ==========================================
// 5. Text Reveal Character-by-Character (.home__name)
// ==========================================
if (!prefersReducedMotion) {
    const nameEl = document.querySelector('.home__name') as HTMLElement;
    if (nameEl) {
        const text = nameEl.textContent || '';
        nameEl.textContent = '';
        nameEl.classList.add('char-reveal');

        // Wrap each character in a span, grouping by word to prevent mid-word breaks
        const chars: HTMLSpanElement[] = [];
        const words = text.split(' ');
        words.forEach((word, wordIdx) => {
            const wordWrap = document.createElement('span');
            wordWrap.style.whiteSpace = 'nowrap';
            wordWrap.style.display = 'inline-block';
            for (const char of word) {
                const span = document.createElement('span');
                span.className = 'char-reveal__char';
                span.textContent = char;
                wordWrap.appendChild(span);
                chars.push(span);
            }
            // Add right margin for word spacing (since inline-block collapses whitespace)
            if (wordIdx < words.length - 1) {
                wordWrap.style.marginRight = '0.3em';
            }
            nameEl.appendChild(wordWrap);
        });

        const nameObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    chars.forEach((span, i) => {
                        setTimeout(() => {
                            span.classList.add('char-reveal__char--visible');
                        }, i * 38);
                    });
                    nameObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        nameObserver.observe(nameEl);
    }
}

// ==========================================
// 6. Smooth Section Transitions (fade + slide from below)
// ==========================================
if (!prefersReducedMotion) {
    const sections = document.querySelectorAll('.home__experience, .home__projects, .home__contact') as NodeListOf<HTMLElement>;

    sections.forEach(section => {
        section.classList.add('section-reveal');
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-reveal--visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// ==========================================
// 7. Hover Tilt on Project Items (desktop only)
// ==========================================
if (!prefersReducedMotion && isDesktop) {
    const projectItems = document.querySelectorAll('.home__project') as NodeListOf<HTMLElement>;

    projectItems.forEach(item => {
        item.addEventListener('mouseenter', () => { item.style.willChange = 'transform'; });
        item.addEventListener('mouseleave', () => { item.style.willChange = 'auto'; });

        item.addEventListener('mousemove', (e: MouseEvent) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Max 1.5 degrees rotation — very subtle
            const rotateX = ((y - centerY) / centerY) * -1.5;
            const rotateY = ((x - centerX) / centerX) * 1.5;

            requestAnimationFrame(() => {
                item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        });

        item.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                item.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
                // Reset transition after animation completes
                setTimeout(() => {
                    item.style.transition = '';
                }, 400);
            });
        });

        item.addEventListener('mouseenter', () => {
            item.style.transition = '';
        });
    });
}
