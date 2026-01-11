import React, { useEffect } from 'react';
import { useResponsive } from '../../design-system/useResponsive';
import { X } from 'lucide-react';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
  closeOnOverlay?: boolean;
}

export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
  closeOnOverlay = true,
}: ResponsiveModalProps) {
  const { isMobile } = useResponsive();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Modal Content */}
      <div
        className={`
          relative
          w-full
          ${isMobile ? 'max-w-full h-full' : sizeClasses[size]}
          bg-white
          ${isMobile ? 'rounded-none' : 'rounded-xl'}
          shadow-2xl
          ${isMobile ? 'flex flex-col' : 'max-h-[90vh] flex flex-col'}
          transform transition-all
        `}
      >
        {/* Header */}
        {title && (
          <div className={`
            flex items-center justify-between
            ${isMobile ? 'p-4' : 'p-6'}
            border-b border-[var(--border)]
          `}>
            <h2 className={`
              font-semibold text-[var(--text-primary)]
              ${isMobile ? 'text-lg' : 'text-xl'}
            `}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--hover-bg)] rounded-lg transition-colors touch-target"
            >
              <X className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className={`
          flex-1
          overflow-y-auto
          ${isMobile ? 'p-4' : 'p-6'}
        `}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`
            ${isMobile ? 'p-4' : 'p-6'}
            border-t border-[var(--border)]
            flex items-center justify-end gap-3
          `}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

interface ResponsiveSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'right' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
  footer?: React.ReactNode;
}

export function ResponsiveSheet({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
  footer,
}: ResponsiveSheetProps) {
  const { isMobile } = useResponsive();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Mobile always uses bottom sheet
  const actualPosition = isMobile ? 'bottom' : position;

  const sizeClasses = {
    sm: actualPosition === 'right' ? 'w-96' : 'h-[60vh]',
    md: actualPosition === 'right' ? 'w-[500px]' : 'h-[70vh]',
    lg: actualPosition === 'right' ? 'w-[700px]' : 'h-[80vh]',
  };

  const positionClasses = {
    right: 'right-0 top-0 bottom-0',
    bottom: 'bottom-0 left-0 right-0',
  };

  const transformClasses = {
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
    bottom: isOpen ? 'translate-y-0' : 'translate-y-full',
  };

  return (
    <div className="fixed inset-0 z-[var(--z-modal)]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet Content */}
      <div
        className={`
          absolute
          ${positionClasses[actualPosition]}
          ${isMobile ? 'w-full' : sizeClasses[size]}
          bg-white
          ${actualPosition === 'bottom' ? 'rounded-t-2xl' : ''}
          shadow-2xl
          flex flex-col
          transform transition-transform duration-300
          ${transformClasses[actualPosition]}
        `}
      >
        {/* Drag indicator for bottom sheet */}
        {actualPosition === 'bottom' && (
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-12 h-1 bg-[var(--border-medium)] rounded-full" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className={`
            flex items-center justify-between
            ${isMobile ? 'p-4' : 'p-6'}
            border-b border-[var(--border)]
          `}>
            <h2 className={`
              font-semibold text-[var(--text-primary)]
              ${isMobile ? 'text-lg' : 'text-xl'}
            `}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--hover-bg)] rounded-lg transition-colors touch-target"
            >
              <X className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className={`
          flex-1
          overflow-y-auto
          ${isMobile ? 'p-4' : 'p-6'}
        `}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`
            ${isMobile ? 'p-4' : 'p-6'}
            border-t border-[var(--border)}
            flex items-center ${isMobile ? 'flex-col' : 'justify-end'} gap-3
          `}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
