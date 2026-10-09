import { cn } from '@/utils/cn'
import { CONTROL_BASE, CONTROL_INVALID } from './controlStyles'

/** Multi-line text box. */
export function Textarea({ invalid = false, className, ...rest }) {
  return (
    <textarea
      {...rest}
      className={cn(
        CONTROL_BASE,
        'resize-none px-3 py-2.5 leading-relaxed',
        invalid && CONTROL_INVALID,
        className,
      )}
    />
  )
}
