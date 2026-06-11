// ==========================================
// Animations — Portfolio scroll effects
//
// Exporta init() para poder re-ejecutarse tras cada View Transition
// (un import() dinámico solo corre el módulo una vez). Cada init()
// limpia los listeners/observers de la página anterior.
// ==========================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktop = window.innerWidth > 768;

// Con scroll-driven animations (CSS), los reveals no necesitan JS
const supportsScrollTimeline =
    typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');

const cleanupFns: Array<() => void> = [];

function cleanup() {
    cleanupFns.forEach(fn => fn());
    cleanupFns.length = 0;
}

// ==========================================
// 1. Scroll Progress Indicator (rAF-throttled)
// ==========================================
function initScrollProgress() {
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
    const onScroll = () => {
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
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    cleanupFns.push(() => window.removeEventListener('scroll', onScroll));
}

// ==========================================
// 2. Scroll Reveal (fallback IntersectionObserver)
// ==========================================
function initReveals() {
    if (prefersReducedMotion || supportsScrollTimeline) return;

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
    cleanupFns.push(() => revealObserver.disconnect());
}

// ==========================================
// 3. Stagger Effect for Project Items
// ==========================================
function initStagger() {
    if (prefersReducedMotion) return;

    const projectItems = document.querySelectorAll('.home__project') as NodeListOf<HTMLElement>;
    if (projectItems.length === 0) return;

    projectItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(12px)';
        item.style.transition = 'none';
    });

    const projectsSection = document.querySelector('.home__projects');
    if (!projectsSection) return;

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
    cleanupFns.push(() => staggerObserver.disconnect());
}

// ==========================================
// 4. Parallax on Profile Photo (desktop only)
// ==========================================
function initParallax() {
    if (prefersReducedMotion || !isDesktop) return;

    const photo = document.querySelector('.home__photo') as HTMLElement;
    if (!photo) return;

    let parallaxTicking = false;
    const parallaxFactor = 0.05;

    const onScroll = () => {
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
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    cleanupFns.push(() => window.removeEventListener('scroll', onScroll));
}

// ==========================================
// 5. Text Reveal Character-by-Character (.home__name)
// ==========================================
function initNameReveal() {
    if (prefersReducedMotion) return;

    const nameEl = document.querySelector('.home__name') as HTMLElement;
    if (!nameEl || nameEl.classList.contains('char-reveal')) return;

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
    cleanupFns.push(() => nameObserver.disconnect());
}

// ==========================================
// 6. Smooth Section Transitions (fade + slide from below)
// ==========================================
function initSectionReveals() {
    if (prefersReducedMotion) return;

    const sections = document.querySelectorAll('.home__experience, .home__projects, .home__contact') as NodeListOf<HTMLElement>;
    if (sections.length === 0) return;

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
    cleanupFns.push(() => sectionObserver.disconnect());
}

// ==========================================
// 7. Hover Tilt on Project Items (desktop only)
// ==========================================
function initTilt() {
    if (prefersReducedMotion || !isDesktop) return;

    const projectItems = document.querySelectorAll('.home__project') as NodeListOf<HTMLElement>;

    projectItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.willChange = 'transform';
            item.style.transition = '';
        });

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
            item.style.willChange = 'auto';
            requestAnimationFrame(() => {
                item.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
                setTimeout(() => {
                    item.style.transition = '';
                }, 400);
            });
        });
    });
}

// ==========================================
// 8. Cursor-reactive glow de la tarjeta de la home
//    (antes era un script inline: el bucle rAF quedaba vivo
//    tras cada View Transition y el efecto moría al volver)
// ==========================================
function initCardGlow() {
    if (prefersReducedMotion) return;

    const card = document.querySelector('.card') as HTMLElement | null;
    const glow = document.querySelector('.card__glow') as HTMLElement | null;
    if (!card || !glow) return;

    let currentX = 50;
    let currentY = 50;
    let targetX = 50;
    let targetY = 50;
    let rafId = 0;
    let running = false;

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    function tick() {
        currentX = lerp(currentX, targetX, 0.1);
        currentY = lerp(currentY, targetY, 0.1);
        card!.style.setProperty('--glow-x', currentX + '%');
        card!.style.setProperty('--glow-y', currentY + '%');

        // Pausa el bucle cuando llega al objetivo: cero CPU en reposo
        if (Math.abs(currentX - targetX) < 0.1 && Math.abs(currentY - targetY) < 0.1) {
            running = false;
            return;
        }
        rafId = requestAnimationFrame(tick);
    }

    function wake() {
        if (!running) {
            running = true;
            rafId = requestAnimationFrame(tick);
        }
    }

    const onMove = (e: MouseEvent) => {
        const rect = card!.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width) * 100;
        targetY = ((e.clientY - rect.top) / rect.height) * 100;
        wake();
    };

    const onLeave = () => {
        targetX = 50;
        targetY = 50;
        wake();
    };

    const onTilt = (e: DeviceOrientationEvent) => {
        if (e.gamma === null || e.beta === null) return;
        targetX = Math.max(20, Math.min(80, 50 + e.gamma * 0.5));
        targetY = Math.max(20, Math.min(80, 50 + e.beta * 0.3));
        wake();
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    window.addEventListener('deviceorientation', onTilt);

    cleanupFns.push(() => {
        cancelAnimationFrame(rafId);
        running = false;
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
        window.removeEventListener('deviceorientation', onTilt);
    });
}

// ==========================================
// 9. Shimmer del bio tras la entrada
// ==========================================
function initBioShimmer() {
    if (prefersReducedMotion) return;

    const bio = document.querySelector('.card__bio');
    if (!bio) return;

    const t1 = window.setTimeout(() => bio.classList.add('card__bio--shimmer'), 1600);
    const t2 = window.setTimeout(() => {
        bio.classList.remove('card__bio--shimmer');
        bio.querySelectorAll('p').forEach(p => {
            (p as HTMLElement).style.background = 'none';
            (p as HTMLElement).style.webkitTextFillColor = '';
        });
    }, 3200);

    cleanupFns.push(() => {
        clearTimeout(t1);
        clearTimeout(t2);
    });
}

export function init() {
    cleanup();
    initScrollProgress();
    initReveals();
    initStagger();
    initParallax();
    initNameReveal();
    initSectionReveals();
    initTilt();
    initCardGlow();
    initBioShimmer();
}
