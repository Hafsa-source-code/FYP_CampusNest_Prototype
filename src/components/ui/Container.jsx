import { cn } from '@/utils/cn'

/** Full-width page frame with the same side spacing on every page. */
export function Container({ className, children }) {
  return <div className={cn('w-full px-4 sm:px-6 lg:px-10 2xl:px-16', className)}>{children}</div>
}
