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

// Hero parallax
const heroShapes = document.querySelectorAll('.hero__shape') as NodeListOf<HTMLElement>;
const heroContent = document.querySelector('.hero__content') as HTMLElement;
const heroScroll = document.querySelector('.hero__scroll') as HTMLElement;

if (heroShapes.length > 0) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;

        if (scrollY < heroHeight) {
            heroShapes.forEach((shape, i) => {
                const speed = 0.3 + i * 0.15;
                shape.style.transform = `translateY(${scrollY * speed}px)`;
            });
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrollY * 0.1}px)`;
                heroContent.style.opacity = `${1 - scrollY / heroHeight}`;
            }
        }

        if (heroScroll) {
            if (scrollY > 80) {
                heroScroll.classList.add('hidden');
            } else {
                heroScroll.classList.remove('hidden');
            }
        }
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
