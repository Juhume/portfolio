// ==========================================
// Cover Flow — iPod-style 3D carousel
// ==========================================
import { WebHaptics } from 'web-haptics';

export interface CoverFlowOptions {
    startIndex?: number;
    onChange?: (index: number) => void;
    haptics?: boolean;
    swipeThreshold?: number;
}

export function initCoverFlow(
    container: HTMLElement,
    options: CoverFlowOptions = {}
): { goTo: (i: number) => void; destroy: () => void; getIndex: () => number } {
    const {
        startIndex = 0,
        onChange,
        haptics = true,
        swipeThreshold = 40,
    } = options;

    const items = Array.from(container.querySelectorAll<HTMLElement>('.cf-item'));
    if (items.length === 0) return { goTo: () => {}, destroy: () => {}, getIndex: () => 0 };

    let current = Math.min(startIndex, items.length - 1);
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    // ---- Haptics (correct API) ----
    let hapticsInstance: any = null;
    if (haptics && WebHaptics.isSupported) {
        try {
            hapticsInstance = new WebHaptics();
        } catch { /* not supported */ }
    }

    function triggerHaptic() {
        if (!hapticsInstance) return;
        try {
            // Very subtle "click wheel" haptic — premium, barely-there feel
            hapticsInstance.trigger([{ duration: 8, intensity: 0.3 }]);
        } catch { /* ignore */ }
    }

    // ---- Apply transforms (Apple Cover Flow style) ----
    function applyTransforms() {
        const isMobile = window.innerWidth < 600;
        const spacing = isMobile ? 60 : 80;

        items.forEach((item, i) => {
            const offset = i - current;
            const absOffset = Math.abs(offset);

            item.classList.remove('cf-item--active', 'cf-item--left', 'cf-item--right');

            if (offset === 0) {
                // Center card: flat, front-facing, elevated
                item.classList.add('cf-item--active');
                item.style.transform = 'translateX(0) translateZ(90px) rotateY(0deg) scale(1)';
                item.style.zIndex = String(items.length + 1);
                item.style.opacity = '1';
                item.style.pointerEvents = 'auto';
            } else {
                // Side cards: constant ±70° rotation, tightly spaced
                const dir = offset > 0 ? 'right' : 'left';
                item.classList.add(`cf-item--${dir}`);

                const sign = offset > 0 ? 1 : -1;
                const rotate = sign * 70; // Constant 70° angle for all side cards
                const shift = offset * spacing;
                
                // Scale: 0.85 for immediate neighbors, smaller for further
                const scale = absOffset === 1 ? 0.85 : Math.max(0.6, 0.85 - (absOffset - 1) * 0.12);
                
                // Opacity: center 1, immediate side 0.7, further down to 0.2
                const opacity = absOffset === 1 ? 0.7 : Math.max(0.2, 0.7 - (absOffset - 1) * 0.25);
                
                // Z-recession: immediate neighbors -120px, further -200px+
                const zShift = absOffset === 1 ? -120 : -200 - (absOffset - 2) * 50;

                item.style.transform = `translateX(${shift}px) translateZ(${zShift}px) rotateY(${rotate}deg) scale(${scale})`;
                item.style.zIndex = String(items.length - absOffset);
                item.style.opacity = String(opacity);
                item.style.pointerEvents = absOffset <= 1 ? 'auto' : 'none';
            }
        });
    }

    function goTo(index: number, silent = false) {
        const clamped = Math.max(0, Math.min(index, items.length - 1));
        if (clamped === current && !silent) return;
        const changed = clamped !== current;
        current = clamped;
        applyTransforms();

        if (changed) {
            if (!silent) triggerHaptic();
            onChange?.(current);
            container.dispatchEvent(new CustomEvent('coverflow:change', { detail: { index: current } }));
        }
    }

    function prev() { goTo(current - 1); }
    function next() { goTo(current + 1); }

    // ---- Keyboard ----
    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    }

    // ---- Touch/swipe (improved for mobile) ----
    function handleTouchStart(e: TouchEvent) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }

    function handleTouchEnd(e: TouchEvent) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        const dt = Date.now() - touchStartTime;

        // Horizontal swipe with velocity check
        if (Math.abs(dx) > Math.abs(dy) * 1.2 && Math.abs(dx) > swipeThreshold) {
            e.preventDefault();
            if (dx > 0) prev();
            else next();
        }
    }

    // Prevent vertical scroll during horizontal swipe
    function handleTouchMove(e: TouchEvent) {
        const dx = Math.abs(e.touches[0].clientX - touchStartX);
        const dy = Math.abs(e.touches[0].clientY - touchStartY);
        if (dx > dy * 1.2 && dx > 10) {
            e.preventDefault();
        }
    }

    // ---- Click on side card ----
    function handleItemClick(this: HTMLElement, e: Event) {
        const index = items.indexOf(this);
        if (index === -1 || index === current) return;
        e.preventDefault();
        e.stopPropagation();
        goTo(index);
    }

    // ---- Bind events ----
    document.addEventListener('keydown', handleKeydown);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    items.forEach(item => {
        item.addEventListener('click', handleItemClick);
    });

    // Initial render
    goTo(current, true);

    // Recalculate on resize
    let resizeTimeout: ReturnType<typeof setTimeout>;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => applyTransforms(), 100);
    }
    window.addEventListener('resize', handleResize);

    // ---- Cleanup ----
    function destroy() {
        document.removeEventListener('keydown', handleKeydown);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
        container.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('resize', handleResize);
        items.forEach(item => item.removeEventListener('click', handleItemClick));
        if (hapticsInstance) {
            try { hapticsInstance.destroy(); } catch {}
        }
    }

    return {
        goTo: (i: number) => goTo(i),
        destroy,
        getIndex: () => current,
    };
}
