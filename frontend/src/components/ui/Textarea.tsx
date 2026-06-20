import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={cn(
            'flex min-h-[80px] w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:pointer-events-none transition-all',
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

Textarea.displayName = 'Textarea';
