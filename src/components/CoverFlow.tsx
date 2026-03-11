'use client';

import { useState, useCallback, useEffect, useRef, type FC } from 'react';

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
  accent?: string;
  textColor?: string;
  icon?: string;
}

export interface CoverFlowProps {
  projects: Project[];
}

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */

const ANGLE = 55;
const SPRING = 'cubic-bezier(0.16, 1, 0.3, 1)';
const DURATION = '600ms';
const WHEEL_COOLDOWN = 280;
const SWIPE_THRESHOLD = 0.2;
const INFO_FADE_MS = 180;

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

function hapticTick() {
  try { navigator?.vibrate?.(8); } catch { /* no-op */ }
}

/* ═══════════════════════════════════════════
   Google Font loader — Playfair Display
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
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    transform-style: preserve-3d;
    will-change: transform, opacity;
    border: 1px solid rgba(255,255,255,0.5);
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  }

  .cflow-card--snapping {
    transition:
      transform ${DURATION} ${SPRING},
      opacity ${DURATION} ${SPRING},
      box-shadow 0.4s ease;
  }

  .cflow-card--active {
    box-shadow:
      0 24px 64px -16px var(--card-shadow, rgba(0,0,0,0.18)),
      0 8px 20px -8px rgba(0,0,0,0.08);
    border-color: rgba(255,255,255,0.7);
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

  /* Top light */
  .cflow-sheen {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 45%;
    border-radius: 20px 20px 0 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 100%);
    pointer-events: none;
  }
`;

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

const CoverFlow: FC<CoverFlowProps> = ({ projects }) => {
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
  const cardW = mob ? 230 : width < 1024 ? 300 : 360;
  const stageH = mob ? 300 : width < 1024 ? 380 : 440;

  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setWidth(el.offsetWidth);
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(i, projects.length - 1));
      if (next === activeRef.current) {
        setIsSnapping(true);
        requestAnimationFrame(() => updateCardsDirect(0));
        return;
      }
      hapticTick();
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
        progress > 0 ? goTo(activeRef.current - 1) : goTo(activeRef.current + 1);
      } else {
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
        <div className="cflow-stage" style={{ height: stageH, width: '100%' }}>
          {projects.map((proj, i) => {
            const offset = i - active;
            const isCenter = offset === 0;
            const abs = Math.abs(offset);
            const v = getCardValues(offset, width);
            const accent = proj.accent || '#2B9B6A';
            const txt = proj.textColor || '#1a1a1a';
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
                  background: proj.gradient || '#eef2ea',
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
                <div className="cflow-noise" />
                <div className="cflow-sheen" />
                {proj.icon && <span className="cflow-glyph">{proj.icon}</span>}

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
                      WebkitLineClamp: isCenter ? 3 : 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {proj.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {proj.stack.slice(0, isCenter ? 5 : 3).map((tech) => (
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
            );
          })}
        </div>

        {/* Dots */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0.5rem', marginTop: '1.5rem',
        }} role="tablist">
          {projects.map((proj, i) => (
            <button key={i} onClick={() => goTo(i)} className="cflow-dot"
              role="tab" aria-selected={i === active}
              aria-label={proj.title}
              style={{
                width: i === active ? 28 : 8, height: 8,
                background: i === active ? (proj.accent || '#2B9B6A') : 'var(--text-muted, #aaa)',
                opacity: i === active ? 1 : 0.25,
              }}
            />
          ))}
        </div>

        {/* Info */}
        <div className={`cflow-info ${isFading ? 'cflow-info--fading' : ''}`}
          style={{ marginTop: '1.25rem' }}>
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
