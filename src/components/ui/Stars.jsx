import { cn } from '@/utils/cn'
import { Icon } from './Icon'

const STAR_NUMBERS = [1, 2, 3, 4, 5]

/** Row of 5 stars, filled up to `value` (rounded). Display only. */
export function Stars({ value, size = 14, className }) {
  const filledCount = Math.round(value)

  return (
    <span
      className={cn('inline-flex gap-0.5 text-star', className)}
      aria-label={`${value} out of 5`}
    >
      {STAR_NUMBERS.map((n) => (
        <Icon
          key={n}
          name="star"
          size={size}
          strokeWidth={1.5}
          filled={n <= filledCount}
          className={n <= filledCount ? undefined : 'text-line-strong'}
        />
      ))}
    </span>
  )
}
