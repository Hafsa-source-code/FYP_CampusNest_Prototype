import { cn } from '@/utils/cn'
import { ICON_PATHS } from './iconPaths'

/**
 * The one icon component for the whole app.
 * Usage: <Icon name="search" size={16} />
 * Colour comes from the text colour of the parent (currentColor).
 */
export function Icon({ name, size = 16, strokeWidth = 1.75, filled = false, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
      aria-hidden="true"
      // Safe: the markup comes only from our own ICON_PATHS file, never from users
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] ?? '' }}
    />
  )
}
