// ==========================================
// Cover Flow — iPod-style 3D carousel
// ==========================================

export interface CoverFlowOptions {
    /** Initial active index (default: 0) */
    startIndex?: number;
    /** Callback when active slide changes */
    onChange?: (index: number) => void;
    /** Enable haptic feedback (default: true) */
    haptics?: boolean;
    /** Minimum swipe distance in px to trigger navigation (default: 50) */
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
        swipeThreshold = 50,
    } = options;

    const items = Array.from(container.querySelectorAll<HTMLElement>('.cf-item'));
    if (items.length === 0) return { goTo: () => {}, destroy: () => {}, getIndex: () => 0 };

    let current = Math.min(startIndex, items.length - 1);
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    // ---- Haptics ----
    async function triggerHaptic() {
        if (!haptics) return;
        try {
            const { trigger } = await import('web-haptics');
            trigger('selection');
        } catch {
            // Not supported — ignore
        }
    }

    // ---- Apply transforms ----
    function applyTransforms() {
        items.forEach((item, i) => {
            const offset = i - current;
            const absOffset = Math.abs(offset);

            // Reset classes
            item.classList.remove('cf-item--active', 'cf-item--left', 'cf-item--right');

            if (offset === 0) {
                // Center card
                item.classList.add('cf-item--active');
                item.style.transform = 'translateX(0) rotateY(0deg) scale(1)';
                item.style.zIndex = String(items.length);
                item.style.opacity = '1';
                item.style.filter = 'brightness(1)';
            } else if (offset < 0) {
                // Left cards
                item.classList.add('cf-item--left');
                const shift = offset * 180;
                const rotate = Math.min(45, 30 + absOffset * 5);
                const scale = Math.max(0.6, 0.8 - (absOffset - 1) * 0.08);
                const opacity = Math.max(0.2, 1 - absOffset * 0.25);
                item.style.transform = `translateX(${shift}px) rotateY(${rotate}deg) scale(${scale})`;
                item.style.zIndex = String(items.length - absOffset);
                item.style.opacity = String(opacity);
                item.style.filter = `brightness(${Math.max(0.6, 1 - absOffset * 0.12)})`;
            } else {
                // Right cards
                item.classList.add('cf-item--right');
                const shift = offset * 180;
                const rotate = -Math.min(45, 30 + absOffset * 5);
                const scale = Math.max(0.6, 0.8 - (absOffset - 1) * 0.08);
                const opacity = Math.max(0.2, 1 - absOffset * 0.25);
                item.style.transform = `translateX(${shift}px) rotateY(${rotate}deg) scale(${scale})`;
                item.style.zIndex = String(items.length - absOffset);
                item.style.opacity = String(opacity);
                item.style.filter = `brightness(${Math.max(0.6, 1 - absOffset * 0.12)})`;
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

    // ---- Keyboard navigation ----
    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    }

    // ---- Touch/swipe ----
    function handleTouchStart(e: TouchEvent) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = true;
    }

    function handleTouchEnd(e: TouchEvent) {
        if (!isSwiping) return;
        isSwiping = false;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;

        // Only count horizontal swipes (not scrolls)
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > swipeThreshold) {
            if (dx > 0) prev();
            else next();
        }
    }

    // ---- Click on side card to navigate ----
    function handleItemClick(e: Event) {
        const target = (e.currentTarget as HTMLElement);
        const index = items.indexOf(target);
        if (index === -1) return;

        if (index === current) {
            // Click on center card — let the link handle it (don't prevent default)
            return;
        }

        // Click on side card — navigate to it
        e.preventDefault();
        goTo(index);
    }

    // ---- Bind events ----
    document.addEventListener('keydown', handleKeydown);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    items.forEach(item => {
        item.addEventListener('click', handleItemClick);
    });

    // Initial render
    goTo(current, true);

    // ---- Public API ----
    function destroy() {
        document.removeEventListener('keydown', handleKeydown);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
        items.forEach(item => item.removeEventListener('click', handleItemClick));
    }

    return {
        goTo: (i: number) => goTo(i),
        destroy,
        getIndex: () => current,
    };
}
