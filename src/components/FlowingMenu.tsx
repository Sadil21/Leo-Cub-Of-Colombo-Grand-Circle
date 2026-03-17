import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface MenuItemData {
  link: string;
  text: string;
  image: string;
  description?: string;
}

interface FlowingMenuProps {
  items?: MenuItemData[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  itemMinHeight?: number;
  disableAnimations?: boolean;
  onItemHoverChange?: (item: MenuItemData | null) => void;
  onItemSelect?: (item: MenuItemData) => void;
}

interface MenuItemProps extends MenuItemData {
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  itemMinHeight: number;
  disableAnimations: boolean;
  isFirst: boolean;
  onItemHoverChange?: (item: MenuItemData | null) => void;
  onItemSelect?: (item: MenuItemData) => void;
}

const findClosestEdge = (
  mouseX: number,
  mouseY: number,
  width: number,
  height: number
): 'top' | 'bottom' => {
  const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
  const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
  return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
};

const MenuItem: React.FC<MenuItemProps> = ({
  link,
  text,
  image,
  description,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  itemMinHeight,
  disableAnimations,
  isFirst,
  onItemHoverChange,
  onItemSelect,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [repetitions, setRepetitions] = useState(4);
  const [partWidth, setPartWidth] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [edge, setEdge] = useState<'top' | 'bottom'>('bottom');

  useEffect(() => {
    const updateMeasurements = () => {
      if (!itemRef.current || !rowRef.current) return;

      const measuredWidth = rowRef.current.offsetWidth;
      const containerWidth = itemRef.current.offsetWidth;
      if (!measuredWidth || !containerWidth) return;

      setPartWidth(measuredWidth);
      setRepetitions(Math.max(4, Math.ceil(containerWidth / measuredWidth) + 2));
    };

    updateMeasurements();

    if (!window.ResizeObserver) {
      window.addEventListener('resize', updateMeasurements);
      return () => window.removeEventListener('resize', updateMeasurements);
    }

    const observer = new ResizeObserver(updateMeasurements);
    if (itemRef.current) observer.observe(itemRef.current);
    if (rowRef.current) observer.observe(rowRef.current);

    return () => observer.disconnect();
  }, [image, text]);

  const handleEnter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const nextEdge = findClosestEdge(
      event.clientX - rect.left,
      event.clientY - rect.top,
      rect.width,
      rect.height
    );

    setEdge(nextEdge);
    setIsActive(true);
    onItemHoverChange?.({ link, text, image, description });
  };

  const handleLeave = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const nextEdge = findClosestEdge(
      event.clientX - rect.left,
      event.clientY - rect.top,
      rect.width,
      rect.height
    );

    setEdge(nextEdge);
    setIsActive(false);
    onItemHoverChange?.(null);
  };

  const selectItem = () => {
    onItemSelect?.({ link, text, image, description });
  };

  const overlayTranslate = isActive ? '0%' : edge === 'top' ? '-101%' : '101%';
  const innerTranslate = isActive ? '0%' : edge === 'top' ? '101%' : '-101%';

  const trackStyle = disableAnimations || !partWidth
    ? undefined
    : ({
        animation: `flowing-menu-marquee ${speed}s linear infinite`,
        '--flowing-menu-offset': `-${partWidth}px`,
      } as React.CSSProperties);

  const repeatedParts = useMemo(
    () =>
      Array.from({ length: repetitions }, (_, idx) => (
        <div
          className="flex shrink-0 items-center"
          key={idx}
          ref={idx === 0 ? rowRef : undefined}
          style={{ color: marqueeTextColor }}
        >
          <span className="px-4 text-[clamp(1.4rem,4vw,3.1rem)] font-normal uppercase leading-none whitespace-nowrap sm:px-6">
            {text}
          </span>
          <div
            className="mx-4 rounded-full bg-cover bg-center sm:mx-6"
            style={{
              width: 'clamp(110px, 16vw, 180px)',
              height: 'clamp(52px, 7vw, 82px)',
              backgroundImage: `url(${image})`,
            }}
          />
        </div>
      )),
    [image, marqueeTextColor, repetitions, text]
  );

  return (
    <div
      ref={itemRef}
      className="relative flex flex-col overflow-hidden text-center"
      style={{
        borderTop: isFirst ? 'none' : `1px solid ${borderColor}`,
        minHeight: `${itemMinHeight}px`,
      }}
    >
      <a
        className="relative flex h-full min-h-full items-center justify-center px-4 py-4 text-center text-[clamp(1.6rem,4.6vw,3.35rem)] font-semibold uppercase no-underline transition-colors duration-300 sm:px-6"
        href={link}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onTouchStart={selectItem}
        onPointerDown={event => {
          if (event.pointerType === 'touch') {
            selectItem();
          }
        }}
        onClick={event => {
          if (onItemSelect) {
            event.preventDefault();
            selectItem();
          }
        }}
        onFocus={() => {
          onItemHoverChange?.({ link, text, image, description });
          selectItem();
        }}
        onBlur={() => onItemHoverChange?.(null)}
        style={{ color: textColor }}
      >
        {text}
      </a>

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          backgroundColor: marqueeBgColor,
          transform: `translate3d(0, ${overlayTranslate}, 0)`,
          transition: 'transform 360ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div
          className="flex h-full items-center overflow-hidden"
          style={{
            transform: `translate3d(0, ${innerTranslate}, 0)`,
            transition: 'transform 360ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <div className="flex h-full w-max items-center will-change-transform" style={trackStyle}>
            {repeatedParts}
          </div>
        </div>
      </div>
    </div>
  );
};

const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = [],
  speed = 15,
  textColor = '#fff',
  bgColor = '#060010',
  marqueeBgColor = '#fff',
  marqueeTextColor = '#060010',
  borderColor = '#fff',
  itemMinHeight = 80,
  disableAnimations = false,
  onItemHoverChange,
  onItemSelect,
}) => {
  return (
    <div className="h-full w-full overflow-hidden" style={{ backgroundColor: bgColor }}>
      <style>{`
        @keyframes flowing-menu-marquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(var(--flowing-menu-offset), 0, 0);
          }
        }
      `}</style>

      <nav className="m-0 flex h-full flex-col p-0">
        {items.map((item, idx) => (
          <MenuItem
            key={item.text}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            itemMinHeight={itemMinHeight}
            disableAnimations={disableAnimations}
            isFirst={idx === 0}
            onItemHoverChange={onItemHoverChange}
            onItemSelect={onItemSelect}
          />
        ))}
      </nav>
    </div>
  );
};

export default FlowingMenu;
