import { cn } from '@/utils/cn'

/**
 * Data table. `head` is a list of column titles:
 * either plain text, or { label, align: 'right', className }.
 * Rows go in as children (<tr> with <Td> cells).
 */
export function Table({ head, className, children }) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-body">
        <thead>
          <tr className="border-b border-line">
            {head.map((column, index) => {
              const {
                label,
                align,
                className: columnClass,
              } = typeof column === 'string' ? { label: column } : column
              return (
                <th
                  key={index}
                  className={cn(
                    'h-10 whitespace-nowrap px-4 text-caption font-medium text-muted first:pl-5 last:pr-5',
                    align === 'right' ? 'text-right' : 'text-left',
                    columnClass,
                  )}
                >
                  {label}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  )
}
