// Scroll reveal
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
revealOnScroll();

// Hero parallax
const heroShapes = document.querySelectorAll('.hero__shape') as NodeListOf<HTMLElement>;
const heroContent = document.querySelector('.hero__content') as HTMLElement;

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
    });
}

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

    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
}
