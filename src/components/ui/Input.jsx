import { cn } from '@/utils/cn'
import { Icon } from './Icon'
import { CONTROL_BASE, CONTROL_INVALID } from './controlStyles'

/**
 * Text input.
 * icon: icon name shown inside on the left
 * suffix: anything shown inside on the right (e.g. a button)
 * invalid: red border
 * inputSize: md | lg
 */
export function Input({ icon, suffix, invalid = false, inputSize = 'md', className, ...rest }) {
  const isLarge = inputSize === 'lg'

  return (
    <div className="relative">
      {icon && (
        <Icon
          name={icon}
          size={isLarge ? 18 : 16}
          className={cn(
            'pointer-events-none absolute top-1/2 -translate-y-1/2 text-subtle',
            isLarge ? 'left-3.5' : 'left-3',
          )}
        />
      )}

      <input
        {...rest}
        className={cn(
          CONTROL_BASE,
          isLarge ? 'h-11 pl-4 pr-4' : 'h-10 pl-3 pr-3',
          icon && (isLarge ? 'pl-11' : 'pl-9'),
          suffix && 'pr-11',
          invalid && CONTROL_INVALID,
          className,
        )}
      />

      {suffix && <div className="absolute right-1.5 top-1/2 -translate-y-1/2">{suffix}</div>}
    </div>
  )
}
