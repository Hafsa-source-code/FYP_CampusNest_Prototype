import { cn } from '@/utils/cn'
import { Icon } from './Icon'
import { TONE_STYLES } from './toneStyles'

const DOT_COLORS = {
  neutral: 'bg-subtle',
  brand: 'bg-brand-500',
  success: 'bg-success',
  warning: 'bg-[#C98A12]',
  danger: 'bg-danger',
}

/**
 * Small coloured label.
 * tone: neutral | brand | success | warning | danger
 * dot: shows a small coloured dot before the text
 */
export function Badge({ tone = 'neutral', dot = false, icon, className, children }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-[6px] px-2 text-caption font-medium',
        TONE_STYLES[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', DOT_COLORS[tone])} />}
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  )
}
