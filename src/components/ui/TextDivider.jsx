import { cn } from '@/utils/cn'

/** Horizontal line with text in the middle: ──── Or ──── */
export function TextDivider({ className, children }) {
  return (
    <div className={cn('flex items-center gap-3 text-small text-muted', className)}>
      <span className="h-px flex-1 bg-line" />
      {children}
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}
