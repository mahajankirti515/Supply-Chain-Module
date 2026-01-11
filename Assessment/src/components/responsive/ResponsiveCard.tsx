import React from 'react';
import { useResponsive } from '../../design-system/useResponsive';

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export function ResponsiveCard({
  children,
  className = '',
  padding = 'md',
  hover = false,
  clickable = false,
  onClick,
}: ResponsiveCardProps) {
  const { isMobile, isTablet } = useResponsive();

  const paddingClasses = {
    none: 'p-0',
    sm: isMobile ? 'p-3' : isTablet ? 'p-4' : 'p-4',
    md: isMobile ? 'p-3' : isTablet ? 'p-4' : 'p-4',
    lg: isMobile ? 'p-4' : isTablet ? 'p-5' : 'p-6',
  };

  const cardClasses = `
    bg-white
    border border-[var(--border)]
    rounded-[var(--card-radius)]
    ${paddingClasses[padding]}
    transition-all duration-200
    ${hover ? 'hover:shadow-md hover:border-[var(--border-medium)]' : ''}
    ${clickable ? 'cursor-pointer hover:shadow-md' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={cardClasses} onClick={clickable ? onClick : undefined}>
      {children}
    </div>
  );
}

interface ResponsiveStatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

export function ResponsiveStatCard({
  title,
  value,
  icon,
  trend,
  color = 'primary',
}: ResponsiveStatCardProps) {
  const { isMobile, isTablet } = useResponsive();

  const colorClasses = {
    primary: 'bg-[var(--primary-50)] text-[var(--primary)]',
    success: 'bg-[var(--success-50)] text-[var(--success)]',
    warning: 'bg-[var(--warning-50)] text-[var(--warning)]',
    error: 'bg-[var(--error-50)] text-[var(--error)]',
    info: 'bg-[var(--info-50)] text-[var(--info)]',
  };

  return (
    <ResponsiveCard hover>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className={`
            text-[var(--text-secondary)]
            ${isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-sm'}
            mb-2
          `}>
            {title}
          </p>
          <h3 className={`
            font-semibold text-[var(--text-primary)]
            ${isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl'}
          `}>
            {value}
          </h3>
          {trend && (
            <div className={`
              flex items-center gap-1 mt-2
              ${trend.isPositive ? 'text-[var(--success)]' : 'text-[var(--error)]'}
              ${isMobile ? 'text-xs' : 'text-sm'}
            `}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`
            ${colorClasses[color]}
            rounded-lg p-3
            ${isMobile ? 'w-10 h-10' : isTablet ? 'w-12 h-12' : 'w-14 h-14'}
            flex items-center justify-center
          `}>
            <div className={`${isMobile ? 'w-5 h-5' : isTablet ? 'w-6 h-6' : 'w-7 h-7'}`}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </ResponsiveCard>
  );
}

interface ResponsiveCardGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    projector?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveCardGrid({
  children,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
    projector: 4,
  },
  gap = 'md',
  className = '',
}: ResponsiveCardGridProps) {
  const { isMobile, isTablet } = useResponsive();

  const gapClasses = {
    sm: isMobile ? 'gap-3' : isTablet ? 'gap-4' : 'gap-4',
    md: isMobile ? 'gap-4' : isTablet ? 'gap-5' : 'gap-6',
    lg: isMobile ? 'gap-5' : isTablet ? 'gap-6' : 'gap-8',
  };

  return (
    <div className={`
      grid
      ${columns.mobile ? `grid-cols-${columns.mobile}` : 'grid-cols-1'}
      ${columns.tablet ? `md:grid-cols-${columns.tablet}` : ''}
      ${columns.desktop ? `lg:grid-cols-${columns.desktop}` : ''}
      ${columns.projector ? `xl:grid-cols-${columns.projector}` : ''}
      ${gapClasses[gap]}
      ${className}
    `}>
      {children}
    </div>
  );
}

interface ResponsiveCardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function ResponsiveCardHeader({ title, subtitle, actions }: ResponsiveCardHeaderProps) {
  const { isMobile } = useResponsive();

  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex-1">
        <h3 className={`
          font-semibold text-[var(--text-primary)]
          ${isMobile ? 'text-base' : 'text-lg'}
        `}>
          {title}
        </h3>
        {subtitle && (
          <p className={`
            text-[var(--text-secondary)] mt-1
            ${isMobile ? 'text-xs' : 'text-sm'}
          `}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
