import { cn } from '@/utils/cn'
import { Icon } from './Icon'
import { TONE_STYLES } from './toneStyles'

// Extra tones only circles use, on top of the shared Badge/Notice tones
export const CIRCLE_TONES = {
  ...TONE_STYLES,
  muted: 'bg-sunken text-muted',
  star: 'bg-[#FDF3D8] text-star',
  solid: 'bg-brand-700 text-white',
}

/**
 * Icon inside a soft coloured circle. Used beside titles, stats and info rows.
 * size: circle width in px (the icon scales with it)
 * tone: brand | success | warning | danger | neutral | muted | star | solid
 */
export function IconCircle({ icon, size = 40, tone = 'brand', className }) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full',
        CIRCLE_TONES[tone],
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Icon name={icon} size={Math.round(size * 0.45)} />
    </span>
  )
}
