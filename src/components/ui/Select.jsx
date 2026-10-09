import { cn } from '@/utils/cn'
import { Icon } from './Icon'
import { CONTROL_BASE } from './controlStyles'

/** Dropdown (native <select>), styled like Input. Pass <option> elements as children. */
export function Select({ icon, className, children, ...rest }) {
  return (
    <div className="relative">
      {icon && (
        <Icon
          name={icon}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
        />
      )}

      <select
        {...rest}
        className={cn(CONTROL_BASE, 'h-10 appearance-none pr-9', icon ? 'pl-9' : 'pl-3', className)}
      >
        {children}
      </select>

      <Icon
        name="chevronDown"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  )
}
