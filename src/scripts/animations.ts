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

// Hero parallax with depth layers
const heroShapes = document.querySelectorAll('.hero__shape') as NodeListOf<HTMLElement>;
const heroContent = document.querySelector('.hero__content') as HTMLElement;
const heroScroll = document.querySelector('.hero__scroll') as HTMLElement;
const heroMesh = document.querySelector('.hero__mesh') as HTMLElement;

if (heroShapes.length > 0) {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const heroHeight = window.innerHeight;

                if (scrollY < heroHeight) {
                    const progress = scrollY / heroHeight;

                    heroShapes.forEach((shape, i) => {
                        const speed = 0.2 + i * 0.18;
                        const rotate = (i % 2 === 0 ? 1 : -1) * progress * 8;
                        const scale = 1 - progress * 0.1 * (i + 1) * 0.3;
                        shape.style.transform = `translateY(${scrollY * speed}px) rotate(${rotate}deg) scale(${scale})`;
                    });

                    if (heroContent) {
                        heroContent.style.transform = `translateY(${scrollY * 0.12}px)`;
                        heroContent.style.opacity = `${1 - progress * 1.2}`;
                    }

                    if (heroMesh) {
                        heroMesh.style.opacity = `${0.4 * (1 - progress * 0.6)}`;
                    }
                }

                if (heroScroll) {
                    if (scrollY > 80) {
                        heroScroll.classList.add('hidden');
                    } else {
                        heroScroll.classList.remove('hidden');
                    }
                }

                ticking = false;
            });
            ticking = true;
        }
    });
}

// Hero interactive mesh - mouse tracking
const heroSection = document.querySelector('.hero') as HTMLElement;
const heroMeshEl = document.querySelector('.hero__mesh') as HTMLElement;

if (heroSection && heroMeshEl && window.matchMedia('(hover: hover)').matches) {
    heroSection.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = heroSection.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        heroMeshEl.style.background = `
            radial-gradient(ellipse at ${x}% ${y}%, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 50%),
            radial-gradient(ellipse at ${100 - x}% ${100 - y}%, color-mix(in srgb, var(--blue) 8%, transparent) 0%, transparent 50%),
            radial-gradient(ellipse at ${x * 0.5 + 25}% ${y * 0.5 + 25}%, color-mix(in srgb, var(--sage) 6%, transparent) 0%, transparent 50%)
        `;
    });
}

// Hero rotating words
const rotateWords = document.querySelectorAll('.hero__rotate-word');
if (rotateWords.length > 1) {
    let currentWord = 0;
    setInterval(() => {
        const prev = rotateWords[currentWord] as HTMLElement;
        prev.classList.remove('active');
        prev.classList.add('exit');
        currentWord = (currentWord + 1) % rotateWords.length;
        const next = rotateWords[currentWord] as HTMLElement;
        next.classList.remove('exit');
        next.classList.add('active');
        setTimeout(() => prev.classList.remove('exit'), 500);
    }, 2800);
}

// Text decode/scramble effect
const decodeElements = document.querySelectorAll('[data-decode]') as NodeListOf<HTMLElement>;
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

decodeElements.forEach(el => {
    const originalText = el.textContent?.trim() || '';
    const length = originalText.length;
    let frame = 0;
    const totalFrames = length * 1.5;

    const scramble = () => {
        let output = '';
        for (let i = 0; i < length; i++) {
            if (originalText[i] === ' ') {
                output += ' ';
            } else if (i < frame) {
                output += originalText[i];
            } else {
                output += chars[Math.floor(Math.random() * chars.length)];
            }
        }
        el.textContent = output;
        frame += 0.8;
        if (frame < totalFrames) {
            requestAnimationFrame(scramble);
        } else {
            el.textContent = originalText;
        }
    };

    // Start after the hero reveal animation delay
    setTimeout(scramble, 1200);
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

// Magnetic effect on buttons
document.querySelectorAll('.btn').forEach(btn => {
    const el = btn as HTMLElement;
    el.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = '';
    });
});

// 3D Tilt effect on project visuals
document.querySelectorAll('.project__visual').forEach(card => {
    const el = card as HTMLElement;
    el.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.5s var(--ease-out)';
        setTimeout(() => el.style.transition = '', 500);
    });
    el.addEventListener('mouseenter', () => {
        el.style.transition = 'none';
    });
});

// Custom Cursor with smoother trail
const cursor = document.querySelector('.cursor') as HTMLElement;

if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animate = () => {
        const ease = 0.12;
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animate);
    };
    animate();

    document.querySelectorAll('[data-hover]').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    document.querySelectorAll('.project__visual').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor--project'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--project'));
    });

    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
}
