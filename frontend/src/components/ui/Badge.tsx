import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'accent' | 'warning';
}

export function Badge({ className, variant = 'primary', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none';
  
  const variants = {
    primary: 'bg-primary/10 text-primary border border-primary/20',
    secondary: 'bg-slate-800 text-slate-300 border border-slate-700',
    outline: 'text-foreground border border-slate-700 bg-transparent',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    accent: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    warning: 'bg-red-500/10 text-red-400 border border-red-500/20'
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props} />
  );
}
