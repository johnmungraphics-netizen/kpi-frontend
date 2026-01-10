/**
 * Reusable Button Component
 * 
 * A flexible button component with various variants and sizes.
 * Supports icons, loading states, and all common button patterns.
 */

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { IconType } from 'react-icons';

export type ButtonVariant = 
  | 'primary'      // Main action buttons (purple/blue)
  | 'secondary'    // Secondary actions (gray)
  | 'success'      // Success/confirm actions (green)
  | 'danger'       // Destructive actions (red)
  | 'warning'      // Warning actions (yellow/orange)
  | 'ghost'        // Text-only buttons
  | 'outline'      // Outlined buttons
  | 'link';        // Link-style buttons

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: IconType;
  iconPosition?: 'left' | 'right';
  rounded?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      children, 
      onClick, 
      variant = 'primary',
      size = 'md',
      disabled = false,
      type = 'button',
      className = '',
      fullWidth = false,
      loading = false,
      icon: Icon,
      iconPosition = 'left',
      rounded = false,
      ...rest
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses: Record<ButtonVariant, string> = {
      primary: 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 focus:ring-purple-500 shadow-sm',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-500',
      success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500 shadow-sm',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-sm',
      warning: 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 focus:ring-yellow-500 shadow-sm',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500',
      outline: 'bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-50 active:bg-purple-100 focus:ring-purple-500',
      link: 'bg-transparent text-purple-600 hover:text-purple-700 hover:underline focus:ring-0 p-0',
    };
    
    const sizeClasses: Record<ButtonSize, string> = {
      xs: rounded ? 'p-1' : 'px-2 py-1 text-xs',
      sm: rounded ? 'p-1.5' : 'px-3 py-1.5 text-sm',
      md: rounded ? 'p-2' : 'px-4 py-2 text-base',
      lg: rounded ? 'p-3' : 'px-6 py-3 text-lg',
      xl: rounded ? 'p-4' : 'px-8 py-4 text-xl',
    };

    const roundedClasses = rounded ? 'rounded-full' : 'rounded-lg';
    const widthClass = fullWidth ? 'w-full' : '';

    const iconSizes: Record<ButtonSize, number> = {
      xs: 14,
      sm: 16,
      md: 18,
      lg: 22,
      xl: 26,
    };
    
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClasses} ${widthClass} ${className}`.trim()}
        {...rest}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        
        {!loading && Icon && iconPosition === 'left' && (
          <Icon className={children ? 'mr-2' : ''} size={iconSizes[size]} />
        )}
        
        {children}
        
        {!loading && Icon && iconPosition === 'right' && (
          <Icon className={children ? 'ml-2' : ''} size={iconSizes[size]} />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
