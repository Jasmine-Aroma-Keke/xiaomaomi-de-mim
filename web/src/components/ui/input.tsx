import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
export function Input({className, ...props}: ComponentProps<'input'>) {
  return <input className={cn('w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50', className)} {...props}/>;
}
