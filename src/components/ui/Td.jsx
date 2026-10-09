import { cn } from '@/utils/cn'

/** One table cell, spaced to match Table. */
export function Td({ align, className, children }) {
  return (
    <td
      className={cn(
        'h-14 px-4 align-middle first:pl-5 last:pr-5',
        align === 'right' && 'text-right',
        className,
      )}
    >
      {children}
    </td>
  )
}
