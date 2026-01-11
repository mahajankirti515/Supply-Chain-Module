import React, { useState } from 'react';
import { useResponsive } from '../../design-system/useResponsive';
import { ResponsiveButton } from './ResponsiveButton';
import { ResponsiveInput, ResponsiveSelect } from './ResponsiveInput';
import { ResponsiveSheet } from './ResponsiveModal';
import { Filter, Download, Upload, FileText, X } from 'lucide-react';

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'date' | 'text' | 'daterange';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface ResponsiveFiltersProps {
  filters: FilterOption[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
  onApply: () => void;
}

/**
 * Universal Filter Component
 * - Desktop: Expands inline below filter button
 * - Tablet: Opens as right-side sheet
 * - Mobile: Opens as bottom sheet
 */
export function ResponsiveFilters({
  filters,
  values,
  onChange,
  onReset,
  onApply,
}: ResponsiveFiltersProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [isOpen, setIsOpen] = useState(false);

  const FilterContent = () => (
    <div className="flex flex-col gap-4">
      {filters.map((filter) => (
        <div key={filter.key} className="flex flex-col gap-2">
          {filter.type === 'select' && filter.options && (
            <ResponsiveSelect
              label={filter.label}
              value={values[filter.key] || ''}
              onChange={(e) => onChange(filter.key, e.target.value)}
              options={[
                { value: '', label: `All ${filter.label}` },
                ...filter.options,
              ]}
            />
          )}
          {filter.type === 'text' && (
            <ResponsiveInput
              label={filter.label}
              value={values[filter.key] || ''}
              onChange={(e) => onChange(filter.key, e.target.value)}
              placeholder={filter.placeholder}
            />
          )}
          {filter.type === 'date' && (
            <ResponsiveInput
              label={filter.label}
              type="date"
              value={values[filter.key] || ''}
              onChange={(e) => onChange(filter.key, e.target.value)}
            />
          )}
          {filter.type === 'daterange' && (
            <div className="grid grid-cols-2 gap-2">
              <ResponsiveInput
                label="From"
                type="date"
                value={values[`${filter.key}_from`] || ''}
                onChange={(e) => onChange(`${filter.key}_from`, e.target.value)}
              />
              <ResponsiveInput
                label="To"
                type="date"
                value={values[`${filter.key}_to`] || ''}
                onChange={(e) => onChange(`${filter.key}_to`, e.target.value)}
              />
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-2 mt-4">
        <ResponsiveButton
          variant="ghost"
          onClick={() => {
            onReset();
            setIsOpen(false);
          }}
          fullWidth={isMobile}
        >
          Reset
        </ResponsiveButton>
        <ResponsiveButton
          variant="primary"
          onClick={() => {
            onApply();
            setIsOpen(false);
          }}
          fullWidth={isMobile}
        >
          Apply Filters
        </ResponsiveButton>
      </div>
    </div>
  );

  // Desktop: Inline dropdown
  if (isDesktop && isOpen) {
    return (
      <div className="relative">
        <ResponsiveButton
          variant="secondary"
          icon={<Filter className="w-5 h-5" />}
          onClick={() => setIsOpen(false)}
        >
          Filters
        </ResponsiveButton>

        <div
          className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-[var(--border)] p-6 z-[var(--z-dropdown)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-[var(--hover-bg)] rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <FilterContent />
        </div>
      </div>
    );
  }

  // Tablet/Mobile: Side sheet or bottom sheet
  return (
    <>
      <ResponsiveButton
        variant="secondary"
        icon={<Filter className="w-5 h-5" />}
        onClick={() => setIsOpen(true)}
        iconOnly={isMobile}
      >
        {!isMobile && 'Filters'}
      </ResponsiveButton>

      <ResponsiveSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Filters"
        position={isMobile ? 'bottom' : 'right'}
      >
        <FilterContent />
      </ResponsiveSheet>
    </>
  );
}

/**
 * Universal Action Bar Component
 * Contains Filter, Import, Export, and OCR buttons
 */
interface ActionBarProps {
  onImport?: () => void;
  onExport?: () => void;
  onOCR?: () => void;
  filterComponent?: React.ReactNode;
  showImport?: boolean;
  showExport?: boolean;
  showOCR?: boolean;
}

export function ResponsiveActionBar({
  onImport,
  onExport,
  onOCR,
  filterComponent,
  showImport = true,
  showExport = true,
  showOCR = false,
}: ActionBarProps) {
  const { isMobile } = useResponsive();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Filter */}
      {filterComponent}

      {/* Export */}
      {showExport && onExport && (
        <ResponsiveButton
          variant="secondary"
          icon={<Download className="w-5 h-5" />}
          onClick={onExport}
          iconOnly={isMobile}
        >
          {!isMobile && 'Export'}
        </ResponsiveButton>
      )}

      {/* Import */}
      {showImport && onImport && (
        <ResponsiveButton
          variant="secondary"
          icon={<Upload className="w-5 h-5" />}
          onClick={onImport}
          iconOnly={isMobile}
        >
          {!isMobile && 'Import'}
        </ResponsiveButton>
      )}

      {/* OCR */}
      {showOCR && onOCR && (
        <ResponsiveButton
          variant="secondary"
          icon={<FileText className="w-5 h-5" />}
          onClick={onOCR}
          iconOnly={isMobile}
        >
          {!isMobile && 'OCR'}
        </ResponsiveButton>
      )}
    </div>
  );
}

/**
 * Page Header with Title, Breadcrumbs, and Actions
 */
interface ResponsivePageHeaderProps {
  title: string;
  breadcrumbs?: Array<{ label: string; href?: string; path?: string }>;
  actions?: React.ReactNode;
  description?: string;
}

export function ResponsivePageHeader({
  title,
  breadcrumbs,
  actions,
  description,
}: ResponsivePageHeaderProps) {
  const { isMobile } = useResponsive();

  const handleBreadcrumbClick = (path?: string, href?: string) => {
    const route = path || href;
    if (route) {
      const event = new CustomEvent('navigate', { detail: { path: route } });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm mb-2">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {crumb.href || crumb.path ? (
                <button
                  onClick={() => handleBreadcrumbClick(crumb.path, crumb.href)}
                  className="text-[#718096] hover:text-[#0A6659] transition-colors cursor-pointer"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-[#262C36]">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="text-[#718096]">/</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title and Actions */}
      <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'}`}>
        <div>
          <h1 className="text-[#262C36] mb-1">{title}</h1>
          {description && (
            <p className="text-[#718096] text-sm">{description}</p>
          )}
        </div>
        {actions && <div className={isMobile ? 'w-full' : 'flex gap-2'}>{actions}</div>}
      </div>
    </div>
  );
}