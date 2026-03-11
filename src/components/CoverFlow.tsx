'use client';

import { useState, useCallback, useEffect, useRef, type FC, type CSSProperties } from 'react';
import { WebHaptics } from 'web-haptics';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

export interface Project {
  image?: string;
  title: string;
  description: string;
  stack: string[];
  url: string;
  badge?: string;
  category?: string;
}

export interface CoverFlowProps {
  projects: Project[];
  ctaLabel?: string;
}

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */

const ANGLE = 55;
const SPRING = 'cubic-bezier(0.16, 1, 0.3, 1)';
const DURATION = '600ms';
const WHEEL_COOLDOWN = 280;
const SWIPE_THRESHOLD = 0.2; // 20% of card width = switch
const INFO_FADE_MS = 180;

/* ═══════════════════════════════════════════
   Smooth transform calculator
   Returns numeric values for any fractional offset
   ═══════════════════════════════════════════ */

interface CardValues { tx: number; tz: number; ry: number; sc: number; op: number; z: number }

function getCardValues(offset: number, w: number): CardValues {
  const abs = Math.abs(offset);
  const sign = offset > 0 ? 1 : offset < 0 ? -1 : 0;
  const mob = w < 640;
  const tab = w < 1024;

  const base = mob ? 130 : tab ? 160 : 190;
  const gap = mob ? 100 : tab ? 150 : 190;

  if (abs < 1) {
    // Smooth interpolation from center → first side position
    const t = abs;
    return {
      tx: sign * base * t,
      tz: 80 * (1 - t) + (-110) * t,           // 80 → -110
      ry: sign * ANGLE * t,                      // 0 → ±55
      sc: 1 - (1 - 0.82) * t,                    // 1 → 0.82
      op: 1 - (1 - 0.85) * t,                    // 1 → 0.85
      z: Math.round(100 - abs * 10),
    };
  }

  // Side positions (abs >= 1)
  return {
    tx: sign * (base + (abs - 1) * gap),
    tz: -60 - abs * 50,
    ry: sign * ANGLE,
    sc: Math.max(0.55, 0.82 - (abs - 1) * 0.12),
    op: Math.max(0.3, 0.85 - (abs - 1) * 0.2),
    z: Math.round(100 - abs * 10),
  };
}

function valuesToStyle(v: CardValues): string {
  return `translateX(${v.tx}px) translateZ(${v.tz}px) rotateY(${v.ry}deg) scale(${v.sc})`;
}

/* ═══════════════════════════════════════════
   Haptics — singleton, lazy-created on first trigger
   This guarantees the instance exists within user
   gesture context (required for iOS vibrate + fallback)
   
   Presets from source (not all documented):
     selection (8ms, 0.3) — lightest, for scrolling
     light (15ms, 0.4) — for dot nav  
     success (30+40ms) — for opening project
   ═══════════════════════════════════════════ */

let _haptics: WebHaptics | null = null;

function hapticTrigger(preset: string) {
  try {
    if (!_haptics) _haptics = new WebHaptics();
    _haptics.trigger(preset);
  } catch { /* graceful no-op */ }
}

/* ═══════════════════════════════════════════
   Injected CSS
   ═══════════════════════════════════════════ */

const STYLES = `
  .cflow-card {
    position: absolute;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    border: 1px solid var(--border, rgba(255,255,255,0.08));
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 4px 20px var(--shadow, rgba(0,0,0,0.15));
    transform-style: preserve-3d;
    will-change: transform, opacity;
    -webkit-box-reflect: below 4px
      linear-gradient(transparent 60%, rgba(128,128,128,0.06));
  }

  .cflow-card--snapping {
    transition:
      transform ${DURATION} ${SPRING},
      opacity ${DURATION} ${SPRING},
      box-shadow 0.3s ease;
  }

  .cflow-card--active {
    box-shadow:
      0 16px 50px var(--shadow, rgba(0,0,0,0.25)),
      0 0 0 1px color-mix(in srgb, var(--accent) 20%, transparent);
  }

  .cflow-stage {
    perspective: 1200px;
    perspective-origin: 50% 42%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
    touch-action: pan-y;
  }

  .cflow-wrap {
    position: relative;
    width: 100%;
    outline: none;
  }

  .cflow-info {
    text-align: center;
    min-height: 3.5rem;
    transition: opacity ${INFO_FADE_MS}ms ease, transform ${INFO_FADE_MS}ms ease;
  }
  .cflow-info--fading {
    opacity: 0 !important;
    transform: translateY(6px) !important;
  }

  .cflow-tag {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-weight: 600;
    border-radius: 4px;
    background: var(--accent-subtle, rgba(43, 155, 106, 0.1));
    color: var(--accent-text);
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .cflow-badge {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-radius: 4px;
    background: color-mix(in srgb, var(--accent) 15%, transparent);
    color: var(--accent-text);
  }

  .cflow-dot {
    border-radius: 9999px;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cflow-title {
    font-family: var(--font-display, 'Syne', sans-serif);
    color: var(--text-primary);
  }

  .cflow-cta {
    font-family: var(--font-display, 'Syne', sans-serif);
    color: var(--accent-text);
    text-decoration: none;
  }
  .cflow-cta:hover {
    opacity: 0.7;
  }
`;

/* ═══════════════════════════════════════════
   CoverFlow Component
   ═══════════════════════════════════════════ */

const CoverFlow: FC<CoverFlowProps> = ({ projects, ctaLabel = 'Ver caso de estudio →' }) => {
  const [active, setActive] = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isSnapping, setIsSnapping] = useState(true);
  const [width, setWidth] = useState(1024);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchRef = useRef({ x: 0, y: 0, t: 0 });
  const dragRef = useRef({ progress: 0, isDragging: false, locked: false });
  const wheelTs = useRef(0);
  const activeRef = useRef(0);

  const mob = width < 640;
  const cardW = mob ? 220 : width < 1024 ? 290 : 340;
  const stageH = mob ? 280 : width < 1024 ? 360 : 420;

  // Keep activeRef in sync
  useEffect(() => { activeRef.current = active; }, [active]);

  // Measure
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setWidth(el.offsetWidth);
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── Direct DOM update during drag ── */
  const updateCardsDirect = useCallback((progress: number) => {
    const curr = activeRef.current;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const offset = i - curr + progress;
      const v = getCardValues(offset, width);
      el.style.transform = valuesToStyle(v);
      el.style.opacity = String(v.op);
      el.style.zIndex = String(v.z);
    });
  }, [width]);

  /* ── Navigate (with snap animation) ── */
  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(i, projects.length - 1));
      if (next === activeRef.current) {
        // Snap back to current position
        setIsSnapping(true);
        requestAnimationFrame(() => updateCardsDirect(0));
        return;
      }
      hapticTrigger('selection');
      setActive(next);
      setIsSnapping(true);
      setIsFading(true);
      setTimeout(() => {
        setDisplayIdx(next);
        setIsFading(false);
      }, INFO_FADE_MS);
    },
    [projects.length, updateCardsDirect],
  );

  /* ── Keyboard ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(active - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, goTo]);

  /* ── Touch: continuous drag ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      touchRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        t: Date.now(),
      };
      dragRef.current = { progress: 0, isDragging: false, locked: false };
    };

    const onMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - touchRef.current.x;
      const dy = e.touches[0].clientY - touchRef.current.y;

      // Lock direction after initial movement
      if (!dragRef.current.locked && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        dragRef.current.locked = true;
        dragRef.current.isDragging = Math.abs(dx) > Math.abs(dy);
      }

      if (!dragRef.current.isDragging) return;
      e.preventDefault();

      // Disable CSS transitions during drag
      if (isSnapping) setIsSnapping(false);

      // Calculate drag progress (fraction of card width)
      let progress = dx / cardW;

      // Clamp: can't drag past first/last card
      const curr = activeRef.current;
      const maxRight = curr;                          // drag right reveals prev
      const maxLeft = -(projects.length - 1 - curr);  // drag left reveals next
      progress = Math.max(maxLeft - 0.15, Math.min(maxRight + 0.15, progress));

      dragRef.current.progress = progress;
      updateCardsDirect(progress);
    };

    const onEnd = (e: TouchEvent) => {
      if (!dragRef.current.isDragging) return;

      const progress = dragRef.current.progress;
      const dt = Date.now() - touchRef.current.t;
      const velocity = Math.abs(progress) / (dt / 1000); // progress/second

      dragRef.current.isDragging = false;

      // Determine target: snap if enough drag or fast flick
      if (Math.abs(progress) > SWIPE_THRESHOLD || velocity > 1.5) {
        // Haptic DIRECTLY in touch handler (user activation context)
        hapticTrigger('selection');
        if (progress > 0) goTo(activeRef.current - 1);
        else goTo(activeRef.current + 1);
      } else {
        // Snap back
        goTo(activeRef.current);
      }
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, [cardW, projects.length, goTo, updateCardsDirect, isSnapping]);

  /* ── Wheel ── */
  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - wheelTs.current < WHEEL_COOLDOWN) return;
    wheelTs.current = now;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    d > 0 ? goTo(active + 1) : goTo(active - 1);
  };

  const displayed = projects[displayIdx];

  if (projects.length === 0) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div
        ref={containerRef}
        className="cflow-wrap"
        onWheel={onWheel}
        tabIndex={0}
        role="region"
        aria-label="Project showcase"
        aria-roledescription="carousel"
      >
        {/* 3D Stage */}
        <div className="cflow-stage" style={{ height: stageH, width: '100%' }}>
          {projects.map((proj, i) => {
            const offset = i - active;
            const isCenter = offset === 0;
            const abs = Math.abs(offset);
            const v = getCardValues(offset, width);

            return (
              <div
                key={i}
                ref={el => { cardRefs.current[i] = el; }}
                className={[
                  'cflow-card',
                  isSnapping ? 'cflow-card--snapping' : '',
                  isCenter ? 'cflow-card--active' : '',
                ].join(' ')}
                style={{
                  width: cardW,
                  aspectRatio: '4 / 3.2',
                  background: 'color-mix(in srgb, var(--bg-secondary) 85%, transparent)',
                  transform: valuesToStyle(v),
                  opacity: v.op,
                  zIndex: v.z,
                  pointerEvents: abs <= 1 ? 'auto' : 'none',
                }}
                onClick={() => {
                  if (isCenter) {
                    hapticTrigger('success');
                    if (proj.url.startsWith('http')) {
                      window.open(proj.url, '_blank', 'noopener,noreferrer');
                    } else {
                      window.location.href = proj.url;
                    }
                  } else {
                    goTo(i);
                  }
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={proj.title}
              >
                {proj.image && (
                  <img
                    src={proj.image}
                    alt=""
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%', objectFit: 'cover',
                    }}
                    draggable={false}
                    loading="lazy"
                  />
                )}

                <div style={{
                  position: 'relative', height: '100%',
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: mob ? '0.75rem' : '1.25rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {proj.badge && (
                      <span className="cflow-badge"
                        style={{ fontSize: '0.55rem', padding: '0.2rem 0.5rem' }}>
                        {proj.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-display, "Syne", sans-serif)',
                      fontSize: mob ? '1rem' : '1.25rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      lineHeight: 1.25,
                      marginBottom: '0.4rem',
                    }}>
                      {proj.title}
                    </h3>

                    {isCenter && (
                      <p style={{
                        fontSize: mob ? '0.72rem' : '0.82rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.55,
                        marginBottom: '0.6rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {proj.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {proj.stack.slice(0, isCenter ? 5 : 3).map((tech) => (
                        <span key={tech} className="cflow-tag"
                          style={{ fontSize: mob ? '0.5rem' : '0.6rem', padding: '0.15rem 0.45rem' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0.5rem', marginTop: '1.25rem',
        }} role="tablist">
          {projects.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className="cflow-dot"
              role="tab" aria-selected={i === active}
              aria-label={`Project ${i + 1}`}
              style={{
                width: i === active ? 24 : 8, height: 8,
                background: i === active ? 'var(--accent, #83DEB5)' : 'var(--text-muted, #666)',
                opacity: i === active ? 1 : 0.3,
              }}
            />
          ))}
        </div>

        {/* Info */}
        <div className={`cflow-info ${isFading ? 'cflow-info--fading' : ''}`}
          style={{ marginTop: '1.25rem' }}>
          <h2 className="cflow-title"
            style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 700, marginBottom: '0.35rem' }}>
            {displayed?.title}
          </h2>
          <a href={displayed?.url}
            target={displayed?.url.startsWith('http') ? '_blank' : undefined}
            rel={displayed?.url.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="cflow-cta"
            style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            {ctaLabel}
          </a>
        </div>
      </div>
    </>
  );
};

export default CoverFlow;
