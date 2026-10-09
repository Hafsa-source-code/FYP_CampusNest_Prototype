import { cn } from '@/utils/cn'
import { Icon } from './Icon'
import { BUTTON_BASE, BUTTON_VARIANTS } from './buttonStyles'

const SIZES = {
  sm: 'h-8 px-3 text-small',
  md: 'h-10 px-4 text-body',
  lg: 'h-12 px-5 text-body-lg',
}

/**
 * Main button.
 * variant: primary | secondary | ghost | danger | danger-ghost | inverse
 * size: sm | md | lg
 * icon / iconRight: icon name shown before / after the text
 * arrow: adds the arrow block on the right side
 * full: stretches to full width
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  arrow = false,
  full = false,
  type = 'button',
  className,
  children,
  ...rest
}) {
  const iconSize = size === 'sm' ? 14 : 16
  const isSolid = variant === 'primary' || variant === 'danger'

  return (
    <button
      type={type}
      {...rest}
      className={cn(
        BUTTON_BASE,
        BUTTON_VARIANTS[variant],
        SIZES[size],
        full && 'w-full',
        arrow && 'overflow-hidden pr-0',
        className,
      )}
    >
      <span
        className={cn('inline-flex items-center justify-center gap-2', arrow && full && 'flex-1')}
      >
        {icon && <Icon name={icon} size={iconSize} />}
        {children}
        {iconRight && <Icon name={iconRight} size={iconSize} />}
      </span>

      {arrow && (
        <span
          className={cn(
            'flex items-center self-stretch border-l',
            size === 'lg' ? 'ml-3 px-4' : 'ml-2 px-3',
            isSolid ? 'border-white/20 bg-black/15' : 'border-current/20',
          )}
        >
          <Icon name="arrowRight" size={iconSize} />
        </span>
      )}
    </button>
  )
}
