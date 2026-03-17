import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Image imports ────────────────────────────────────────────────────────────
import img2022_1 from '@/assets/timeline/2022/img1.jpeg';
import img2022_2 from '@/assets/timeline/2022/img2.jpeg';
import img2022_3 from '@/assets/timeline/2022/img3.jpeg';
import img2023_1 from '@/assets/timeline/2023/img1.jpeg';
import img2023_2 from '@/assets/timeline/2023/img2.jpeg';
import img2023_3 from '@/assets/timeline/2023/img3.jpeg';
import img2024_1 from '@/assets/timeline/2024/img1.jpeg';
import img2024_2 from '@/assets/timeline/2024/img2.jpeg';
import img2024_3 from '@/assets/timeline/2024/img3.jpeg';
import img2025_1 from '@/assets/timeline/2025/img1.jpeg';
import img2025_2 from '@/assets/timeline/2025/img2.jpeg';
import img2025_3 from '@/assets/timeline/2025/img3.jpeg';
import img2026_1 from '@/assets/timeline/2026/img1.jpeg';
import img2026_2 from '@/assets/timeline/2026/img2.jpeg';
import img2026_3 from '@/assets/timeline/2026/img3.jpeg';

// ─── Types ────────────────────────────────────────────────────────────────────
interface TimelineItem { title: string; description: string; }
interface TimelineYear { year: string; images: string[]; items: TimelineItem[]; }

// ─── Data ─────────────────────────────────────────────────────────────────────
const timelineData: TimelineYear[] = [
  {
    year: '2022',
    images: [img2022_1, img2022_2, img2022_3],
    items: [
      { title: 'Club Founded', description: 'Leo Club of Colombo Grand Circle was officially chartered under Lions District 306D5, uniting 20 founding members with a shared passion for community service.' },
      { title: 'Vision Set', description: 'The founding board established the club\'s mission — to empower youth through leadership, service, and fellowship across Colombo and beyond.' },
      { title: 'First Gathering', description: 'Hosted our inaugural general meeting, laying the groundwork for governance structure, project committees, and the membership charter.' },
      { title: 'Early Momentum', description: 'Completed our first community service activations within weeks of chartering, signalling a commitment to action from the very first day.' },
    ],
  },
  {
    year: '2023',
    images: [img2023_1, img2023_2, img2023_3],
    items: [
      { title: 'Full Board Established', description: 'Formally established our first full board of directors and launched structured monthly project cycles, setting the club\'s operational rhythm.' },
      { title: 'First Community Drive', description: 'Delivered stationery packs and essentials to over 200 underprivileged families in Colombo — our inaugural large-scale outreach campaign.' },
      { title: 'District Recognition', description: 'Honored with the Best New Club award at the District 306D5 convention, validating our founding values and rapid early impact.' },
      { title: 'Membership Growth', description: 'Closed the year with 35 active members, building a strong foundation for the ambitious programs on the horizon.' },
    ],
  },
  {
    year: '2024',
    images: [img2024_1, img2024_2, img2024_3],
    items: [
      { title: 'Scaling Service', description: 'Executed 8 structured service projects across education, environment, and health — impacting over 500 direct beneficiaries across the district.' },
      { title: 'Leo Weekend 2024', description: 'Spearheaded the first Grand Circle Leo Weekend, a 48-hour leadership immersion attended by Leos from 5 clubs across District 306D5.' },
      { title: 'NGO Partnerships', description: 'Signed formal collaboration agreements with three registered NGOs, enabling co-delivery of larger-scale youth empowerment initiatives.' },
      { title: 'Digital Growth', description: 'Launched a refreshed brand identity and social media strategy, growing our combined online community past 1,000 engaged followers.' },
    ],
  },
  {
    year: '2025',
    images: [img2025_1, img2025_2, img2025_3],
    items: [
      { title: '1,000+ Lives Impacted', description: 'Surpassed 1,000 lives directly touched — through scholarships, health camps, environmental drives, and one-on-one mentorship programs.' },
      { title: 'Leadership Series', description: 'Launched the Grand Circle Leadership Series, training 60 emerging leaders across 6 workshops in communication, governance, and community design.' },
      { title: 'National Representation', description: 'Represented District 306D5 at the Leo National Forum, presenting our youth development framework to clubs across Sri Lanka and the Maldives.' },
      { title: 'Looking Ahead', description: 'With 50+ active members and a robust project pipeline, Grand Circle enters 2026 ready to set a new benchmark for youth-led service.' },
    ],
  },
  {
    year: '2026',
    images: [img2026_1, img2026_2, img2026_3],
    items: [
      { title: 'New Chapter', description: 'Entering 2026 with renewed energy and an expanded membership base, the club launches its most ambitious project roadmap yet.' },
      { title: 'Regional Expansion', description: 'Extending outreach beyond Colombo into neighbouring districts, building satellite service networks that amplify community impact.' },
      { title: 'Fellowship & Culture', description: 'Deepening Grand Circle fellowship through structured mentorship pairing, inter-club exchanges, and our first annual Leo Gala.' },
      { title: 'Legacy Projects', description: 'Initiating two long-term legacy initiatives in education infrastructure and environmental conservation, designed to endure beyond any single Leo term.' },
    ],
  },
];

// ─── Looping Image Carousel ───────────────────────────────────────────────────
interface ImageCarouselProps { images: string[]; yearKey: string; }

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, yearKey }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [liveOffset, setLiveOffset] = useState(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartTime = useRef(0);
  const dragDelta = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const len = images.length;

  // Reset on year change
  useEffect(() => { setCurrent(0); setLiveOffset(0); }, [yearKey]);

  // Autoplay loop — 2 second delay
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setCurrent(c => (c + 1) % len), 2000);
    return () => clearTimeout(id);
  }, [current, paused, len]);

  const goTo = useCallback((raw: number) => {
    // wrap around for looping
    setCurrent(((raw % len) + len) % len);
    setLiveOffset(0);
  }, [len]);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartTime.current = Date.now();
    dragDelta.current = 0;
    e.preventDefault();
    trackRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    dragDelta.current = e.clientX - dragStartX.current;
    setLiveOffset(dragDelta.current);
  };
  const onPointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const d = dragDelta.current;
    const elapsed = Date.now() - dragStartTime.current;
    if (Math.abs(d) > 30 || (Math.abs(d) > 10 && elapsed < 250)) {
      goTo(d < 0 ? current + 1 : current - 1);
    } else {
      setLiveOffset(0);
    }
    dragDelta.current = 0;
  };

  return (
    <div
      className="tl-img-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="tl-img-track-wrapper"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onDragStart={event => event.preventDefault()}
      >
        <div
          className="tl-img-track"
          style={{
            transform: `translateX(calc(${current * -100}% + ${liveOffset}px))`,
            transition: isDragging.current ? 'none' : 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          {images.map((src, i) => (
            <div key={i} className="tl-img-slide">
              <img src={src} alt={`Slide ${i + 1}`} draggable={false} />
            </div>
          ))}
        </div>

        {/* Subtle drag hint overlay */}
        <div className="tl-img-overlay" />
      </div>

      <div className="tl-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={`tl-dot ${i === current ? 'tl-dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Liquid Glass Button ──────────────────────────────────────────────────────
interface GlassBtnProps {
  onClick: () => void;
  disabled: boolean;
  dir: 'left' | 'right';
}

const GlassBtn: React.FC<GlassBtnProps> = ({ onClick, disabled, dir }) => (
  <button
    className={`tl-glass-btn ${disabled ? 'tl-glass-btn--disabled' : ''}`}
    onClick={onClick}
    disabled={disabled}
    aria-label={dir === 'left' ? 'Previous year' : 'Next year'}
  >
    {dir === 'left' ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    )}
  </button>
);

// ─── Year Strip — shows exactly 3 years ──────────────────────────────────────
// windowStart: index of the leftmost visible year (0, 1, or 2)
interface YearStripProps {
  years: string[];
  activeIndex: number;
  windowStart: number;
  onYearClick: (index: number) => void;
}

const YearStrip: React.FC<YearStripProps> = ({ years, activeIndex, windowStart, onYearClick }) => {
  const visible = years.slice(windowStart, windowStart + 3);

  return (
    <div className="tl-year-strip">
      {visible.map((year, slot) => {
        const realIndex = windowStart + slot;
        const isActive = realIndex === activeIndex;
        return (
          <div
            key={year}
            className={`tl-year ${isActive ? 'tl-year--active' : 'tl-year--inactive'}`}
            onClick={() => onYearClick(realIndex)}
          >
            {year}
            {isActive && <div className="tl-year-underline" />}
          </div>
        );
      })}
    </div>
  );
};

// ─── TimelineSection ──────────────────────────────────────────────────────────
const TimelineSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(2);   // default: 2024
  const [windowStart, setWindowStart] = useState(1);   // shows 2023 · 2024 · 2025
  const [visible, setVisible] = useState(true);
  const prevIndex = useRef(2);
  const years = timelineData.map(d => d.year);
  const total = years.length; // 5

  const triggerFade = useCallback((newIndex: number) => {
    if (newIndex === prevIndex.current) return;
    setVisible(false);
    setTimeout(() => {
      setActiveIndex(newIndex);
      prevIndex.current = newIndex;
      setVisible(true);
    }, 280);
  }, []);

  // When year is clicked from the strip
  const handleYearClick = useCallback((index: number) => {
    triggerFade(index);
  }, [triggerFade]);

  const navigateToIndex = useCallback((index: number) => {
    const boundedIndex = Math.max(0, Math.min(index, total - 1));

    if (boundedIndex < windowStart) {
      setWindowStart(boundedIndex);
    } else if (boundedIndex > windowStart + 2) {
      setWindowStart(Math.max(0, boundedIndex - 2));
    }

    triggerFade(boundedIndex);
  }, [total, triggerFade, windowStart]);

  const shiftLeft = () => {
    if (activeIndex === 0) return;
    navigateToIndex(activeIndex - 1);
  };

  const shiftRight = () => {
    if (activeIndex >= total - 1) return;
    navigateToIndex(activeIndex + 1);
  };

  const active = timelineData[activeIndex];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap');

        .tl-section {
          width: 100%;
          min-height: 100vh;
          background: #0a0a0a;
          color: #fff;
          overflow: hidden;
        }

        /* ── Header ── */
        .tl-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding: 28px 40px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .tl-header-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.4rem, 2.5vw, 2rem);
          letter-spacing: 0.12em;
          color: #fff;
          margin: 0;
        }

        /* ── Liquid glass nav buttons (Apple style) ── */
        .tl-glass-btn {
          width: 52px; height: 52px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          box-shadow:
            0 4px 16px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.2),
            inset 0 -1px 0 rgba(0,0,0,0.15);
          color: rgba(255,255,255,0.9);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, box-shadow 0.2s, transform 0.15s, opacity 0.2s;
          flex-shrink: 0;
        }
        .tl-glass-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.15);
          box-shadow:
            0 6px 24px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.28),
            inset 0 -1px 0 rgba(0,0,0,0.1);
          transform: scale(1.06);
        }
        .tl-glass-btn:active:not(:disabled) { transform: scale(0.97); }
        .tl-glass-btn--disabled {
          opacity: 0.25;
          cursor: default;
          pointer-events: none;
        }
        .tl-nav-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* ── Year strip — exactly 3 years, equal columns ── */
        .tl-year-strip {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          padding: 28px 0 0;
          overflow: hidden;
        }
        .tl-year {
          font-family: 'Bebas Neue', sans-serif;
          cursor: pointer;
          text-align: center;
          line-height: 1;
          padding-bottom: 14px;
          position: relative;
          transition: color 0.35s ease, font-size 0.35s ease;
          user-select: none;
        }
        .tl-year--inactive {
          font-size: clamp(3.5rem, 8vw, 7rem);
          color: rgba(255,255,255,0.15);
        }
        .tl-year--inactive:hover { color: rgba(255,255,255,0.38); }
        .tl-year--active {
          font-size: clamp(5.5rem, 13vw, 11rem);
          color: #fff;
        }
        .tl-year-underline {
          position: absolute;
          bottom: 0; left: 50%;
          transform: translateX(-50%);
          width: 40px; height: 2px;
          background: #fff;
          border-radius: 2px;
        }

        /* ── Divider ── */
        .tl-divider { width: 100%; height: 1px; background: rgba(255,255,255,0.08); }

        /* ── Fade ── */
        .tl-fade { transition: opacity 0.28s ease, transform 0.28s ease; }
        .tl-fade--in  { opacity: 1; transform: translateY(0);    }
        .tl-fade--out { opacity: 0; transform: translateY(10px); }

        /* ── Body grid ── */
        .tl-body {
          display: grid;
          grid-template-columns: 460px 1fr;
          min-height: 500px;
        }

        /* ── Carousel column ── */
        .tl-carousel-col {
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 44px 28px;
        }
        .tl-img-carousel {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          width: 100%;
        }

        /* Larger circle — was 310px, now 370px */
        .tl-img-track-wrapper {
          width: clamp(280px, 32vw, 370px);
          height: clamp(280px, 32vw, 370px);
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.03);
          cursor: grab;
          touch-action: pan-y;
          position: relative;
          box-shadow: 0 0 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06);
          flex-shrink: 0;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }
        .tl-img-track-wrapper:active { cursor: grabbing; }

        .tl-img-track {
          display: flex;
          width: 100%;
          height: 100%;
          will-change: transform;
          user-select: none;
        }
        .tl-img-slide {
          flex-shrink: 0;
          width: 100%;
          height: 100%;
        }
        .tl-img-slide img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
          user-select: none;
          -webkit-user-select: none;
          -webkit-user-drag: none;
        }
        /* Glassy vignette rim */
        .tl-img-overlay {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          box-shadow: inset 0 0 32px rgba(0,0,0,0.4);
          pointer-events: none;
        }

        /* ── Dots ── */
        .tl-dots { display: flex; gap: 8px; align-items: center; }
        .tl-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255,255,255,0.22);
          border: none; cursor: pointer; padding: 0;
          transition: background 0.25s, transform 0.25s;
        }
        .tl-dot--active { background: #fff; transform: scale(1.4); }
        .tl-dot:hover:not(.tl-dot--active) { background: rgba(255,255,255,0.5); }

        /* ── Detail grid ── */
        .tl-details-col { display: grid; grid-template-columns: 1fr 1fr; }
        .tl-detail-item {
          padding: 38px 34px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          border-right:  1px solid rgba(255,255,255,0.06);
          transition: background 0.2s;
        }
        .tl-detail-item:nth-child(2n) { border-right: none; }
        .tl-detail-item:nth-child(n+3) { border-bottom: none; }
        .tl-detail-item:hover { background: rgba(255,255,255,0.025); }
        .tl-detail-title {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: clamp(0.95rem, 1.4vw, 1.1rem);
          color: #fff; margin: 0 0 10px; line-height: 1.25;
        }
        .tl-detail-desc {
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: clamp(0.75rem, 0.95vw, 0.86rem);
          color: rgba(255,255,255,0.48);
          line-height: 1.7; margin: 0;
        }

        /* ── Mobile ── */
        @media (max-width: 1024px) {
          .tl-header {
            padding: 24px 24px 20px;
          }

          .tl-year--inactive {
            font-size: clamp(2.8rem, 8vw, 5rem);
          }

          .tl-year--active {
            font-size: clamp(4rem, 12vw, 7rem);
          }

          .tl-body {
            grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
          }

          .tl-detail-item {
            padding: 30px 24px;
          }
        }

        @media (max-width: 768px) {
          .tl-body { grid-template-columns: 1fr; }
          .tl-carousel-col { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.07); }
          .tl-details-col { grid-template-columns: 1fr; }
          .tl-detail-item { border-right: none; }
          .tl-header { padding: 20px 20px 16px; }
          .tl-year-strip { padding-top: 20px; }
          .tl-year--inactive { font-size: clamp(2rem, 10vw, 3.6rem); }
          .tl-year--active { font-size: clamp(2.8rem, 14vw, 5rem); }
          .tl-nav-row { width: 100%; justify-content: flex-end; }
        }

        @media (max-width: 480px) {
          .tl-header {
            justify-content: center;
            text-align: center;
          }

          .tl-nav-row {
            justify-content: center;
          }

          .tl-year-underline {
            width: 28px;
          }

          .tl-detail-item {
            padding: 24px 18px;
          }
        }
      `}</style>

      <section className="tl-section">

        {/* Header */}
        <div className="tl-header">
          <p className="tl-header-label">TIMELINE</p>
          <div className="tl-nav-row">
            <GlassBtn dir="left"  onClick={shiftLeft}  disabled={activeIndex === 0} />
            <GlassBtn dir="right" onClick={shiftRight} disabled={activeIndex >= total - 1} />
          </div>
        </div>

        {/* 3-year window */}
        <YearStrip
          years={years}
          activeIndex={activeIndex}
          windowStart={windowStart}
          onYearClick={handleYearClick}
        />

        <div className="tl-divider" />

        {/* Fading body */}
        <div className={`tl-fade ${visible ? 'tl-fade--in' : 'tl-fade--out'}`}>
          <div className="tl-body">

            <div className="tl-carousel-col">
              <ImageCarousel images={active.images} yearKey={active.year} />
            </div>

            <div className="tl-details-col">
              {active.items.map((item, i) => (
                <div key={i} className="tl-detail-item">
                  <h3 className="tl-detail-title">{item.title}</h3>
                  <p className="tl-detail-desc">{item.description}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </section>
    </>
  );
};

export default TimelineSection;
