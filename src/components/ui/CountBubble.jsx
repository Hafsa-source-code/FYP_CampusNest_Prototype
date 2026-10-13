import { cn } from '@/utils/cn'

/** Small round number, e.g. the active-filter count on the Filters button. */
export function CountBubble({ count, className }) {
  if (!count) return null
  return (
    <span
      className={cn(
        'tabular h-5 min-w-5 rounded-full bg-white px-1.5 text-tiny font-semibold leading-5 text-brand-700',
        className,
      )}
    >
      {count}
    </span>
  )
}
