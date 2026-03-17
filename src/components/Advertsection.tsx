import { useRef } from 'react';
import FaultyTerminal from './FaultyTerminal';
import { useInView, useResponsiveMode } from '@/lib/ui-hooks';

const AdvertSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { isMobile, isTablet, prefersReducedMotion } = useResponsiveMode();
  const isInView = useInView(sectionRef, 0.01, '55% 0px');
  const compactMode = isMobile || isTablet;

  return (
    <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap');

      .adv-root {
        width: 100%;
        padding: 48px 24px;
        background: #0a0a0a;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
      }

      /* Rounded card — must use fixed height, not min/max */
      .adv-card {
        position: relative;
        width: 100%;
        max-width: 1400px;
        /* explicit height so offsetHeight is non-zero for the Ballpit canvas */
        height: clamp(260px, 34vw, 460px);
        border-radius: 26px;
        overflow: hidden;
        background: #090914;
        border: 1px solid rgba(255,255,255,0.2);
        box-shadow: 0 24px 80px rgba(0,0,0,0.65);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Ballpit canvas wrapper — must be position:absolute with explicit 
         width/height so the canvas element itself has a real size */
      .adv-ballpit-wrap {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
      }

      /* Vignette over the ballpit */
      .adv-vignette {
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
        background: radial-gradient(
          ellipse 52% 68% at 50% 50%,
          rgba(6,6,20,0.78) 0%,
          rgba(6,6,20,0.35) 55%,
          transparent 100%
        );
      }

      /* Text content */
      .adv-content {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        text-align: center;
        padding: 0 20px;
        pointer-events: none;
      }

      .adv-eyebrow {
        font-family: 'Bebas Neue', sans-serif;
        font-size: clamp(0.8rem, 1.3vw, 1rem);
        letter-spacing: 0.2em;
        color: rgba(255,255,255,0.6);
        margin: 0;
        line-height: 1;
      }

      .adv-headline {
        font-family: 'Bebas Neue', sans-serif;
        font-size: clamp(3rem, 7.5vw, 7rem);
        letter-spacing: 0.02em;
        color: #fff;
        margin: 0;
        line-height: 0.95;
        text-shadow: 0 2px 40px rgba(0,0,0,0.6);
      }

      /* Apple liquid-glass pill button */
      .adv-btn {
        pointer-events: auto;
        margin-top: 22px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 13px 30px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.24);
        background: rgba(255,255,255,0.11);
        backdrop-filter: blur(28px) saturate(200%);
        -webkit-backdrop-filter: blur(28px) saturate(200%);
        box-shadow:
          0 4px 20px rgba(0,0,0,0.4),
          inset 0 1.5px 0 rgba(255,255,255,0.3),
          inset 0 -1px 0 rgba(0,0,0,0.15);
        color: #fff;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        font-size: clamp(0.88rem, 1.1vw, 1rem);
        letter-spacing: 0.01em;
        cursor: pointer;
        text-decoration: none;
        transition:
          background 0.22s ease,
          box-shadow  0.22s ease,
          transform   0.15s ease,
          border-color 0.22s ease;
        white-space: nowrap;
      }
      .adv-btn:hover {
        background: rgba(255,255,255,0.2);
        border-color: rgba(255,255,255,0.42);
        box-shadow:
          0 8px 32px rgba(0,0,0,0.45),
          inset 0 1.5px 0 rgba(255,255,255,0.4),
          inset 0 -1px 0 rgba(0,0,0,0.08);
        transform: translateY(-2px) scale(1.04);
      }
      .adv-btn:active {
        transform: translateY(0) scale(0.97);
        background: rgba(255,255,255,0.13);
      }
      .adv-arrow {
        display: flex;
        align-items: center;
        transition: transform 0.2s ease;
      }
      .adv-btn:hover .adv-arrow {
        transform: translate(2px, -2px);
      }

      @media (max-width: 768px) {
        .adv-root {
          padding: 28px 16px;
        }

        .adv-card {
          height: min(72vh, 420px);
          border-radius: 22px;
        }

        .adv-content {
          gap: 8px;
          padding: 0 18px;
        }

        .adv-btn {
          width: 100%;
          justify-content: center;
          padding: 14px 24px;
        }
      }
    `}</style>

    <div className="adv-root" ref={sectionRef}>
      <div className="adv-card">

        {/*
          The wrapper div must have explicit width+height via CSS (not min/max)
          so that canvas.parentNode.offsetWidth/offsetHeight returns real values.
          The Ballpit component uses size:'parent' which reads those properties.
        */}
        <div className="adv-ballpit-wrap">
            <FaultyTerminal
              scale={compactMode ? 2 : 2.6}
              gridMul={compactMode ? [1.5, 1] : [2, 1]}
              digitSize={compactMode ? 1.45 : 1.8}
              timeScale={compactMode ? 0.36 : 0.5}
              pause={prefersReducedMotion || !isInView}
              scanlineIntensity={compactMode ? 0.35 : 0.5}
              glitchAmount={compactMode ? 0.7 : 1}
              flickerAmount={compactMode ? 0.7 : 1}
              noiseAmp={compactMode ? 0.7 : 1}
              chromaticAberration={0}
              dither={0}
              curvature={compactMode ? 0.04 : 0.1}
              tint="#0000ff"
              mouseReact={!compactMode && !prefersReducedMotion}
              mouseStrength={compactMode ? 0.18 : 0.5}
              pageLoadAnimation={!prefersReducedMotion}
              brightness={0.8}
            />
        </div>

        {/* Vignette */}
        <div className="adv-vignette" />

        {/* Text + CTA */}
        <div className="adv-content">
          <p className="adv-eyebrow">BOOK LEO EVENT TICKETS FROM</p>
          <h2 className="adv-headline">LEOTICKETS.LK</h2>

          <a
            href="https://www.leotickets.lk/upcoming"
            target="_blank"
            rel="noopener noreferrer"
            className="adv-btn"
          >
            Visit
            <span className="adv-arrow">
              <svg
                width="15" height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </span>
          </a>
        </div>

      </div>
    </div>
  </>
  );
};

export default AdvertSection;
