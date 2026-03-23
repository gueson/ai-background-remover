'use client';

import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const {
    variant = 'primary',
    className,
    disabled,
    ...rest
  } = props;
  
  const baseClass = 'px-4 py-2 rounded-md font-medium transition-colors focus-visible:outline-none';
  const variants: Record<string, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border border-primary text-primary-foreground hover:bg-primary/90',
  };
  
  const variantClass = variants[variant] || '';
  return (
    <button
      className={clsx(baseClass, variantClass, className)}
      disabled={disabled}
      {...rest}
    />
  );
}