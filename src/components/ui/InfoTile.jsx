import { cn } from '@/utils/cn'
import { IconCircle } from './IconCircle'

const SIZES = {
  md: { circle: 32, box: 'px-3 py-2.5 gap-2.5', label: 'text-tiny', value: 'text-small' },
  lg: { circle: 40, box: 'p-4 gap-3', label: 'text-caption', value: 'text-body-lg' },
}

/**
 * Icon + small grey label + value. Used for facts like "Move-in: 1 Oct".
 * boxed: white box with border (false = plain row, no box)
 * size: md | lg
 * The value can be passed as `value` or as children.
 */
export function InfoTile({ icon, label, value, boxed = true, size = 'md', children }) {
  const s = SIZES[size]

  return (
    <div
      className={cn(
        'flex items-center',
        s.box,
        boxed ? 'rounded-lg border border-line bg-surface' : 'px-0',
      )}
    >
      <IconCircle icon={icon} size={s.circle} />
      <div className="min-w-0">
        <p className={cn('text-muted', s.label)}>{label}</p>
        <div className={cn('truncate font-semibold text-ink', s.value)}>{value ?? children}</div>
      </div>
    </div>
  )
}
