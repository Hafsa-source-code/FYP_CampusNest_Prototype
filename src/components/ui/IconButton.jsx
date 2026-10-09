import { cn } from '@/utils/cn'
import { Icon } from './Icon'
import { BUTTON_BASE, BUTTON_VARIANTS } from './buttonStyles'

const SIZES = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' }

/**
 * Square button with only an icon.
 * `label` is required: screen readers read it and it shows as a tooltip.
 * `badge`: small red number in the corner (e.g. unread notifications).
 */
export function IconButton({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  badge,
  className,
  ...rest
}) {
  return (
    <button
      type="button"
      {...rest}
      aria-label={label}
      title={label}
      className={cn('relative px-0', BUTTON_BASE, BUTTON_VARIANTS[variant], SIZES[size], className)}
    >
      <Icon name={icon} size={size === 'sm' ? 15 : 18} />
      {!!badge && (
        <span className="tabular absolute right-1.5 top-1.5 h-4 min-w-4 rounded-full bg-danger px-1 text-micro font-semibold leading-4 text-white">
          {badge}
        </span>
      )}
    </button>
  )
}
