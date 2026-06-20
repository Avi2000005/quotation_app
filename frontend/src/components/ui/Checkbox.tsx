import * as React from 'react';
import { cn } from '../../lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <label className="flex items-start space-x-3 cursor-pointer group text-sm text-foreground">
        <input
          type="checkbox"
          id={id}
          ref={ref}
          className={cn(
            'peer h-4 w-4 shrink-0 rounded border border-slate-700 bg-slate-900 text-primary focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none transition-all accent-primary cursor-pointer mt-0.5',
            className
          )}
          {...props}
        />
        <span className="select-none font-medium text-slate-300 group-hover:text-white transition-colors peer-disabled:opacity-50">
          {label}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
