import React from 'react';
import { useResponsive } from '../../design-system/useResponsive';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

interface ResponsiveBreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
}

export function ResponsiveBreadcrumbs({ items, onNavigate }: ResponsiveBreadcrumbsProps) {
  const { isMobile } = useResponsive();

  // On mobile, show only first and last item with ellipsis
  const displayItems = isMobile && items.length > 2
    ? [items[0], { label: '...', path: undefined }, items[items.length - 1]]
    : items;

  return (
    <nav className="flex items-center gap-2 mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 flex-wrap">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-[var(--text-tertiary)]`} />
              )}
              
              {isEllipsis ? (
                <span className="text-[var(--text-tertiary)] text-sm">...</span>
              ) : isLast ? (
                <span className={`
                  text-[var(--text-primary)]
                  font-medium
                  ${isMobile ? 'text-sm' : 'text-base'}
                  truncate max-w-[200px]
                `}>
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => item.path && onNavigate?.(item.path)}
                  className={`
                    flex items-center gap-1.5
                    text-[var(--text-secondary)]
                    hover:text-[var(--primary)]
                    transition-colors
                    ${isMobile ? 'text-sm' : 'text-base'}
                  `}
                >
                  {index === 0 && <Home className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />}
                  <span className="truncate max-w-[150px]">{item.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
