import * as SwitchPrimitive from '@radix-ui/react-switch';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
export function Switch({className, ...props}: ComponentProps<typeof SwitchPrimitive.Root>) {
  return <SwitchPrimitive.Root className={cn('inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-muted border border-border data-[state=checked]:bg-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring', className)} {...props}>
    <SwitchPrimitive.Thumb className="block size-4 rounded-full bg-foreground transition-transform translate-x-1 data-[state=checked]:translate-x-6 data-[state=checked]:bg-primary-foreground"/>
  </SwitchPrimitive.Root>;
}
