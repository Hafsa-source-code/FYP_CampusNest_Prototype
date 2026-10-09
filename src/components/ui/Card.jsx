import { cn } from '@/utils/cn'

/**
 * White box with border and soft shadow.
 * padded: adds inner spacing (default true)
 * as: render as another tag, e.g. as="section" or as="article"
 */
export function Card({ as: Tag = 'div', padded = true, className, children, ...rest }) {
  return (
    <Tag
      {...rest}
      className={cn(
        'rounded-lg border border-line bg-surface shadow-card',
        padded && 'p-5 sm:p-6',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
