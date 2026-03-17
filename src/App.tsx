import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import DarkVeil from '@/components/DarkVeil';
import LogoLoop from '@/components/LogoLoop';
import Ribbons from '@/components/Ribbons';
import MagicBento from '@/components/MagicBento';
import FlowingMenu from '@/components/FlowingMenu';
import type { MenuItemData } from '@/components/FlowingMenu';
import TimelineSection from '@/components/TimeLineSection';
import AdvertSection from '@/components/Advertsection';
import districtLogo from '@/assets/logos/306_D5_District_Logo.png';
import governorLogo from '@/assets/logos/Gavorner_Logo.png';
import lciEmblem from '@/assets/logos/LCI_emblem_black_white_web.png';
import leoEmblem from '@/assets/logos/Leo_Emblem.png';
import leosD5White from '@/assets/logos/Leos_of_D5-White.png';
import leosSLM from '@/assets/logos/Leos_of_Sri_Lanka_Maldives.png';
import lmdLogo from '@/assets/logos/LMD_Logo_2025_2026.png';
import clubLogo from '@/assets/logos/Club_Logo_2025.png';
import grandCircleLogo from '@/assets/logos/Leos_of_Grand_Circle_White.png';
import leoLionWhite from '@/assets/logos/Logo_rgb_Leo-Lion_1C_White (1).png';
import ambitionImage from '@/assets/about/ambision.jpg';
import leadershipImage from '@/assets/about/coreLeadership.jpeg';
import missionImage from '@/assets/about/mission.jpg';
import visionImage from '@/assets/about/vision.jpg';
import MembersSection from './components/MemberSection';
import ProjectsSection from './components/ProjectSection';
import ContactSection from './components/ContactSection';
import CurvedLoop from './components/CurvedLoop';
import FooterSection from './components/FooterSection';
import { useInView, useResponsiveMode } from '@/lib/ui-hooks';
import GlassSurface from '@/components/GlassSurface';
import ShinyText from './components/ShinyText';

const FLOWING_MENU_ITEMS: MenuItemData[] = [
  {
    text: 'Our Vision',
    description:
      'To become the premier platform for youth development in Sri Lanka, fostering innovation and sustainable community impact.',
    image: visionImage,
    link: '#vision',
  },
  {
    text: 'Our Mission',
    description:
      'To empower young leaders through professional development, service-oriented projects, and a global network of excellence.',
    image: missionImage,
    link: '#mission',
  },
  {
    text: 'Our Ambition',
    description:
      'Scaling our community reach to bridge the gap between youth potential and social necessity in every district.',
    image: ambitionImage,
    link: '#ambition',
  },
  {
    text: 'Core Leadership',
    description:
      'Guided by a dedicated board of directors, we prioritize transparency, integrity, and proactive governance in all initiatives.',
    image: leadershipImage,
    link: '#leadership',
  },
];

const IMAGE_LOGOS = [
  { src: districtLogo, alt: 'District Logo' },
  { src: governorLogo, alt: 'Governor Logo' },
  { src: lciEmblem, alt: 'LCI Emblem' },
  { src: leoEmblem, alt: 'Leo Emblem' },
  { src: leosD5White, alt: 'Leos of D5' },
  { src: leosSLM, alt: 'Leos of Sri Lanka Maldives' },
  { src: lmdLogo, alt: 'LMD Logo' },
  { src: leoLionWhite, alt: 'Leo Lion Logo' },
  { src: clubLogo, alt: 'Club Logo' },
  { src: grandCircleLogo, alt: 'Grand Circle Logo' },
];

const NAV_ITEMS = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

function App() {
  const { isMobile, isTablet, isDesktop, canHover, prefersReducedMotion } = useResponsiveMode();
  const heroRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const tooltipFrameRef = useRef<number | null>(null);
  const aboutDetailsRef = useRef<HTMLDivElement | null>(null);
  const hasSelectedAboutItemRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState<MenuItemData | null>(null);
  const [selectedAboutItem, setSelectedAboutItem] = useState<MenuItemData>(FLOWING_MENU_ITEMS[0]);

  const heroInView = useInView(heroRef, 0.18, '15% 0px');

  const positionTooltip = useCallback((clientX: number, clientY: number) => {
    lastMouseRef.current = { x: clientX, y: clientY };

    if (tooltipFrameRef.current !== null) return;

    tooltipFrameRef.current = requestAnimationFrame(() => {
      tooltipFrameRef.current = null;

      const tooltip = tooltipRef.current;
      if (!tooltip) return;

      const padding = 16;
      const offset = 20;
      const maxX = window.innerWidth - tooltip.offsetWidth - padding;
      const maxY = window.innerHeight - tooltip.offsetHeight - padding;
      const nextX = Math.min(Math.max(clientX + offset, padding), Math.max(padding, maxX));
      const nextY = Math.min(Math.max(clientY + offset, padding), Math.max(padding, maxY));

      tooltip.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (tooltipFrameRef.current !== null) {
        cancelAnimationFrame(tooltipFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const anchorLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));

    const handleAnchorClick = (event: Event) => {
      const link = event.currentTarget as HTMLAnchorElement;
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', href);
    };

    anchorLinks.forEach(link => link.addEventListener('click', handleAnchorClick));
    return () => anchorLinks.forEach(link => link.removeEventListener('click', handleAnchorClick));
  }, []);

  useEffect(() => {
    if (!hoveredItem || !canHover) return;
    positionTooltip(lastMouseRef.current.x, lastMouseRef.current.y);
  }, [canHover, hoveredItem, positionTooltip]);

  useEffect(() => {
    if (!isMobile) return;
    if (!hasSelectedAboutItemRef.current) {
      hasSelectedAboutItemRef.current = true;
      return;
    }

    aboutDetailsRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
    });
  }, [isMobile, prefersReducedMotion, selectedAboutItem]);

  const handleAboutMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (!canHover || !hoveredItem) return;
    positionTooltip(event.clientX, event.clientY);
  };

  const handleHoverChange = (item: MenuItemData | null) => {
    setHoveredItem(item);

    if (!item && tooltipRef.current) {
      tooltipRef.current.style.transform = 'translate3d(-9999px, -9999px, 0)';
    }
  };

  const handleAboutSelect = (item: MenuItemData) => {
    setSelectedAboutItem(item);
    if (isMobile) {
      setHoveredItem(null);
    }
  };

  const heroEffectsPaused = prefersReducedMotion || !heroInView;
  const heroRibbonThickness = isMobile ? 20 : isTablet ? 24 : 30;
  const heroLogoHeight = isMobile ? 46 : isTablet ? 56 : 70;
  const heroLogoGap = isMobile ? 32 : isTablet ? 44 : 60;

  return (
    <div className="relative w-full overflow-x-clip bg-[#0a0a0a] text-white">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-5">
        <GlassSurface
          width="min(620px, calc(100vw - 1rem))"
          height={isMobile ? 60 : 70}
          borderRadius={999}
          blur={18}
          brightness={52}
          opacity={0.98}
          backgroundOpacity={0.08}
          distortionScale={-70}
          greenOffset={4}
          blueOffset={8}
          className="pointer-events-none border border-white/20 bg-black/70 shadow-[0_10px_35px_rgba(0,0,0,0.32)]"
        >
          <nav className="flex h-full w-full items-center justify-center px-2 sm:px-6">
            <div className="flex w-full items-center justify-between gap-1 sm:w-auto sm:justify-center sm:gap-3">
              {NAV_ITEMS.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  className="pointer-events-auto rounded-full px-2 py-2 text-center font-inter text-[0.9rem] font-normal text-white/92 transition-all duration-300 hover:bg-white/6 hover:text-white sm:px-8 sm:text-[1.05rem]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </GlassSurface>
      </div>

      <section
        id="top"
        ref={heroRef}
        className="relative flex min-h-screen min-h-[100svh] w-full items-center overflow-hidden"
      >
        <div className="absolute inset-y-[-12%] -left-[22vw] -right-[22vw] z-0 h-[124%] sm:inset-0 sm:left-0 sm:right-0 sm:h-full">
          <DarkVeil
            hueShift={0}
            noiseIntensity={0.05}
            scanlineIntensity={0}
            speed={1}
            scanlineFrequency={5}
            warpAmount={1}
            resolutionScale={isMobile ? 0.72 : isTablet ? 0.84 : 1}
            paused={heroEffectsPaused}
          />
        </div>

        <div className="absolute inset-0 z-0 opacity-80">
          <Ribbons
            baseThickness={heroRibbonThickness}
            colors={['#5227FF']}
            speedMultiplier={isMobile ? 0.38 : 0.5}
            maxAge={isMobile ? 320 : 500}
            pointCount={isMobile ? 32 : 50}
            enableFade={false}
            enableShaderEffect={false}
            paused={heroEffectsPaused}
          />
        </div>

        <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-6 pb-16 pt-28 text-center pointer-events-none sm:px-10 md:px-16">
          <p className="font-bebas text-[clamp(2.75rem,8vw,4rem)] font-bold uppercase tracking-[0.08em]">
            Leo Club of
          </p>
          <h1 className="font-bebas text-[clamp(4.4rem,14vw,8.3rem)] uppercase leading-[0.86] tracking-[0.02em]">
            <ShinyText
              text="COLOMBO GRAND CIRCLE"
              speed={2}
              delay={0}
              color="#ceceff"
              shineColor="#ffffff"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
            />
          </h1>
          <p className="mt-5 max-w-2xl text-sm text-gray-300 sm:text-base md:text-xl">
            Empowering the next generation of leaders through service, fellowship, and bold community impact.
          </p>
          <GlassSurface
            width="auto"
            height="auto"
            borderRadius={999}
            blur={18}
            brightness={64}
            opacity={0.94}
            backgroundOpacity={0.14}
            distortionScale={-90}
            greenOffset={6}
            blueOffset={12}
            className="pointer-events-auto mt-10 sm:mt-12"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-3 text-sm font-medium uppercase tracking-[0.16em] text-white transition-transform duration-300 hover:scale-[1.02] sm:px-10 sm:py-4 sm:text-base"
            >
              Join Us <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          </GlassSurface>
        </main>
      </section>

      <div className="relative z-20 h-[124px] overflow-hidden border-y border-white/5 bg-black/40 backdrop-blur-md sm:h-[148px] md:h-[180px]">
        <LogoLoop
          logos={IMAGE_LOGOS}
          speed={isMobile ? 55 : isTablet ? 75 : 100}
          direction="left"
          logoHeight={heroLogoHeight}
          gap={heroLogoGap}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#0a0a0a"
          ariaLabel="Leo Club partner and district logos"
        />
      </div>

      <section
        id="about"
        className="relative z-10 bg-[#0a0a0a] py-16 sm:py-20 md:py-24"
        onMouseMove={handleAboutMouseMove}
        onMouseLeave={() => handleHoverChange(null)}
      >
        {canHover && hoveredItem && (
          <GlassSurface
            ref={tooltipRef}
            width="min(22rem, calc(100vw - 2rem))"
            height="auto"
            borderRadius={24}
            blur={22}
            brightness={60}
            opacity={0.95}
            backgroundOpacity={0.12}
            distortionScale={-110}
            greenOffset={6}
            blueOffset={12}
            className="pointer-events-none fixed left-0 top-0 z-50 hidden shadow-2xl md:flex"
            style={{ transform: 'translate3d(-9999px, -9999px, 0)' }}
          >
            <div className="flex w-full flex-col gap-4 p-1 text-left">
              <img
                src={hoveredItem.image}
                alt={hoveredItem.text}
                className="h-32 w-full rounded-[18px] object-cover"
              />
              <div>
                <h3 className="mb-2 text-lg font-bold text-white">{hoveredItem.text}</h3>
                <p className="text-sm leading-6 text-gray-300">{hoveredItem.description}</p>
              </div>
            </div>
          </GlassSurface>
        )}

        <div className="mx-auto mb-10 max-w-5xl px-6 text-center sm:mb-12 md:mb-16">
          <p className="font-inter text-xs font-medium uppercase tracking-[0.32em] text-white/45 sm:text-sm">
            About Us
          </p>
          <h2 className="font-bebas text-[clamp(3.4rem,13vw,8rem)] uppercase leading-[0.88]">
            Who Are We?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            Meet the vision, ambition, and leadership principles that shape how the Leo Club of Colombo Grand Circle
            serves its members and community.
          </p>
        </div>

        <div className="w-full pointer-events-auto">
          <FlowingMenu
            items={FLOWING_MENU_ITEMS}
            speed={prefersReducedMotion ? 22 : isMobile ? 18 : 14}
            textColor="#ffffff"
            bgColor="#060010"
            marqueeBgColor="#ffffff"
            marqueeTextColor="#060010"
            borderColor="#ffffff"
            itemMinHeight={isMobile ? 72 : isTablet ? 80 : 88}
            disableAnimations={prefersReducedMotion}
            onItemHoverChange={canHover ? handleHoverChange : undefined}
            onItemSelect={handleAboutSelect}
          />
        </div>

        {(!canHover || isMobile) && (
          <div ref={aboutDetailsRef} className="mx-auto mt-8 max-w-4xl px-6">
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={28}
              blur={22}
              brightness={60}
              opacity={0.95}
              backgroundOpacity={0.12}
              distortionScale={-110}
              greenOffset={6}
              blueOffset={12}
            >
              <div className="grid w-full gap-4 p-2 sm:grid-cols-[160px_minmax(0,1fr)]">
                <img
                  src={selectedAboutItem.image}
                  alt={selectedAboutItem.text}
                  className="h-40 w-full rounded-[20px] object-cover sm:h-full"
                />
                <div className="flex flex-col justify-center text-left">
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/45">Selected</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{selectedAboutItem.text}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-300">{selectedAboutItem.description}</p>
                </div>
              </div>
            </GlassSurface>
          </div>
        )}
      </section>

      <section className="w-full px-4 py-6 sm:px-6 md:px-8">
        <MagicBento
          textAutoHide
          enableStars={!isMobile && !prefersReducedMotion}
          enableSpotlight={isDesktop && !prefersReducedMotion}
          enableBorderGlow
          enableTilt={isDesktop && !prefersReducedMotion}
          enableMagnetism={false}
          clickEffect={!prefersReducedMotion}
          spotlightRadius={isDesktop ? 400 : 260}
          particleCount={isDesktop ? 12 : 6}
          glowColor="132, 0, 255"
          disableAnimations={prefersReducedMotion || isMobile}
        />
      </section>

      <TimelineSection />
      <AdvertSection />
      <MembersSection />
      <ProjectsSection />
      <ContactSection />

      <CurvedLoop
        marqueeText="LEO • COLOMBO GRAND CIRCLE •"
        speed={prefersReducedMotion ? 0.8 : isMobile ? 1.2 : 2}
        curveAmount={isMobile ? 170 : isTablet ? 240 : 320}
        direction="right"
        interactive={canHover && !prefersReducedMotion}
        className="custom-text-style"
      />

      <FooterSection />
    </div>
  );
}

export default App;
