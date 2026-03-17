import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { FC, PointerEvent } from 'react';

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  className?: string;
  curveAmount?: number;
  direction?: 'left' | 'right';
  interactive?: boolean;
}

const CurvedLoop: FC<CurvedLoopProps> = ({
  marqueeText = '',
  speed = 2,
  className,
  curveAmount = 400,
  direction = 'left',
  interactive = true,
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText) + '\u00A0';
  }, [marqueeText]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<SVGTextElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const [spacing, setSpacing] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const uid = useId();
  const pathId = `curve-${uid}`;
  const pathD = `M-80,60 Q720,${60 + curveAmount} 1520,60`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef<'left' | 'right'>(direction);
  const velRef = useRef(0);
  const offsetRef = useRef(0);

  const totalText = spacing
    ? Array(Math.ceil(1800 / spacing) + 2)
        .fill(text)
        .join('')
    : text;
  const ready = spacing > 0;

  useEffect(() => {
    dirRef.current = direction;
  }, [direction]);

  useEffect(() => {
    const measure = () => {
      if (!measureRef.current) return;
      setSpacing(measureRef.current.getComputedTextLength());
    };

    measure();

    const container = containerRef.current;
    if (!container || !window.ResizeObserver) {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [text, className, curveAmount]);

  useEffect(() => {
    if (!spacing || !textPathRef.current) return;

    const initialOffset = -spacing;
    offsetRef.current = initialOffset;
    textPathRef.current.setAttribute('startOffset', `${initialOffset}px`);
  }, [spacing]);

  useEffect(() => {
    if (!spacing || !ready || !textPathRef.current) return;

    let frame = 0;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed;
        let nextOffset = offsetRef.current + delta;

        if (nextOffset <= -spacing) nextOffset += spacing;
        if (nextOffset > 0) nextOffset -= spacing;

        offsetRef.current = nextOffset;
        textPathRef.current.setAttribute('startOffset', `${nextOffset}px`);
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [ready, spacing, speed]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || !ready) return;

    dragRef.current = true;
    setIsDragging(true);
    lastXRef.current = event.clientX;
    velRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;

    const deltaX = event.clientX - lastXRef.current;
    lastXRef.current = event.clientX;
    velRef.current = deltaX;

    let nextOffset = offsetRef.current + deltaX;
    if (nextOffset <= -spacing) nextOffset += spacing;
    if (nextOffset > 0) nextOffset -= spacing;

    offsetRef.current = nextOffset;
    textPathRef.current.setAttribute('startOffset', `${nextOffset}px`);
  };

  const endDrag = () => {
    if (!interactive) return;

    dragRef.current = false;
    setIsDragging(false);
    if (velRef.current !== 0) {
      dirRef.current = velRef.current > 0 ? 'right' : 'left';
    }
  };

  const cursorStyle = interactive ? (isDragging ? 'grabbing' : 'grab') : 'auto';

  return (
    <div
      ref={containerRef}
      className="flex w-full items-center justify-center px-4 py-12 sm:px-6 sm:py-14 md:px-8 md:py-16"
      style={{ visibility: ready ? 'visible' : 'hidden', cursor: cursorStyle }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
      <svg
        className="block w-full select-none overflow-visible text-[clamp(3.8rem,14vw,6rem)] font-bold uppercase leading-none"
        viewBox="0 0 1440 220"
      >
        <text
          ref={measureRef}
          xmlSpace="preserve"
          style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}
        >
          {text}
        </text>

        <defs>
          <path id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>

        {ready && (
          <text xmlSpace="preserve" className={`fill-white ${className ?? ''}`}>
            <textPath ref={textPathRef} href={`#${pathId}`} startOffset="0px" xmlSpace="preserve">
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};

export default CurvedLoop;
