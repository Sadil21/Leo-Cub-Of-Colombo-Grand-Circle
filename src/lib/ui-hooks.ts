import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;

const getWindowWidth = () =>
  typeof window === 'undefined' ? TABLET_BREAKPOINT : window.innerWidth;

export function useResponsiveMode() {
  const [width, setWidth] = useState(getWindowWidth);
  const [canHover, setCanHover] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      setWidth(window.innerWidth);
      setCanHover(hoverQuery.matches);
      setPrefersReducedMotion(motionQuery.matches);
    };

    update();
    window.addEventListener('resize', update);
    hoverQuery.addEventListener('change', update);
    motionQuery.addEventListener('change', update);

    return () => {
      window.removeEventListener('resize', update);
      hoverQuery.removeEventListener('change', update);
      motionQuery.removeEventListener('change', update);
    };
  }, []);

  return {
    width,
    isMobile: width < MOBILE_BREAKPOINT,
    isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
    isDesktop: width >= TABLET_BREAKPOINT,
    canHover,
    prefersReducedMotion,
  };
}

export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  threshold = 0.15,
  rootMargin = '0px'
) {
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin, threshold]);

  return isInView;
}
