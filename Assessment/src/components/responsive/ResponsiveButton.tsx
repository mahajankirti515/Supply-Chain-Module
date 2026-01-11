import React from 'react';
import { useResponsive } from '../../design-system/useResponsive';

interface ResponsiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export function ResponsiveButton({
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  icon,
  children,
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}: ResponsiveButtonProps) {
  const { isMobile, isTablet } = useResponsive();

  // Auto-adjust size based on breakpoint
  const responsiveSize = isMobile ? 'sm' : isTablet ? 'md' : size;
  
  // Base classes - updated to prevent wrapping and use auto layout
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2
    touch-target
    flex-shrink-0
    whitespace-nowrap
    ${fullWidth ? 'w-full' : ''}
  `;

  // Variant classes
  const variantClasses = {
    primary: `
      bg-[var(--primary)] text-white
      hover:bg-[var(--primary-hover)]
      focus:ring-[var(--primary)]
      active:bg-[var(--primary-700)]
    `,
    secondary: `
      border border-[var(--primary)] text-[var(--primary)]
      bg-transparent
      hover:bg-[var(--primary)] hover:text-white
      focus:ring-[var(--primary)]
    `,
    ghost: `
      text-[var(--text-primary)]
      hover:bg-[var(--hover-bg)]
      focus:ring-[var(--border-medium)]
    `,
    destructive: `
      bg-[var(--error)] text-white
      hover:bg-[var(--error-600)]
      focus:ring-[var(--error)]
    `,
  };

  // Size classes - responsive
  const sizeClasses = {
    sm: `
      h-[var(--button-height-sm)]
      ${iconOnly ? 'w-[var(--button-height-sm)] p-0' : 'px-3'}
      rounded-[var(--radius-md)]
      text-sm
    `,
    md: `
      h-[var(--button-height-md)]
      ${iconOnly ? 'w-[var(--button-height-md)] p-0' : 'px-6'}
      rounded-[var(--button-radius)]
      text-base
    `,
    lg: `
      h-[var(--button-height-lg)]
      ${iconOnly ? 'w-[var(--button-height-lg)] p-0' : 'px-8'}
      rounded-[var(--radius-lg)]
      text-lg
    `,
  };

  // Icon size based on button size
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[responsiveSize]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSizeClasses[responsiveSize]}`} />
      ) : (
        <>
          {icon && <span className={iconSizeClasses[responsiveSize]}>{icon}</span>}
          {!iconOnly && children && <span className={isMobile ? 'hidden sm:inline' : ''}>{children}</span>}
        </>
      )}
    </button>
  );
}