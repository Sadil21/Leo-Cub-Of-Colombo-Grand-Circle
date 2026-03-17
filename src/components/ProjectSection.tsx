import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import CircularGallery from '@/components/CircularGallery';
import InfiniteMenu from '@/components/InfiniteMenu';
import handWashImage from '@/assets/projects/hand_wash/hand_wash1.jpeg';
import { useInView, useResponsiveMode } from '@/lib/ui-hooks';
import GlassSurface from '@/components/GlassSurface';

type Project = {
  name: string;
  image: string;
  menuItems: {
    image: string;
    link: string;
    title: string;
    description: string;
  }[];
};

const demoProjectNames = [
  'Coastline Care',
  'Bright Harvest',
  'Future Makers',
  'Ripple Relief',
  'Spark Summit',
  'Unity Drive',
  'Golden Hour',
  'Project Horizon',
  'Green Pulse',
  'Momentum Lab',
];

const demoProjects: Project[] = demoProjectNames.map((name, index) => ({
  name,
  image: handWashImage,
  menuItems: Array.from({ length: 6 }, (_, itemIndex) => ({
    image: handWashImage,
    link: handWashImage,
    title: `${name} ${itemIndex + 1}`,
    description:
      index % 2 === 0
        ? 'Demo project details live here for now so we can test the popup and image showcase flow with repeated visuals.'
        : 'This is placeholder project copy for the Infinite Menu card, ready to be swapped with real highlights later on.',
  })),
}));

const galleryItems = demoProjects.map(project => ({
  image: project.image,
  text: project.name,
}));

const ProjectsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { isMobile, isTablet, prefersReducedMotion } = useResponsiveMode();
  const isInView = useInView(sectionRef, 0.01, '55% 0px');
  const compactMode = isMobile || isTablet || prefersReducedMotion;
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!activeProject) return undefined;

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveProject(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeProject]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap');

        .proj-section {
          width: 100%;
          min-height: 100vh;
          background:
            radial-gradient(circle at top, rgba(82, 39, 255, 0.16), transparent 36%),
            linear-gradient(180deg, #04040a 0%, #080811 50%, #04040a 100%);
          padding: clamp(72px, 9vw, 112px) 0 clamp(40px, 6vw, 80px);
          overflow: hidden;
        }

        .proj-shell {
          width: min(1360px, calc(100vw - 32px));
          margin: 0 auto;
        }

        .proj-header {
          text-align: center;
          margin-bottom: clamp(24px, 4vw, 44px);
        }

        .proj-eyebrow {
          margin: 0 0 14px;
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.42);
        }

        .proj-title {
          margin: 0 0 18px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(4.4rem, 11vw, 9rem);
          line-height: 0.86;
          letter-spacing: 0.04em;
          color: #f8f4ee;
        }

        .proj-subtitle {
          max-width: 760px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
          font-size: clamp(0.98rem, 1.2vw, 1.08rem);
          line-height: 1.85;
          color: rgba(255, 255, 255, 0.56);
        }

        .proj-gallery-wrap {
          position: relative;
          height: clamp(420px, 54vw, 660px);
          margin-top: clamp(18px, 4vw, 32px);
        }

        .proj-card {
          position: relative;
          overflow: hidden;
          width: 100%;
          padding: 0;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          text-align: left;
          cursor: pointer;
          appearance: none;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.28);
        }

        .proj-card img {
          width: 100%;
          aspect-ratio: 1 / 1.05;
          object-fit: cover;
          display: block;
        }

        .proj-card-copy {
          padding: 16px 16px 18px;
        }

        .proj-card-title {
          margin: 0 0 8px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.8rem, 5vw, 2.4rem);
          letter-spacing: 0.04em;
          color: #f8f4ee;
        }

        .proj-card-desc {
          margin: 0;
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.6);
        }

        .proj-hint {
          margin: 18px 0 0;
          text-align: center;
          font-family: 'Inter', sans-serif;
          font-size: 0.76rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.24);
        }

        .proj-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 60;
          display: grid;
          place-items: center;
          padding: 18px;
          background: rgba(3, 3, 6, 0.82);
          backdrop-filter: blur(22px);
        }

        .proj-modal {
          position: relative;
          width: min(1120px, 100%);
          height: min(88vh, 700px);
          border-radius: 30px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background:
            radial-gradient(circle at top, rgba(110, 90, 255, 0.14), transparent 32%),
            linear-gradient(180deg, rgba(26, 26, 32, 0.96), rgba(18, 18, 24, 0.98));
          box-shadow: 0 40px 140px rgba(0, 0, 0, 0.56);
        }

        .proj-close {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 4;
          width: 64px;
          height: 64px;
          overflow: hidden;
        }

        .proj-menu-stage {
          width: 100%;
          height: 100%;
        }

        @media (max-width: 640px) {
          .proj-section {
            padding-top: 64px;
          }

          .proj-mobile-track {
            grid-auto-columns: minmax(260px, 88%);
          }

          .proj-gallery-wrap {
            height: 460px;
          }

          .proj-modal {
            height: min(82vh, 560px);
            border-radius: 24px;
          }

          .proj-close {
            width: 56px;
            height: 56px;
            top: 12px;
            right: 12px;
          }
        }
      `}</style>

      <section className="proj-section" id="projects" ref={sectionRef}>
        <div className="proj-shell">
          <div className="proj-header">
            <p className="proj-eyebrow">Demo project showcase</p>
            <h2 className="proj-title">Projects</h2>
            <p className="proj-subtitle">
              The project cards now use the circular gallery component with demo project names and shared placeholder
              imagery, and each visible project can open its own popup showcase.
            </p>
          </div>

          <div className="proj-gallery-wrap">
            <CircularGallery
              items={galleryItems}
              bend={compactMode ? 1.35 : 2.6}
              textColor="#f5f0e8"
              borderRadius={compactMode ? 0.06 : 0.08}
              scrollSpeed={compactMode ? 2.3 : 3.2}
              scrollEase={compactMode ? 0.065 : 0.08}
              font={compactMode ? '500 22px Inter' : '500 30px Inter'}
              onItemClick={index => setActiveProject(demoProjects[index])}
              paused={!isInView}
            />
          </div>

          <p className="proj-hint">
            {compactMode
              ? 'Swipe or tap a project card to open its showcase'
              : 'Click a project card in the circular gallery to open the popup'}
          </p>
        </div>

        {activeProject && (
          <div className="proj-modal-overlay" role="presentation" onClick={() => setActiveProject(null)}>
            <div className="proj-modal" role="dialog" aria-modal="true" aria-label={activeProject.name} onClick={event => event.stopPropagation()}>
              <GlassSurface
                width={64}
                height={64}
                borderRadius={999}
                blur={20}
                brightness={64}
                opacity={0.95}
                backgroundOpacity={0.12}
                distortionScale={-90}
                greenOffset={6}
                blueOffset={12}
                className="proj-close"
              >
                <button
                  type="button"
                  className="grid h-full w-full place-items-center"
                  onClick={() => setActiveProject(null)}
                  aria-label="Close project popup"
                >
                  <X className="relative z-10 h-5 w-5 text-white" />
                </button>
              </GlassSurface>

              <div className="proj-menu-stage">
                <InfiniteMenu items={activeProject.menuItems} scale={0.9} />
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ProjectsSection;
