import { useState, useRef, useCallback } from 'react';
import GlassSurface from '@/components/GlassSurface';
import { useResponsiveMode } from '@/lib/ui-hooks';

// ─── Types & Data ─────────────────────────────────────────────────────────────
interface Member {
  id: number;
  name: string;
  role: string;
  detail1: string;
  detail2: string;
  image: string;
  socials: { label: string; icon: React.ReactNode; href: string }[];
}

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const members: Member[] = [
  {
    id: 1,
    name: 'Leo Sadil',
    role: 'Fundraising Director',
    detail1: 'Leads all sponsorship and fundraising initiatives, building partnerships with local businesses and organisations to fuel impactful community projects.',
    detail2: 'Passionate about sustainable finance models that give the club long-term independence and the capacity to scale its outreach efforts.',
    image: '@/assets/leos/leo1.png',
    socials: [
      { label: 'LinkedIn', icon: <LinkedInIcon />, href: '#' },
      { label: 'Instagram', icon: <InstagramIcon />, href: '#' },
    ],
  },
  {
    id: 2,
    name: 'Leo Aanya',
    role: 'President',
    detail1: 'Oversees club governance, sets strategic direction, and chairs all board meetings. Drives the club\'s vision of youth-led community transformation.',
    detail2: 'Represented Grand Circle at the National Leo Forum and has been instrumental in forging inter-club partnerships across District 306D5.',
    image: '@/assets/leos/leo2.png',
    socials: [
      { label: 'LinkedIn', icon: <LinkedInIcon />, href: '#' },
      { label: 'Instagram', icon: <InstagramIcon />, href: '#' },
    ],
  },
  {
    id: 3,
    name: 'Leo Rivan',
    role: 'Secretary',
    detail1: 'Manages all club correspondence, meeting minutes, and official documentation. Ensures seamless communication between the board and members.',
    detail2: 'Introduced a digital record-keeping system that improved operational transparency and cut administrative overhead by over 40%.',
    image: '@/assets/leos/leo3.png',
    socials: [
      { label: 'LinkedIn', icon: <LinkedInIcon />, href: '#' },
      { label: 'Instagram', icon: <InstagramIcon />, href: '#' },
    ],
  },
  {
    id: 4,
    name: 'Leo Mihiri',
    role: 'Treasurer',
    detail1: 'Maintains full financial oversight of the club — budgeting, expenditure tracking, and annual reporting to Lions District 306D5.',
    detail2: 'Architected a zero-waste budgeting policy that redirected 15% of operational savings directly into community service project funding.',
    image: '@/assets/leos/leo4.png',
    socials: [
      { label: 'LinkedIn', icon: <LinkedInIcon />, href: '#' },
      { label: 'Instagram', icon: <InstagramIcon />, href: '#' },
    ],
  },
  {
    id: 5,
    name: 'Leo Kavin',
    role: 'Service Director',
    detail1: 'Plans and coordinates all outreach and community service projects, from initial concept through execution and impact assessment.',
    detail2: 'Has personally led 12 service initiatives impacting over 600 beneficiaries, with a focus on education access and environmental sustainability.',
    image: '@/assets/leos/leo5.png',
    socials: [
      { label: 'LinkedIn', icon: <LinkedInIcon />, href: '#' },
      { label: 'Instagram', icon: <InstagramIcon />, href: '#' },
    ],
  },
  {
    id: 6,
    name: 'Leo Dinali',
    role: 'Communications Director',
    detail1: 'Manages the club\'s brand, social media presence, and all external communications. Grew the club\'s online community to over 1,000 followers.',
    detail2: 'Developed the Grand Circle visual identity and content strategy that earned recognition at the District communications awards.',
    image: '@/assets/leos/leo6.png',
    socials: [
      { label: 'LinkedIn', icon: <LinkedInIcon />, href: '#' },
      { label: 'Instagram', icon: <InstagramIcon />, href: '#' },
    ],
  },
];

// ─── Vite glob image resolver ─────────────────────────────────────────────────
const leoImages = import.meta.glob('@/assets/leos/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function resolveImage(path: string): string {
  const key = path.replace('@/', '/src/');
  const keys = Object.keys(leoImages);
  return leoImages[key] ?? leoImages[keys[0]] ?? '';
}

// ─── MembersSection ───────────────────────────────────────────────────────────
type Dir = 'left' | 'right' | 'none';

const MembersSection: React.FC = () => {
  const { isMobile, isTablet } = useResponsiveMode();
  const compactMode = isMobile || isTablet;
  const [current, setCurrent]       = useState(0);
  const [animating, setAnimating]   = useState(false);
  const [slideDir, setSlideDir]     = useState<Dir>('none');
  const [displayIdx, setDisplayIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total   = members.length;
  const nextIdx = (current + 1) % total;

  const goTo = useCallback((newIdx: number, dir: Dir) => {
    if (animating) return;
    setSlideDir(dir);
    setAnimating(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCurrent(newIdx);
      setDisplayIdx(newIdx);
      setAnimating(false);
      setSlideDir('none');
    }, 380);
  }, [animating]);

  const handlePrev = () => goTo((current - 1 + total) % total, 'right');
  const handleNext = () => goTo(nextIdx, 'left');

  const member     = members[displayIdx];
  const nextMember = members[nextIdx];

  const exitClass =
    animating && slideDir === 'left'  ? 'ms-exit-left'  :
    animating && slideDir === 'right' ? 'ms-exit-right' : '';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap');

        .ms-section {
          width: 100%;
          min-height: 100vh;
          background: #080808;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(48px, 7vw, 96px) clamp(24px, 6vw, 72px);
          box-sizing: border-box;
          overflow: hidden;
        }

        /* Two-column: 45% text | 55% image */
        .ms-grid {
          display: grid;
          grid-template-columns: 45fr 55fr;
          width: 100%;
          max-width: 1240px;
          align-items: center;
          gap: clamp(32px, 4vw, 64px);
        }

        /* ── LEFT ── */
        .ms-left {
          display: flex;
          flex-direction: column;
        }

        .ms-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(5rem, 12vw, 10rem);
          color: #fff;
          line-height: 0.85;
          margin: 0 0 32px;
          letter-spacing: 0.01em;
        }
        .ms-heading-accent { color: #ddd5b8; }

        /* Animated text block */
        .ms-text-block {
          transition: transform 0.38s cubic-bezier(0.4,0,0.2,1),
                      opacity  0.38s cubic-bezier(0.4,0,0.2,1);
        }
        .ms-exit-left  { transform: translateX(-48px); opacity: 0; }
        .ms-exit-right { transform: translateX(48px);  opacity: 0; }

        .ms-name {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: clamp(1.25rem, 2.2vw, 1.75rem);
          color: #fff;
          margin: 0 0 5px;
          letter-spacing: -0.01em;
        }
        .ms-role {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: clamp(0.75rem, 1vw, 0.88rem);
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0 0 20px;
        }

        .ms-divider {
          width: 32px; height: 1px;
          background: rgba(255,255,255,0.18);
          margin-bottom: 20px;
        }

        .ms-detail {
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: clamp(0.8rem, 1vw, 0.9rem);
          color: rgba(255,255,255,0.45);
          line-height: 1.8;
          margin: 0 0 12px;
          max-width: 400px;
        }

        .ms-more-label {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: clamp(0.9rem, 1.2vw, 1rem);
          color: rgba(255,255,255,0.7);
          margin: 20px 0 12px;
        }

        /* Social pills */
        .ms-socials {
          display: flex;
          gap: 10px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .ms-social-link {
          text-decoration: none;
          color: #fff;
          display: inline-flex;
        }

        /* Override GlassSurface inner padding for pill shape */
        .ms-social-glass {
          /* GlassSurface className target */
        }

        .ms-social-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: rgba(255,255,255,0.88);
        }

        /* Nav buttons */
        .ms-nav {
          display: flex;
          gap: 12px;
          margin-top: 36px;
          align-items: center;
        }

        .ms-nav-btn {
          width: 50px; height: 50px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          box-shadow:
            0 4px 16px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.18),
            inset 0 -1px 0 rgba(0,0,0,0.12);
          color: rgba(255,255,255,0.85);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .ms-nav-btn:hover {
          background: rgba(255,255,255,0.13);
          box-shadow:
            0 6px 22px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.26);
          transform: scale(1.06);
        }
        .ms-nav-btn:active { transform: scale(0.96); }

        .ms-counter {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.28);
          letter-spacing: 0.1em;
          margin-left: 6px;
        }

        /* ── RIGHT ── */
        .ms-right {
          /* This is the positioning parent for the card AND next-preview */
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Extra right-padding creates space so the next-preview isn't clipped */
          padding-right: 120px;
        }

        /* Card container — background pill */
        .ms-card {
          position: relative;
          width: 100%;
          max-width: 400px;
          aspect-ratio: 3 / 4.2;
          border-radius: 28px;
          background: rgba(217,217,217,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          overflow: visible;
          flex-shrink: 0;
          /* Deep ground shadow pooling under the card */
          box-shadow:
            0 50px 100px rgba(0,0,0,0.95),
            0 24px 48px rgba(0,0,0,0.7),
            0 8px 16px rgba(0,0,0,0.5);
        }

        /* Upward light bloom from the card base onto the figure */
        .ms-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          height: 60%;
          border-radius: 50%;
          background: radial-gradient(
            ellipse at 50% 100%,
            rgba(200,190,165,0.11) 0%,
            rgba(140,130,110,0.06) 45%,
            transparent 72%
          );
          pointer-events: none;
          z-index: 2;
        }

        /* Photo: overflows top of card */
        .ms-photo-wrap {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 92%;
          height: 118%;
          pointer-events: none;
          overflow: visible;
          z-index: 3;
        }
        .ms-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }

        /* Bottom fade — gradient overlay that fades the figure into black at the feet */
        .ms-photo-wrap::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 45%;
          background: linear-gradient(
            to top,
            rgba(8,8,8,1)    0%,
            rgba(8,8,8,0.85) 20%,
            rgba(8,8,8,0.5)  45%,
            transparent      100%
          );
          pointer-events: none;
          border-radius: 0 0 28px 28px;
          z-index: 4;
        }

        /* Slide animation on card */
        .ms-card-anim {
          transition: transform 0.38s cubic-bezier(0.4,0,0.2,1),
                      opacity  0.38s cubic-bezier(0.4,0,0.2,1);
        }

        /* ── Next-up preview — anchored to card's bottom-right ── */
        .ms-next-anchor {
          /* Positioned relative to .ms-right */
          position: absolute;
          /* Sits to the right of the card and slightly above the bottom */
          right: 0;
          bottom: clamp(40px, 6vw, 80px);
          cursor: pointer;
          transition: transform 0.22s ease;
          z-index: 20;
        }
        .ms-next-anchor:hover { transform: scale(1.05) translateY(-4px); }

        .ms-next-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          filter: blur(2px) brightness(0.7);
          display: block;
          border-radius: 20px;
        }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .ms-section {
            align-items: flex-start;
            padding: 48px 20px 64px;
          }

          .ms-grid {
            grid-template-columns: 1fr;
          }
          .ms-left  { order: 2; }
          .ms-right {
            order: 1;
            padding-right: 0;
            justify-content: center;
            min-height: 420px;
          }
          .ms-card {
            max-width: min(100%, 420px);
          }
          .ms-next-anchor {
            right: auto;
            bottom: 24px;
            left: 50%;
            transform: translateX(90px);
          }
          .ms-detail { max-width: 100%; }
        }

        @media (max-width: 640px) {
          .ms-section {
            padding: 40px 16px 56px;
          }

          .ms-heading {
            margin-bottom: 20px;
          }

          .ms-nav {
            margin-top: 28px;
          }

          .ms-right {
            min-height: 360px;
          }

          .ms-card {
            max-width: 100%;
          }

          .ms-next-anchor {
            display: none;
          }
        }
      `}</style>

      <section className="ms-section">
        <div className="ms-grid">

          {/* ── LEFT: text ── */}
          <div className="ms-left">
            <h2 className="ms-heading">
              LEO<span className="ms-heading-accent">S</span>
            </h2>

            <div className={`ms-text-block ${exitClass}`}>
              <p className="ms-name">{member.name}</p>
              <p className="ms-role">{member.role} of LCCGC</p>
              <div className="ms-divider" />
              <p className="ms-detail">{member.detail1}</p>
              <p className="ms-more-label">More Details</p>
              <p className="ms-detail">{member.detail2}</p>

              {/* Social pills using GlassSurface */}
              <div className="ms-socials">
                {member.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ms-social-link"
                    aria-label={s.label}
                  >
                    <GlassSurface
                      width={compactMode ? 44 : 48}
                      height={compactMode ? 44 : 48}
                      borderRadius={999}
                      blur={compactMode ? 10 : 14}
                      brightness={48}
                      opacity={0.9}
                      distortionScale={compactMode ? -70 : -120}
                      redOffset={0}
                      greenOffset={compactMode ? 4 : 8}
                      blueOffset={compactMode ? 10 : 16}
                      mixBlendMode="difference"
                      className="ms-social-glass"
                    >
                      <span className="ms-social-inner">{s.icon}</span>
                    </GlassSurface>
                  </a>
                ))}
              </div>
            </div>

            {/* Nav */}
            <div className="ms-nav">
              <button className="ms-nav-btn" onClick={handlePrev} aria-label="Previous member">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button className="ms-nav-btn" onClick={handleNext} aria-label="Next member">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <span className="ms-counter">
                {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* ── RIGHT: image ── */}
          <div className="ms-right">

            {/* Main card */}
            <div className={`ms-card ms-card-anim ${exitClass}`}>
              <div className="ms-photo-wrap">
                <img
                  src={resolveImage(member.image)}
                  alt={member.name}
                  className="ms-photo"
                  draggable={false}
                />
              </div>
            </div>

            {/*
              Next preview — anchored to .ms-right (the padded wrapper),
              so it visually sits at the right edge of the card.
            */}
            <div
              className="ms-next-anchor"
              onClick={handleNext}
              role="button"
              tabIndex={0}
              aria-label={`Next: ${nextMember.name}`}
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            >
              <GlassSurface
                width={compactMode ? 90 : 110}
                height={compactMode ? 128 : 155}
                borderRadius={20}
                blur={compactMode ? 12 : 18}
                brightness={42}
                opacity={0.85}
                distortionScale={compactMode ? -80 : -130}
                redOffset={0}
                greenOffset={compactMode ? 4 : 8}
                blueOffset={compactMode ? 12 : 18}
                mixBlendMode="difference"
              >
                <img
                  src={resolveImage(nextMember.image)}
                  alt={`Next: ${nextMember.name}`}
                  className="ms-next-img"
                  draggable={false}
                  style={{ width: compactMode ? 90 : 110, height: compactMode ? 128 : 155 }}
                />
              </GlassSurface>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default MembersSection;
