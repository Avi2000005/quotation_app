import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, type = 'text', id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:pointer-events-none transition-all',
            error && 'border-destructive focus:ring-destructive focus:border-destructive',
            className
          )}
          {...props}
        />
        {error && (
          <span className="block text-xs text-destructive mt-1 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
