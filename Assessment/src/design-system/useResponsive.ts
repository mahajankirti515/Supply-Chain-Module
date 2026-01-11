import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'projector';

interface ResponsiveState {
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isProjector: boolean;
  width: number;
}

/**
 * Custom hook to detect current responsive breakpoint
 * Based on KhelKud Admin design system breakpoints
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === 'undefined') {
      return {
        breakpoint: 'desktop',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isProjector: false,
        width: 1280,
      };
    }

    return getResponsiveState(window.innerWidth);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setState(getResponsiveState(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return state;
}

function getResponsiveState(width: number): ResponsiveState {
  if (width >= 1600) {
    return {
      breakpoint: 'projector',
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      isProjector: true,
      width,
    };
  }

  if (width >= 1280) {
    return {
      breakpoint: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isProjector: false,
      width,
    };
  }

  if (width >= 768) {
    return {
      breakpoint: 'tablet',
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      isProjector: false,
      width,
    };
  }

  return {
    breakpoint: 'mobile',
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    isProjector: false,
    width,
  };
}

/**
 * Utility function to get responsive class names
 */
export function getResponsiveClasses(
  mobile?: string,
  tablet?: string,
  desktop?: string,
  projector?: string
): string {
  const classes: string[] = [];

  if (mobile) classes.push(mobile);
  if (tablet) classes.push(`md:${tablet}`);
  if (desktop) classes.push(`lg:${desktop}`);
  if (projector) classes.push(`xl:${projector}`);

  return classes.join(' ');
}
