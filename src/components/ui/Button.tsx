'use client';

import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}) {
  const {
    variant = 'primary',
    size = 'md',
    className,
    disabled,
    ...rest
  } = props;
  
  const baseClass = 'rounded-md font-medium transition-colors focus-visible:outline-none disabled:opacity-50';
  const variants: Record<string, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border border-primary text-primary hover:bg-primary/10',
    ghost: 'hover:bg-gray-100',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const variantClass = variants[variant] || '';
  const sizeClass = sizes[size] || '';
  
  return (
    <button
      className={clsx(baseClass, variantClass, sizeClass, className)}
      disabled={disabled}
      {...rest}
    />
  );
}
