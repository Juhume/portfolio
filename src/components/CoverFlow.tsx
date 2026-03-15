'use client';

import { useState, useCallback, useEffect, useRef, type FC } from 'react';
import { useWebHaptics } from 'web-haptics/react';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

export interface Project {
  title: string;
  description: string;
  stack: string[];
  url: string;
  badge?: string;
  category?: string;
  ctaLabel?: string;
  external?: boolean;
  gradient?: string;
  gradientDark?: string;
  accent?: string;
  accentDark?: string;
  textColor?: string;
  textColorDark?: string;
  icon?: string;
  image?: string;
}

export interface CoverFlowProps {
  projects: Project[];
}

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */

const ANGLE = 55;
const SPRING = 'cubic-bezier(0.25, 1, 0.5, 1)';     // smooth deceleration, no overshoot
const DUR_SLOW = 680;   // ms — deliberate gesture
const DUR_FAST = 340;   // ms — quick flick
const WHEEL_COOLDOWN = 280;
const SWIPE_THRESHOLD = 0.2;
const VEL_FAST = 2.5;   // progress/s — above this = fast flick
const INFO_FADE_MS = 160;

/* ═══════════════════════════════════════════
   Transform calculator
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
    const t = abs;
    return {
      tx: sign * base * t,
      tz: 80 * (1 - t) + (-110) * t,
      ry: sign * ANGLE * t,
      sc: 1 - (1 - 0.82) * t,
      op: 1 - (1 - 0.85) * t,
      z: Math.round(100 - abs * 10),
    };
  }

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
   Google Font — Playfair Display for cards
   ═══════════════════════════════════════════ */

const FONT_URL = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&display=swap';

/* ═══════════════════════════════════════════
   CSS
   ═══════════════════════════════════════════ */

const STYLES = `
  @import url('${FONT_URL}');

  .cflow-card {
    position: absolute;
    border-radius: 20px;
    overflow: visible;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    will-change: transform;
    contain: layout style;
  }

  .cflow-card__face {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.45);
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    transition: box-shadow var(--snap-dur, ${DUR_SLOW}ms) ${SPRING}, border-color var(--snap-dur, ${DUR_SLOW}ms) ${SPRING};
  }

  .cflow-card--active .cflow-card__face {
    border-color: rgba(255,255,255,0.65);
    box-shadow:
      0 24px 64px -16px var(--card-shadow, rgba(0,0,0,0.18)),
      0 8px 20px -8px rgba(0,0,0,0.08);
  }

  [data-theme="dark"] .cflow-card__face {
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04);
  }

  [data-theme="dark"] .cflow-card--active .cflow-card__face {
    border-color: rgba(255,255,255,0.14);
    box-shadow:
      0 24px 64px -16px var(--card-shadow, rgba(0,0,0,0.5)),
      0 8px 20px -8px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.06);
  }

  .cflow-card--snapping {
    transition:
      transform var(--snap-dur, ${DUR_SLOW}ms) ${SPRING},
      opacity var(--snap-dur, ${DUR_SLOW}ms) ${SPRING};
  }

  /* ── Reflection ── */
  .cflow-reflection {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: 35%;
    border-radius: 0 0 20px 20px;
    overflow: hidden;
    transform: scaleY(-1);
    pointer-events: none;
    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, transparent 70%);
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, transparent 70%);
  }

  [data-theme="dark"] .cflow-reflection {
    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, transparent 50%);
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, transparent 50%);
  }

  .cflow-stage {
    perspective: 1200px;
    perspective-origin: 50% 40%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
    touch-action: pan-y;
  }

  @media (prefers-reduced-motion: reduce) {
    .cflow-card--snapping {
      transition-duration: 0.01ms !important;
    }
  }

  .cflow-wrap {
    position: relative;
    width: 100%;
    outline: none;
    opacity: 0;
    transition: opacity 400ms ease;
  }
  .cflow-wrap--ready {
    opacity: 1;
  }

  /* ── Info panel ── */
  .cflow-info {
    text-align: center;
    min-height: 3.5rem;
    transition: opacity ${INFO_FADE_MS}ms ease-out;
    will-change: opacity;
  }
  .cflow-info--fading {
    opacity: 0;
    transition: opacity ${Math.round(INFO_FADE_MS * 0.6)}ms ease-in;
  }

  .cflow-dot {
    border-radius: 9999px;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .cflow-dot:hover { opacity: 0.7 !important; }

  .cflow-title {
    font-family: 'Playfair Display', Georgia, serif;
    color: var(--text-primary);
  }

  .cflow-cta {
    font-family: var(--font-display, 'Syne', sans-serif);
    text-decoration: none;
    transition: opacity 0.2s ease;
  }
  .cflow-cta:hover { opacity: 0.7; }

  /* Subtle grain */
  .cflow-noise {
    position: absolute;
    inset: 0;
    border-radius: 20px;
    opacity: 0.04;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 128px 128px;
    mix-blend-mode: multiply;
  }

  /* Glyph watermark */
  .cflow-glyph {
    position: absolute;
    font-size: 5.5rem;
    line-height: 1;
    pointer-events: none;
    opacity: 0.07;
    bottom: 0.5rem;
    right: 0.5rem;
  }

  /* Card logo image — watermark like the emoji glyph */
  .cflow-logo {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    width: 5.5rem;
    height: 5.5rem;
    object-fit: contain;
    pointer-events: none;
    opacity: 0.12;
  }

  /* Top light */
  .cflow-sheen {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 45%;
    border-radius: 20px 20px 0 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 100%);
    pointer-events: none;
  }

  [data-theme="dark"] .cflow-sheen {
    background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%);
  }

  [data-theme="dark"] .cflow-noise {
    opacity: 0.06;
    mix-blend-mode: soft-light;
  }



  [data-theme="dark"] .cflow-logo,
  [data-theme="dark"] .cflow-glyph {
    opacity: 0;
  }
`;

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

const CoverFlow: FC<CoverFlowProps> = ({ projects }) => {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isSnapping, setIsSnapping] = useState(true);
  const [width, setWidth] = useState(1024);

  const { trigger } = useWebHaptics();
  const hapticTick = useCallback(() => trigger('nudge'), [trigger]);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchRef = useRef({ x: 0, y: 0, t: 0 });
  const dragRef = useRef({ progress: 0, isDragging: false, locked: false });
  const wheelTs = useRef(0);
  const activeRef = useRef(0);
  const zTimers = useRef<number[]>([]);

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.dataset.theme === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const mob = width < 640;
  const cardW = mob ? 230 : width < 1024 ? 300 : 360;
  const cardH = mob ? 300 : width < 1024 ? 380 : 440;
  const stageH = Math.round(cardH * 1.12);

  // z-index: increases are instant, decreases are delayed (prevents flicker)
  const applyZ = useCallback((el: HTMLDivElement, newZ: number, i: number) => {
    const curZ = parseInt(el.style.zIndex) || 0;
    if (zTimers.current[i]) clearTimeout(zTimers.current[i]);
    if (newZ >= curZ) {
      el.style.zIndex = String(newZ);
    } else {
      zTimers.current[i] = window.setTimeout(() => {
        el.style.zIndex = String(newZ);
      }, 350);
    }
  }, []);

  useEffect(() => {
    activeRef.current = active;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const offset = Math.abs(i - active);
      const newZ = Math.round(100 - offset * 10);
      applyZ(el, newZ, i);
    });
  }, [active, applyZ]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setWidth(el.offsetWidth);
    // Show after first layout — prevents flash of unsized cards
    requestAnimationFrame(() => setMounted(true));
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const updateCardsDirect = useCallback((progress: number, useDelay = false) => {
    const curr = activeRef.current;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const offset = i - curr + progress;
      const v = getCardValues(offset, width);
      el.style.transform = valuesToStyle(v);
      el.style.opacity = String(v.op);
      if (useDelay) {
        applyZ(el, v.z, i);
      } else {
        el.style.zIndex = String(v.z);
      }
    });
  }, [width, applyZ]);

  const setSnapDuration = useCallback((velocity?: number) => {
    const el = containerRef.current;
    if (!el) return;
    // Lerp between slow and fast based on velocity
    const t = velocity ? Math.min(velocity / VEL_FAST, 1) : 0;
    const dur = Math.round(DUR_SLOW - t * (DUR_SLOW - DUR_FAST));
    el.style.setProperty('--snap-dur', `${dur}ms`);
  }, []);

  const goTo = useCallback(
    (i: number, velocity?: number) => {
      const next = Math.max(0, Math.min(i, projects.length - 1));
      if (next === activeRef.current) {
        setSnapDuration(velocity);
        setIsSnapping(true);
        requestAnimationFrame(() => updateCardsDirect(0, true));
        return;
      }
      hapticTick();
      setSnapDuration(velocity);
      setIsFading(true);
      setActive(next);
      setIsSnapping(true);
      setTimeout(() => {
        setDisplayIdx(next);
        setIsFading(false);
      }, INFO_FADE_MS);
    },
    [projects.length, updateCardsDirect, setSnapDuration],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(active - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, goTo]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onStart = (e: TouchEvent) => {
      touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
      dragRef.current = { progress: 0, isDragging: false, locked: false };
    };
    const onMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - touchRef.current.x;
      const dy = e.touches[0].clientY - touchRef.current.y;
      if (!dragRef.current.locked && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        dragRef.current.locked = true;
        dragRef.current.isDragging = Math.abs(dx) > Math.abs(dy);
      }
      if (!dragRef.current.isDragging) return;
      e.preventDefault();
      if (isSnapping) setIsSnapping(false);
      let progress = dx / cardW;
      const curr = activeRef.current;
      progress = Math.max(-(projects.length - 1 - curr) - 0.15, Math.min(curr + 0.15, progress));
      dragRef.current.progress = progress;
      updateCardsDirect(progress);
    };
    const onEnd = () => {
      if (!dragRef.current.isDragging) return;
      const progress = dragRef.current.progress;
      const dt = Date.now() - touchRef.current.t;
      const velocity = Math.abs(progress) / (dt / 1000);
      dragRef.current.isDragging = false;
      if (Math.abs(progress) > SWIPE_THRESHOLD || velocity > 1.5) {
        hapticTick();
        progress > 0 ? goTo(activeRef.current - 1, velocity) : goTo(activeRef.current + 1, velocity);
      } else {
        goTo(activeRef.current, velocity);
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

  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - wheelTs.current < WHEEL_COOLDOWN) return;
    wheelTs.current = now;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    // Wheel = medium-fast gesture
    d > 0 ? goTo(active + 1, 1.8) : goTo(active - 1, 1.8);
  };

  const displayed = projects[displayIdx];
  if (projects.length === 0) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div
        ref={containerRef}
        className={`cflow-wrap ${mounted ? 'cflow-wrap--ready' : ''}`}
        onWheel={onWheel}
        tabIndex={0}
        role="region"
        aria-label="Project showcase"
        aria-roledescription="carousel"
      >
        <div className="cflow-stage" style={{ height: stageH, width: '100%' }}>
          {projects.map((proj, i) => {
            const offset = i - active;
            const isCenter = offset === 0;
            const abs = Math.abs(offset);
            const v = getCardValues(offset, width);
            const accent = isDark ? (proj.accentDark || proj.accent || '#2B9B6A') : (proj.accent || '#2B9B6A');
            const txt = isDark ? (proj.textColorDark || proj.textColor || '#eef3ea') : (proj.textColor || '#1a1a1a');
            const bg = isDark ? (proj.gradientDark || proj.gradient || '#1c2320') : (proj.gradient || '#eef2ea');
            const txtSoft = txt + 'aa';
            const pad = mob ? '1.1rem' : '1.6rem';

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
                  aspectRatio: '3 / 2.4',
                  transform: valuesToStyle(v),
                  opacity: v.op,
                  zIndex: v.z,
                  pointerEvents: abs <= 1 ? 'auto' : 'none',
                  ['--card-shadow' as string]: `${accent}30`,
                }}
                onClick={() => {
                  if (isCenter) {
                    hapticTick();
                    if (proj.external) window.open(proj.url, '_blank', 'noopener,noreferrer');
                    else window.location.href = proj.url;
                  } else {
                    goTo(i);
                  }
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={proj.title}
              >
                {/* Card face */}
                <div className="cflow-card__face" style={{
                  background: bg,
                }}>
                  <div className="cflow-noise" />
                  <div className="cflow-sheen" />
                  {proj.image
                    ? <img className="cflow-logo" src={proj.image} alt="" aria-hidden="true" />
                    : proj.icon && <span className="cflow-glyph">{proj.icon}</span>
                  }

                  <div style={{
                    position: 'relative', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: pad,
                  }}>
                    {/* Top row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      {proj.category && (
                        <span style={{
                          fontFamily: 'var(--font-display, "Syne", sans-serif)',
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          color: accent,
                        }}>
                          {proj.category}
                        </span>
                      )}
                      {proj.badge && (
                        <span style={{
                          fontFamily: 'var(--font-display, "Syne", sans-serif)',
                          fontSize: '0.5rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '20px',
                          background: `${accent}18`,
                          color: accent,
                          border: `1px solid ${accent}25`,
                        }}>
                          {proj.badge}
                        </span>
                      )}
                    </div>

                    {/* Bottom */}
                    <div>
                      <h3 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: mob ? '1.3rem' : '1.65rem',
                        fontWeight: 800,
                        color: txt,
                        lineHeight: 1.15,
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.01em',
                      }}>
                        {proj.title}
                      </h3>

                      <p style={{
                        fontSize: mob ? '0.72rem' : '0.8rem',
                        color: txtSoft,
                        lineHeight: 1.6,
                        marginBottom: '0.75rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {proj.description}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {proj.stack.slice(0, 5).map((tech) => (
                          <span key={tech} style={{
                            fontFamily: 'var(--font-display, "Syne", sans-serif)',
                            fontSize: mob ? '0.48rem' : '0.56rem',
                            fontWeight: 600,
                            padding: '0.18rem 0.5rem',
                            borderRadius: '20px',
                            background: `${accent}15`,
                            color: accent,
                            letterSpacing: '0.02em',
                            border: `1px solid ${accent}20`,
                          }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reflection — mirrored copy of face */}
                <div className="cflow-reflection" style={{
                  background: bg,
                  borderRadius: '20px',
                }}>
                  <div style={{
                    position: 'relative', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: pad, opacity: 0.6,
                  }}>
                    <div />
                    <div>
                      <div style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: mob ? '1.3rem' : '1.65rem',
                        fontWeight: 800,
                        color: txt,
                        lineHeight: 1.15,
                      }}>
                        {proj.title}
                      </div>
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
          gap: '0.5rem', marginTop: '0.4rem',
        }} role="tablist">
          {projects.map((proj, i) => (
            <button key={i} onClick={() => goTo(i)} className="cflow-dot"
              role="tab" aria-selected={i === active}
              aria-label={proj.title}
              style={{
                width: i === active ? 28 : 8, height: 8,
                background: i === active ? (isDark ? (proj.accentDark || proj.accent || '#2B9B6A') : (proj.accent || '#2B9B6A')) : 'var(--text-muted, #aaa)',
                opacity: i === active ? 1 : 0.25,
              }}
            />
          ))}
        </div>

        {/* Info */}
        <div className={`cflow-info ${isFading ? 'cflow-info--fading' : ''}`}
          style={{ marginTop: '0.25rem' }}>
          <h2 className="cflow-title"
            style={{
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 800,
              marginBottom: '0.4rem',
              letterSpacing: '-0.02em',
            }}>
            {displayed?.title}
          </h2>
          {displayed?.ctaLabel && (
            <a href={displayed.url}
              target={displayed.external ? '_blank' : undefined}
              rel={displayed.external ? 'noopener noreferrer' : undefined}
              className="cflow-cta"
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: displayed.accent || 'var(--accent-text)',
              }}>
              {displayed.ctaLabel}
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default CoverFlow;
