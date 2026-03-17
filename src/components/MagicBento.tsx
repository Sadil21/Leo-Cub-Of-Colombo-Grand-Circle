import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import ClubLogo from '@/assets/logos/Club_Logo_2025.png';
import GrandCircle from '@/assets/logos/Leos_of_Grand_Circle_White.png';
import GroupPicture from '@/assets/images/LeoGroupPic.jpeg';
import CountUp from '@/components/CountUp';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BentoProps {
  /** Auto-hide overflowing text with ellipsis */
  textAutoHide?: boolean;
  /** Enable floating particle dots on hover */
  enableStars?: boolean;
  /** Enable global radial spotlight that follows cursor */
  enableSpotlight?: boolean;
  /** Enable purple border glow that follows cursor */
  enableBorderGlow?: boolean;
  /** Disable all animations (also auto-disabled on mobile) */
  disableAnimations?: boolean;
  /** Radius of the spotlight in px */
  spotlightRadius?: number;
  /** Number of particles per card */
  particleCount?: number;
  /** Enable 3-D tilt on hover */
  enableTilt?: boolean;
  /** RGB string for glow color, e.g. "132, 0, 255" */
  glowColor?: string;
  /** Ripple burst on click */
  clickEffect?: boolean;
  /** Card magnetism follow-cursor effect */
  enableMagnetism?: boolean;
  /** URL for the JOIN NOW button */
  joinUrl?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const createParticleElement = (x: number, y: number, color: string): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'mb-particle';
  el.style.cssText = `
    position:absolute;width:4px;height:4px;border-radius:50%;
    background:rgba(${color},1);box-shadow:0 0 6px rgba(${color},0.6);
    pointer-events:none;z-index:100;left:${x}px;top:${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const r = card.getBoundingClientRect();
  card.style.setProperty('--glow-x', `${((mouseX - r.left) / r.width) * 100}%`);
  card.style.setProperty('--glow-y', `${((mouseY - r.top) / r.height) * 100}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

// ─── useMobileDetection ───────────────────────────────────────────────────────

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

// ─── ParticleCard ─────────────────────────────────────────────────────────────

interface ParticleCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disableAnimations?: boolean;
  enableStars?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  particleCount?: number;
  glowColor?: string;
  onClick?: () => void;
}

const ParticleCard: React.FC<ParticleCardProps> = ({
  children,
  className = '',
  style,
  disableAnimations = false,
  enableStars = true,
  enableTilt = false,
  enableMagnetism = false,
  clickEffect = false,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimRef = useRef<gsap.core.Tween | null>(null);

  const initParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimRef.current?.kill();
    particlesRef.current.forEach(p => {
      gsap.to(p, {
        scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(1.7)',
        onComplete: () => void p.parentNode?.removeChild(p),
      });
    });
    particlesRef.current = [];
  }, []);

  const spawnParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitialized.current) initParticles();
    memoizedParticles.current.forEach((particle, i) => {
      const id = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);
        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360, duration: 2 + Math.random() * 2,
          ease: 'none', repeat: -1, yoyo: true,
        });
        gsap.to(clone, { opacity: 0.3, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true });
      }, i * 100);
      timeoutsRef.current.push(id);
    });
  }, [initParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const el = cardRef.current;

    const onEnter = () => {
      isHoveredRef.current = true;
      if (enableStars) spawnParticles();
      if (enableTilt) gsap.to(el, { rotateX: 5, rotateY: 5, duration: 0.3, ease: 'power2.out', transformPerspective: 1000 });
    };

    const onLeave = () => {
      isHoveredRef.current = false;
      if (enableStars) clearParticles();
      if (enableTilt) gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.3, ease: 'power2.out' });
      if (enableMagnetism) gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
    };

    const onMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      if (enableTilt) {
        gsap.to(el, {
          rotateX: ((y - cy) / cy) * -10, rotateY: ((x - cx) / cx) * 10,
          duration: 0.1, ease: 'power2.out', transformPerspective: 1000,
        });
      }
      if (enableMagnetism) {
        magnetismAnimRef.current = gsap.to(el, {
          x: (x - cx) * 0.05, y: (y - cy) * 0.05, duration: 0.3, ease: 'power2.out',
        });
      }
    };

    const onClickInternal = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const maxD = Math.max(
        Math.hypot(x, y), Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height)
      );
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position:absolute;width:${maxD * 2}px;height:${maxD * 2}px;border-radius:50%;
        background:radial-gradient(circle,rgba(${glowColor},0.4) 0%,rgba(${glowColor},0.2) 30%,transparent 70%);
        left:${x - maxD}px;top:${y - maxD}px;pointer-events:none;z-index:1000;
      `;
      el.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, {
        scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove(),
      });
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('click', onClickInternal);
    return () => {
      isHoveredRef.current = false;
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('click', onClickInternal);
      clearParticles();
    };
  }, [spawnParticles, clearParticles, disableAnimations, enableStars, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// ─── GlobalSpotlight ──────────────────────────────────────────────────────────

interface GlobalSpotlightProps {
  gridRef: React.RefObject<HTMLDivElement | null>;
  enabled?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}

const GlobalSpotlight: React.FC<GlobalSpotlightProps> = ({
  gridRef,
  enabled = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const spotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || disableAnimations || !gridRef?.current) return;

    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed;width:800px;height:800px;border-radius:50%;pointer-events:none;
      background:radial-gradient(circle,
        rgba(${glowColor},0.15) 0%,rgba(${glowColor},0.08) 15%,
        rgba(${glowColor},0.04) 25%,rgba(${glowColor},0.02) 40%,
        rgba(${glowColor},0.01) 65%,transparent 70%);
      z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;
    `;
    document.body.appendChild(el);
    spotRef.current = el;

    const onMove = (e: MouseEvent) => {
      if (!spotRef.current || !gridRef.current) return;
      const section = gridRef.current.closest('.mb-section');
      const rect = section?.getBoundingClientRect();
      const inside = rect &&
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top  && e.clientY <= rect.bottom;
      const cards = gridRef.current.querySelectorAll('.mb-card');

      if (!inside) {
        gsap.to(spotRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        cards.forEach(c => (c as HTMLElement).style.setProperty('--glow-intensity', '0'));
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDist = Infinity;

      cards.forEach(c => {
        const ce = c as HTMLElement;
        const cr = ce.getBoundingClientRect();
        const d = Math.max(0,
          Math.hypot(e.clientX - (cr.left + cr.width / 2), e.clientY - (cr.top + cr.height / 2)) -
          Math.max(cr.width, cr.height) / 2
        );
        minDist = Math.min(minDist, d);
        const gi = d <= proximity ? 1 : d <= fadeDistance ? (fadeDistance - d) / (fadeDistance - proximity) : 0;
        updateCardGlowProperties(ce, e.clientX, e.clientY, gi, spotlightRadius);
      });

      gsap.to(spotRef.current, { left: e.clientX, top: e.clientY, duration: 0.1, ease: 'power2.out' });
      const tOp = minDist <= proximity ? 0.8 : minDist <= fadeDistance ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.8 : 0;
      gsap.to(spotRef.current, { opacity: tOp, duration: tOp > 0 ? 0.2 : 0.5, ease: 'power2.out' });
    };

    const onLeave = () => {
      gridRef.current?.querySelectorAll('.mb-card').forEach(c => (c as HTMLElement).style.setProperty('--glow-intensity', '0'));
      if (spotRef.current) gsap.to(spotRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      spotRef.current?.parentNode?.removeChild(spotRef.current);
    };
  }, [gridRef, enabled, disableAnimations, spotlightRadius, glowColor]);

  return null;
};

// ─── MagicBento ───────────────────────────────────────────────────────────────

const MagicBento: React.FC<BentoProps> = ({
  textAutoHide       = true,
  enableStars        = true,
  enableSpotlight    = true,
  enableBorderGlow   = true,
  disableAnimations  = false,
  spotlightRadius    = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount      = DEFAULT_PARTICLE_COUNT,
  enableTilt         = false,
  glowColor          = DEFAULT_GLOW_COLOR,
  clickEffect        = true,
  enableMagnetism    = false,
  joinUrl            = 'https://your-join-url.com',
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const noAnim = disableAnimations || isMobile;

  const glass: React.CSSProperties = {
    background:           'rgba(255,255,255,0.04)',
    backdropFilter:       'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    border:               '1px solid rgba(255,255,255,0.09)',
    boxShadow:            '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)',
  };

  const cardBase = [
    'mb-card',
    enableBorderGlow ? 'mb-border-glow' : '',
    'mb-shimmer flex relative rounded-[18px] overflow-hidden transition-all duration-300 ease-out',
  ].join(' ');

  const shared: Omit<ParticleCardProps, 'children' | 'className' | 'style' | 'onClick'> = {
    disableAnimations: noAnim,
    enableStars,
    enableTilt,
    enableMagnetism,
    clickEffect,
    particleCount,
    glowColor,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;700&display=swap');

        .mb-root {
          width: 100%;
          min-height: clamp(540px, 100dvh, 920px);
          display: flex; align-items: center; justify-content: center;
          padding: clamp(12px, 1.6vw, 22px);
          background: #04000d; overflow: visible;
        }

        .mb-section {
          --glow-x: 50%; --glow-y: 50%;
          --glow-intensity: 0; --glow-radius: 200px;
        }

        /* Main grid — 3-column: left 2-col block | tall right tile */
        .mb-grid {
          display: grid;
          grid-template-columns: 2fr 1.05fr 1.05fr;
          grid-template-rows: minmax(280px, 1.12fr) minmax(240px, 0.88fr);
          gap: 10px; padding: 10px;
          width: min(100%, 1320px);
          min-height: min(780px, calc(100dvh - 24px));
          height: min(calc(100dvh - 24px), 840px);
        }

        /* Group photo — tall left column, spans both rows */
        .mb-tile-group {
          grid-column: 1; grid-row: 1 / 3;
        }

        /* Right 2×2 sub-grid */
        .mb-col-right {
          grid-column: 2 / 4; grid-row: 1 / 3;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1.12fr 0.88fr;
          gap: 10px;
        }

        .mb-tile-logo  { grid-column: 1; grid-row: 1; }
        .mb-tile-stats { grid-column: 2; grid-row: 1; }

        .mb-tile-logo,
        .mb-tile-stats {
          min-height: 260px;
        }

        /* Quote tile — spans full bottom row of right sub-grid */
        .mb-tile-quote {
          grid-column: 1; grid-row: 2;
        }

        .mb-tile-mini {
          grid-column: 2; grid-row: 2;
          display: grid; grid-template-rows: 1fr 1fr; gap: 10px;
          min-height: 0;
        }

        /* Border glow pseudo-element */
        .mb-border-glow::after {
          content: '';
          position: absolute; inset: 0; padding: 1.5px;
          background: radial-gradient(
            var(--glow-radius) circle at var(--glow-x) var(--glow-y),
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.9)) 0%,
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.45)) 30%,
            transparent 60%
          );
          border-radius: inherit;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none; z-index: 2;
        }
        .mb-border-glow:hover {
          box-shadow:
            0 4px 20px rgba(46,24,78,0.6),
            0 0 40px rgba(${glowColor},0.22),
            inset 0 1px 0 rgba(255,255,255,0.15) !important;
        }

        /* Shimmer sweep */
        .mb-shimmer::before {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 55%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.045), transparent);
          transform: skewX(-15deg); pointer-events: none; z-index: 1;
        }
        .mb-shimmer:hover::before { animation: mb-shimmer 0.75s ease forwards; }
        @keyframes mb-shimmer { from { left: -100%; } to { left: 160%; } }

        /* Particle halo */
        .mb-particle::before {
          content: ''; position: absolute; inset: -2px;
          background: rgba(${glowColor}, 0.2); border-radius: 50%; z-index: -1;
        }

        /* Text clamp helpers */
        .mb-clamp1 { display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1;overflow:hidden; }
        .mb-clamp2 { display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden; }

        /* JOIN NOW button */
        .mb-join-btn {
          cursor: pointer;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.06em; color: white;
          background: none; border: none; padding: 0;
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: color 0.3s ease, transform 0.3s ease;
        }
        .mb-join-btn:hover { color: rgba(${glowColor},1); transform: scale(1.03); }
        .mb-join-arrow { transition: transform 0.3s ease; display: block; }
        .mb-join-btn:hover .mb-join-arrow { transform: translate(3px,-3px); }

        /* Mobile fallback */
        @media (max-width: 1024px) {
          .mb-root {
            min-height: auto;
          }

          .mb-grid {
            width: 100%;
            height: auto;
            min-height: auto;
            grid-template-columns: 1.2fr 1fr;
            grid-template-rows: auto auto auto;
          }

          .mb-tile-group {
            grid-column: 1 / 3;
            grid-row: 1;
            min-height: 320px;
          }

          .mb-col-right {
            grid-column: 1 / 3;
            grid-row: 2 / 4;
            grid-template-rows: 1.1fr 0.9fr;
          }
        }

        @media (max-width: 768px) {
          .mb-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
            height: auto;
            width: 100%;
          }
          .mb-tile-group {
            grid-column: 1 / 3;
            grid-row: auto;
            min-height: 220px;
          }
          .mb-col-right  {
            grid-column: 1 / 3;
            grid-template-columns: 1fr;
            grid-template-rows: repeat(4, minmax(150px, auto));
          }
          .mb-tile-logo,
          .mb-tile-stats,
          .mb-tile-quote,
          .mb-tile-mini {
            grid-column: auto;
            grid-row: auto;
          }
          .mb-tile-mini {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(2, minmax(120px, auto));
          }
        }
      `}</style>

      <div className="mb-root">
        {enableSpotlight && (
          <GlobalSpotlight
            gridRef={gridRef}
            enabled={enableSpotlight}
            disableAnimations={noAnim}
            spotlightRadius={spotlightRadius}
            glowColor={glowColor}
          />
        )}

        <div className="mb-section" ref={gridRef}>
          <div className="mb-grid">

            {/* ── Tile 3 → now tall LEFT column: Group photo ── */}
            <ParticleCard
              {...shared}
              particleCount={(particleCount ?? DEFAULT_PARTICLE_COUNT) * 2}
              className={`${cardBase} mb-tile-group items-center justify-center`}
              style={glass}
            >
              <img
                src={GroupPicture}
                alt="Group Photo"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px', position: 'relative', zIndex: 1 }}
              />
            </ParticleCard>

            {/* ── Right 2×2 sub-grid ── */}
            <div className="mb-col-right">

              {/* Tile 1 — Brand logo */}
              <ParticleCard {...shared} className={`${cardBase} mb-tile-logo items-center justify-center`} style={glass}>
                <img
                  src={GrandCircle}
                  alt="Leos of Grand Circle"
                  style={{ width: '82%', height: '85%', objectFit: 'contain', position: 'relative', zIndex: 1 }}
                />
              </ParticleCard>

              {/* Tile 2 — Lives Impacted (Inter) */}
              <ParticleCard {...shared} className={`${cardBase} mb-tile-stats flex-col justify-between p-5`} style={glass}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{
                    fontFamily: "'Inter',sans-serif", fontWeight: 400,
                    fontSize: 'clamp(0.6rem,1.1vw,0.8rem)',
                    color: 'rgba(255,255,255,0.5)', margin: '0 0 6px',
                    ...(textAutoHide ? { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' } : {}),
                  }}>
                    Lives Impacted
                  </p>
                  <p style={{
                    fontFamily: "'Inter',sans-serif", fontWeight: 700,
                    fontSize: 'clamp(2.6rem,8vw,4rem)',
                    color: 'white', margin: 0, lineHeight: 1,
                    ...(textAutoHide ? { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' } : {}),
                  }}>
                    <span>+</span>
                    <CountUp to={100000} duration={2.4} separator="," />
                  </p>
                </div>
                <p style={{
                  fontFamily: "'Inter',sans-serif", fontWeight: 400,
                  fontSize: 'clamp(0.55rem,0.9vw,0.72rem)',
                  color: 'rgba(255,255,255,0.4)', margin: 0,
                  position: 'relative', zIndex: 1,
                  ...(textAutoHide ? { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' } : {}),
                }}>
                  Number of people
                </p>
              </ParticleCard>

              {/* ── Tile 5 → now bottom-left of right sub-grid: Quote ── */}
              <ParticleCard {...shared} className={`${cardBase} mb-tile-quote items-center justify-center`} style={glass}>
                <div style={{ position: 'relative', zIndex: 1, padding: '10%', textAlign: 'center' }}>
                  <h2 style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 'clamp(2rem,4vw,4rem)',
                    lineHeight: 0.93, letterSpacing: '0.02em',
                    color: 'white', margin: 0,
                    ...(textAutoHide ? { overflow: 'hidden' } : {}),
                  }}>
                    EMPOWERING<br />LEADERSHIP
                  </h2>
                </div>
              </ParticleCard>

              {/* Tile 4 mini-stack: club logo + join now */}
              <div className="mb-tile-mini">

                {/* Club logo */}
                <ParticleCard {...shared} className={`${cardBase} items-center justify-center`} style={glass}>
                  <img
                    src={ClubLogo}
                    alt="Leo Club of Colombo Grand Circle"
                    style={{ width: '78%', height: '78%', objectFit: 'contain', position: 'relative', zIndex: 1 }}
                  />
                </ParticleCard>

                {/* JOIN NOW */}
                <ParticleCard
                  {...shared}
                  className={`${cardBase} items-center justify-center`}
                  style={{ ...glass, cursor: 'pointer' }}
                  onClick={() => window.open(joinUrl, '_blank')}
                >
                  <button
                    className="mb-join-btn"
                    onClick={e => { e.stopPropagation(); window.open(joinUrl, '_blank'); }}
                  >
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 'clamp(1rem,2.2vw,1.8rem)' }}>JOIN NOW</span>
                    <svg
                      className="mb-join-arrow"
                      viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{ width: 'clamp(16px,2.2vw,26px)', height: 'clamp(16px,2.2vw,26px)' }}
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </button>
                </ParticleCard>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default MagicBento;
