import React from 'react';
import { useResponsive } from '../../design-system/useResponsive';

interface ResponsiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export function ResponsiveInput({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  className = '',
  id,
  ...props
}: ResponsiveInputProps) {
  const { isMobile } = useResponsive();
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const inputClasses = `
    h-[var(--input-height)]
    w-full
    px-3
    ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    border rounded-[var(--button-radius)]
    transition-all duration-200
    bg-white
    text-[var(--text-primary)]
    placeholder:text-[var(--text-tertiary)]
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:bg-[var(--background-tertiary)] disabled:cursor-not-allowed
    ${error 
      ? 'border-[var(--error)] focus:ring-[var(--error)] focus:border-[var(--error)]' 
      : 'border-[var(--border)] focus:ring-[var(--primary)] focus:border-[var(--primary)]'
    }
    ${isMobile ? 'text-sm' : 'text-base'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className={`
            font-medium text-[var(--text-primary)]
            ${isMobile ? 'text-sm' : 'text-base'}
          `}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`
            absolute top-1/2 -translate-y-1/2
            ${iconPosition === 'left' ? 'left-3' : 'right-3'}
            text-[var(--text-tertiary)]
            pointer-events-none
            ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}
          `}>
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {(error || helperText) && (
        <p className={`
          ${isMobile ? 'text-xs' : 'text-sm'}
          ${error ? 'text-[var(--error)]' : 'text-[var(--text-secondary)]'}
        `}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

interface ResponsiveTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  rows?: number;
}

export function ResponsiveTextarea({
  label,
  error,
  helperText,
  fullWidth = true,
  rows = 4,
  className = '',
  id,
  ...props
}: ResponsiveTextareaProps) {
  const { isMobile } = useResponsive();
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const textareaClasses = `
    w-full
    px-3 py-2.5
    border rounded-[var(--button-radius)]
    transition-all duration-200
    bg-white
    text-[var(--text-primary)]
    placeholder:text-[var(--text-tertiary)]
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:bg-[var(--background-tertiary)] disabled:cursor-not-allowed
    resize-none
    ${error 
      ? 'border-[var(--error)] focus:ring-[var(--error)] focus:border-[var(--error)]' 
      : 'border-[var(--border)] focus:ring-[var(--primary)] focus:border-[var(--primary)]'
    }
    ${isMobile ? 'text-sm' : 'text-base'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className={`
            font-medium text-[var(--text-primary)]
            ${isMobile ? 'text-sm' : 'text-base'}
          `}
        >
          {label}
        </label>
      )}
      
      <textarea
        id={inputId}
        rows={rows}
        className={textareaClasses}
        {...props}
      />
      
      {(error || helperText) && (
        <p className={`
          ${isMobile ? 'text-xs' : 'text-sm'}
          ${error ? 'text-[var(--error)]' : 'text-[var(--text-secondary)]'}
        `}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

interface ResponsiveSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
}

export function ResponsiveSelect({
  label,
  error,
  helperText,
  fullWidth = true,
  options,
  className = '',
  id,
  ...props
}: ResponsiveSelectProps) {
  const { isMobile } = useResponsive();
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const selectClasses = `
    h-[var(--input-height)]
    w-full
    px-3
    border rounded-[var(--button-radius)]
    transition-all duration-200
    bg-white
    text-[var(--text-primary)]
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:bg-[var(--background-tertiary)] disabled:cursor-not-allowed
    appearance-none
    bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5' stroke='%23666666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")]
    bg-[length:20px_20px]
    bg-[position:right_12px_center]
    bg-no-repeat
    pr-10
    ${error 
      ? 'border-[var(--error)] focus:ring-[var(--error)] focus:border-[var(--error)]' 
      : 'border-[var(--border)] focus:ring-[var(--primary)] focus:border-[var(--primary)]'
    }
    ${isMobile ? 'text-sm' : 'text-base'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className={`
            font-medium text-[var(--text-primary)]
            ${isMobile ? 'text-sm' : 'text-base'}
          `}
        >
          {label}
        </label>
      )}
      
      <select
        id={inputId}
        className={selectClasses}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {(error || helperText) && (
        <p className={`
          ${isMobile ? 'text-xs' : 'text-sm'}
          ${error ? 'text-[var(--error)]' : 'text-[var(--text-secondary)]'}
        `}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

interface ResponsiveFormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export function ResponsiveForm({ children, onSubmit, className = '' }: ResponsiveFormProps) {
  const { isMobile, isTablet } = useResponsive();

  return (
    <form 
      onSubmit={onSubmit}
      className={`
        flex flex-col gap-4
        ${isMobile ? 'gap-3' : isTablet ? 'gap-4' : 'gap-5'}
        ${className}
      `}
    >
      {children}
    </form>
  );
}

interface ResponsiveFormRowProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function ResponsiveFormRow({ children, columns = 2, className = '' }: ResponsiveFormRowProps) {
  const { isMobile, isTablet } = useResponsive();

  const gridClasses = {
    1: 'grid-cols-1',
    2: `grid-cols-1 ${isTablet ? 'md:grid-cols-2' : 'lg:grid-cols-2'}`,
    3: `grid-cols-1 ${isTablet ? 'md:grid-cols-2' : 'lg:grid-cols-3'}`,
  };

  return (
    <div className={`
      grid
      ${gridClasses[columns]}
      gap-4
      ${isMobile ? 'gap-3' : 'gap-4'}
      ${className}
    `}>
      {children}
    </div>
  );
}
